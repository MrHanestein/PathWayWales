import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, User, ArrowLeft, Sparkles, Gamepad2 } from 'lucide-react';
import { useScribe } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAssessmentContext, getPersonalizedGreeting, getQuickActions } from '@/hooks/useAssessmentContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceCoachProps {
  onClose: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyber-coach-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const STT_TOKEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-scribe-token`;

const VoiceCoach = ({ onClose }: VoiceCoachProps) => {
  const { data: assessmentData, recommendation, contextString, loading: contextLoading, hasCompletedAssessment } = useAssessmentContext();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isInSimulation, setIsInSimulation] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with personalized or generic greeting
  useEffect(() => {
    if (contextLoading) return;
    
    let greeting: string;
    
    if (hasCompletedAssessment && assessmentData && recommendation) {
      greeting = getPersonalizedGreeting(assessmentData, recommendation);
    } else {
      greeting = `Hello! I'm Eira, your personal cybersecurity career coach. 🏴󠁧󠁢󠁷󠁬󠁳󠁿

I specialise in helping people over 40 in Wales make successful transitions into cyber careers. Whether you're curious about opportunities, worried you're "not technical enough," or just want to explore your options - I'm here to help.

**Tip:** Complete the career assessment first, and I'll be able to give you much more personalised guidance based on your specific background and goals!

What brings you here today?`;
    }

    setMessages([{
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    }]);
  }, [contextLoading, hasCompletedAssessment, assessmentData, recommendation]);

  // Get quick actions based on assessment
  const quickActions = hasCompletedAssessment && assessmentData && recommendation
    ? getQuickActions(assessmentData, recommendation)
    : [
        { label: "What roles suit me?", message: "What cybersecurity roles might suit someone like me?", icon: '🎯' },
        { label: "Do I need to code?", message: "Do I need to know how to code to work in cybersecurity?", icon: '💻' },
        { label: "Am I too old?", message: "I'm over 40 - am I too old to start a career in cybersecurity?", icon: '🤔' },
        { label: "Welsh opportunities", message: "What cybersecurity opportunities are there specifically in Wales?", icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
      ];

  // ElevenLabs Speech-to-Text hook
  const scribe = useScribe({
    modelId: 'scribe_v2_realtime',
    onPartialTranscript: (data) => {
      if (data.text) {
        setInput(prev => {
          const baseText = prev.replace(/\[listening...\].*$/, '').trim();
          return baseText ? `${baseText} ${data.text}` : data.text;
        });
      }
    },
    onCommittedTranscript: (data) => {
      if (data.text) {
        setInput(prev => {
          const baseText = prev.replace(/\[listening...\].*$/, '').trim();
          return baseText ? `${baseText} ${data.text}` : data.text;
        });
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (scribe.isConnected) {
        scribe.disconnect();
      }
    };
  }, [scribe]);

  // Stream chat response with user context
  const streamChat = async (userMessages: Message[], type: string = 'chat') => {
    // Check if this is a simulation request
    const isSimulation = type === 'day-simulation';
    if (isSimulation) {
      setIsInSimulation(true);
    }

    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages.map(m => ({ role: m.role, content: m.content })),
        type,
        userContext: contextString, // Pass the assessment context
        roleTitle: recommendation?.primary.title, // Pass the recommended role for simulations
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status === 402) {
        throw new Error('Usage limit reached. Please try again later.');
      }
      throw new Error('Failed to get response');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let textBuffer = '';

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === 'assistant' && last.timestamp.getTime() > Date.now() - 60000) {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: fullContent } : m
                );
              }
              return [...prev, { role: 'assistant', content: fullContent, timestamp: new Date() }];
            });
          }
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    return fullContent;
  };

  // Text-to-speech
  const speakText = async (text: string) => {
    if (!audioEnabled) return;

    try {
      setIsSpeaking(true);
      
      const cleanText = text
        .replace(/[🏴󠁧󠁢󠁷󠁬󠁳󠁿🎯⚡🔥💰📡🎮💪🤔📚🔄💻]/g, '')
        .replace(/\*\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\n{2,}/g, '\n')
        .slice(0, 2000);

      const response = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        console.error('TTS error:', response.status);
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('TTS failed:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      scribe.disconnect();
      setIsRecording(false);
    } else {
      try {
        const tokenResponse = await fetch(STT_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to get transcription token');
        }

        const { token } = await tokenResponse.json();
        
        if (!token) {
          throw new Error('No token received');
        }

        await scribe.connect({
          token,
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        setIsRecording(true);
        setInput(prev => prev + (prev ? ' ' : '') + '[listening...]');
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast({
          variant: 'destructive',
          title: 'Microphone Error',
          description: error instanceof Error ? error.message : 'Failed to start voice input'
        });
      }
    }
  }, [isRecording, scribe, toast]);

  // Handle quick action button click
  const handleQuickAction = useCallback(async (action: { message: string; type?: string }) => {
    setShowQuickActions(false);
    
    const userMessage: Message = {
      role: 'user',
      content: action.message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await streamChat([...messages, userMessage], action.type || 'chat');
      
      if (audioEnabled && response) {
        await speakText(response);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response'
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, audioEnabled, toast, contextString, recommendation]);

  const handleSend = useCallback(async () => {
    const cleanInput = input.replace(/\[listening...\]/g, '').trim();
    if (!cleanInput || isLoading) return;

    if (isRecording) {
      scribe.disconnect();
      setIsRecording(false);
    }

    setShowQuickActions(false);

    const userMessage: Message = {
      role: 'user',
      content: cleanInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Determine message type based on content and simulation state
      let messageType = 'chat';
      if (isInSimulation) {
        messageType = 'day-simulation'; // Continue simulation context
      }
      
      const response = await streamChat([...messages, userMessage], messageType);
      
      if (audioEnabled && response) {
        await speakText(response);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response'
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, audioEnabled, isRecording, scribe, toast, isInSimulation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (contextLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border glass-panel">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">Eira - Career Coach</h2>
                {hasCompletedAssessment && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    <Sparkles className="w-3 h-3" />
                    Personalised
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasCompletedAssessment && recommendation 
                  ? `Guiding you to ${recommendation.primary.title}`
                  : 'Cybersecurity pathways for 40+'
                }
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
            }
            setAudioEnabled(!audioEnabled);
          }}
        >
          {audioEnabled ? (
            isSpeaking ? <Volume2 className="w-5 h-5 text-primary animate-pulse" /> : <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Simulation Mode Indicator */}
      {isInSimulation && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="font-medium text-primary">Simulation Mode</span>
            <span className="text-muted-foreground">- Experience a day in the role</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsInSimulation(false)}
            className="text-xs h-7"
          >
            Exit Simulation
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              )}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              <p className="text-[10px] opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {isInSimulation ? 'Setting the scene...' : 'Eira is thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && messages.length <= 1 && !isLoading && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2 text-center">Quick actions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className={cn(
                  "text-xs h-8 gap-1.5",
                  action.type === 'day-simulation' && "border-primary/50 bg-primary/5"
                )}
              >
                <span>{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border glass-panel">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isInSimulation ? "Make your choice..." : "Ask about cyber careers, or tap the mic to speak..."}
            className="min-h-[44px] max-h-32 resize-none bg-muted/50 border-border"
            disabled={isLoading}
          />
          <Button
            onClick={toggleRecording}
            variant={isRecording ? 'destructive' : 'outline'}
            size="icon"
            className={cn(
              "h-11 w-11 shrink-0",
              isRecording && "animate-pulse"
            )}
            disabled={isLoading}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!input.replace(/\[listening...\]/g, '').trim() || isLoading}
            className="h-11 px-4"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          {isRecording ? '🔴 Recording... tap mic to stop' : audioEnabled ? '🔊 Voice responses enabled' : '🔇 Voice responses disabled'} • Powered by Lovable AI
          {hasCompletedAssessment && ' • Using your assessment'}
        </p>
      </div>
    </div>
  );
};

export default VoiceCoach;
