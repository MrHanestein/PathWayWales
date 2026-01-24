import { Check, Sparkles } from 'lucide-react';

interface WhyThisFitsProps {
  reasons: string[];
  roleTitle: string;
}

const WhyThisFits = ({ reasons, roleTitle }: WhyThisFitsProps) => {
  if (reasons.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Why {roleTitle} Fits You</h3>
      </div>

      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm text-foreground">{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhyThisFits;
