import { useEffect, useState } from 'react';
import { Check, Sparkles, TrendingUp, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompletionStepProps {
  onViewResults: () => void;
}

const CompletionStep = ({ onViewResults }: CompletionStepProps) => {
  const [showCheck, setShowCheck] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowCheck(true), 300),
      setTimeout(() => setShowMessage(true), 800),
      setTimeout(() => setShowFeatures(true), 1200),
      setTimeout(() => setShowButton(true), 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const features = [
    { icon: TrendingUp, label: 'Salary Ranges', description: 'Based on ONS ASHE data' },
    { icon: Shield, label: 'Stability Signals', description: 'AI exposure indicators' },
    { icon: Briefcase, label: 'Tailored Pathway', description: 'Matched to your goals' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
      {/* Animated Checkmark */}
      <div className={`relative transition-all duration-700 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
        
        {/* Particle effects */}
        {showCheck && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-3 w-3 h-3 bg-emerald-400 rounded-full animate-ping animation-delay-200" />
            <div className="absolute -bottom-2 left-0 w-3 h-3 bg-teal-400 rounded-full animate-ping animation-delay-400" />
            <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping animation-delay-300" />
          </>
        )}
      </div>

      {/* Success Message */}
      <div className={`text-center mt-8 transition-all duration-500 ${showMessage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Assessment Complete!</h2>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-muted-foreground max-w-md">
          Your personalised pathway is ready — including salary insights and stability indicators.
        </p>
      </div>

      {/* Feature Cards */}
      <div className={`grid grid-cols-3 gap-4 mt-8 w-full max-w-lg transition-all duration-500 ${showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={feature.label}
              className="p-4 rounded-lg bg-muted/50 border border-border text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-medium text-sm">{feature.label}</div>
              <div className="text-xs text-muted-foreground">{feature.description}</div>
            </div>
          );
        })}
      </div>

      {/* Unlocked Resources Note */}
      <div className={`mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center transition-all duration-500 ${showFeatures ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className="text-sm text-primary font-medium">
          🔓 Resources section now unlocked!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Access learning materials, guides, and tools tailored to your pathway.
        </p>
      </div>

      {/* View Results Button */}
      <Button
        size="lg"
        onClick={onViewResults}
        className={`mt-8 px-8 transition-all duration-500 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        View Your Pathway
        <Sparkles className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default CompletionStep;
