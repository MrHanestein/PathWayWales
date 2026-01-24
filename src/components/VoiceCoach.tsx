import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Sparkles, ArrowLeft, BookOpen, Lightbulb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

const VoiceCoach = ({ onClose }: VoiceCoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Eira, your personal cybersecurity career coach. I specialise in helping people over 40 in Wales make successful transitions into cyber careers. 🏴󠁧󠁢󠁷󠁬󠁳󠁿\n\nWhether you're curious about opportunities, worried you're \"not technical enough,\" or just want to explore your options - I'm here to help.\n\nWhat brings you here today? You can tell me about your background, ask about specific roles, or we can explore what cybersecurity path might suit you best.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeMode, setActiveMode] = useState<'chat' | 'pathway' | 'dejargon' | 'simulation'>('chat');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Stream chat response
  const streamChat = async (userMessages: Message[], type: string = 'chat') => {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages.map(m => ({ role: m.role, content: m.content })),
        type 
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
      
      // Clean text for TTS (remove emojis, markdown)
      const cleanText = text
        .replace(/[🏴󠁧󠁢󠁷󠁬󠁳󠁿🎯⚡🔥💰📡]/g, '')
        .replace(/\*\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\n{2,}/g, '\n')
        .slice(0, 2000); // Limit length

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

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const typeMap = {
        chat: 'chat',
        pathway: 'pathway-preview',
        dejargon: 'dejargonise',
        simulation: 'simulation'
      };

      const response = await streamChat([...messages, userMessage], typeMap[activeMode]);
      
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
  }, [input, isLoading, messages, audioEnabled, activeMode, toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { 
      label: 'Pathway Preview', 
      icon: Target, 
      mode: 'pathway' as const,
      prompt: "I'd like to explore which cybersecurity pathway might suit me. I can share a bit about my background."
    },
    { 
      label: 'Explain Jargon', 
      icon: BookOpen, 
      mode: 'dejargon' as const,
      prompt: "Can you explain what SOC, SIEM, and IAM mean in plain English?"
    },
    { 
      label: 'Try a Scenario', 
      icon: Lightbulb, 
      mode: 'simulation' as const,
      prompt: "I'd like to try a practice scenario to see what working in cyber might be like."
    },
  ];

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
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Eira - Career Coach</h2>
              <p className="text-xs text-muted-foreground">Cybersecurity pathways for 40+</p>
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

      {/* Quick Actions */}
      <div className="px-4 py-2 border-b border-border flex gap-2 overflow-x-auto">
        {quickActions.map((action) => (
          <Button
            key={action.mode}
            variant={activeMode === action.mode ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap gap-1.5"
            onClick={() => {
              setActiveMode(action.mode);
              setInput(action.prompt);
            }}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </div>

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
                <span className="text-sm text-muted-foreground">Eira is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border glass-panel">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about cyber careers, explain jargon, or share your background..."
            className="min-h-[44px] max-h-32 resize-none bg-muted/50 border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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
          {audioEnabled ? '🔊 Voice responses enabled' : '🔇 Voice responses disabled'} • Powered by Lovable AI
        </p>
      </div>
    </div>
  );
};

export default VoiceCoach;
