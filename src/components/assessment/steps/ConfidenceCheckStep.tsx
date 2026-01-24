import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Target, Users, MessageSquare, Folder, Heart, Mic } from 'lucide-react';
import { AssessmentData } from '@/hooks/useAssessment';

interface ConfidenceCheckStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const supportOptions = [
  { value: 'clear-plan', label: 'Clear Plan', description: 'Step-by-step guidance', icon: Target },
  { value: 'accountability', label: 'Accountability', description: 'Regular check-ins', icon: Users },
  { value: 'interview-prep', label: 'Interview Prep', description: 'Practice & feedback', icon: MessageSquare },
  { value: 'portfolio-feedback', label: 'Portfolio Feedback', description: 'Work review', icon: Folder },
  { value: 'community', label: 'Community', description: 'Peer support', icon: Heart },
  { value: 'voice-coach', label: 'Voice Coach Motivation', description: 'AI-powered support', icon: Mic },
];

const ConfidenceCheckStep = ({ data, updateData }: ConfidenceCheckStepProps) => {
  const confidenceLevel = data.confidence_level || 5;
  const selectedSupport = data.support_needed || [];

  const toggleSupport = (support: string) => {
    if (selectedSupport.includes(support)) {
      updateData({ support_needed: selectedSupport.filter(s => s !== support) });
    } else if (selectedSupport.length < 2) {
      updateData({ support_needed: [...selectedSupport, support] });
    }
  };

  const getConfidenceMessage = (level: number) => {
    if (level <= 2) return "That's okay — everyone starts somewhere. We'll build you up.";
    if (level <= 4) return "Some uncertainty is natural. A clear plan will help.";
    if (level <= 6) return "Good foundation! Let's turn that into action.";
    if (level <= 8) return "Strong confidence! Ready to accelerate.";
    return "Excellent! You're primed for success.";
  };

  const getConfidenceEmoji = (level: number) => {
    if (level <= 2) return "🌱";
    if (level <= 4) return "🌿";
    if (level <= 6) return "🌳";
    if (level <= 8) return "🚀";
    return "⭐";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Confidence Check</h2>
        <p className="text-muted-foreground">Almost there! Let's understand how we can best support you</p>
      </div>

      {/* Confidence Level */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          How confident do you feel about entering or progressing in tech?
        </Label>
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center mb-4">
            <span className="text-4xl">{getConfidenceEmoji(confidenceLevel)}</span>
            <div className="text-3xl font-bold text-primary mt-2">{confidenceLevel}/10</div>
          </div>
          <Slider
            value={[confidenceLevel]}
            onValueChange={([value]) => updateData({ confidence_level: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4">
            {getConfidenceMessage(confidenceLevel)}
          </p>
        </div>
      </div>

      {/* Biggest Concern */}
      <div className="space-y-3">
        <Label htmlFor="concern" className="text-sm font-medium">
          What's your biggest concern? (Optional)
        </Label>
        <Textarea
          id="concern"
          placeholder="Share anything that's on your mind about making this transition..."
          value={data.biggest_concern || ''}
          onChange={(e) => updateData({ biggest_concern: e.target.value })}
          className="bg-background min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground">
          This helps us provide more relevant support in your pathway
        </p>
      </div>

      {/* Support Needed */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What kind of support would help most? (Pick up to 2)</Label>
        <div className="grid grid-cols-2 gap-3">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedSupport.includes(option.value);
            const isDisabled = !isSelected && selectedSupport.length >= 2;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleSupport(option.value)}
                disabled={isDisabled}
                className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : isDisabled
                    ? 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{option.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{option.description}</div>
                </div>
                <Checkbox checked={isSelected} className="pointer-events-none flex-shrink-0" />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {selectedSupport.length}/2
        </p>
      </div>

      {/* Encouragement */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
        <p className="text-sm text-center">
          <span className="font-semibold text-green-600">You're doing great!</span>
          <br />
          <span className="text-muted-foreground">
            One more step and your personalised pathway will be ready.
          </span>
        </p>
      </div>
    </div>
  );
};

export default ConfidenceCheckStep;
