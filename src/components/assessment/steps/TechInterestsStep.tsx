import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, BarChart3, Cloud, Code, Monitor, Briefcase, Sparkles, HelpCircle } from 'lucide-react';
import { AssessmentData } from '@/hooks/useAssessment';

interface TechInterestsStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const techAreas = [
  {
    value: 'cybersecurity',
    label: 'Cybersecurity',
    description: 'Protect systems and data from threats',
    icon: Shield,
    color: 'text-red-500',
  },
  {
    value: 'data-analytics',
    label: 'Data & Analytics',
    description: 'Turn data into actionable insights',
    icon: BarChart3,
    color: 'text-blue-500',
  },
  {
    value: 'cloud',
    label: 'Cloud Computing',
    description: 'Build and manage cloud infrastructure',
    icon: Cloud,
    color: 'text-cyan-500',
  },
  {
    value: 'software-web',
    label: 'Software & Web Development',
    description: 'Create applications and websites',
    icon: Code,
    color: 'text-green-500',
  },
  {
    value: 'it-support',
    label: 'IT Support',
    description: 'Help users and maintain systems',
    icon: Monitor,
    color: 'text-purple-500',
  },
  {
    value: 'product-delivery',
    label: 'Product / Project / Delivery',
    description: 'Manage tech projects and teams',
    icon: Briefcase,
    color: 'text-orange-500',
  },
  {
    value: 'ai-tools',
    label: 'AI Tools for Work',
    description: 'Use AI to boost productivity',
    icon: Sparkles,
    color: 'text-pink-500',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Something else in mind',
    icon: HelpCircle,
    color: 'text-gray-500',
  },
];

const TechInterestsStep = ({ data, updateData }: TechInterestsStepProps) => {
  const selectedInterests = data.tech_interests || [];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      updateData({ tech_interests: selectedInterests.filter(i => i !== interest) });
    } else {
      updateData({ tech_interests: [...selectedInterests, interest] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Tech Interests</h2>
        <p className="text-muted-foreground">Which areas of technology interest you? (Select all that apply)</p>
      </div>

      {/* Tech Areas Grid */}
      <div className="grid gap-3">
        {techAreas.map((area) => {
          const Icon = area.icon;
          const isSelected = selectedInterests.includes(area.value);
          
          return (
            <button
              key={area.value}
              type="button"
              onClick={() => toggleInterest(area.value)}
              className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center border ${isSelected ? 'border-primary' : 'border-border'}`}>
                <Icon className={`w-6 h-6 ${area.color}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium">{area.label}</div>
                <div className="text-sm text-muted-foreground">{area.description}</div>
              </div>
              <Checkbox 
                checked={isSelected}
                className="pointer-events-none"
              />
            </button>
          );
        })}
      </div>

      {/* Other Text Input */}
      {selectedInterests.includes('other') && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label htmlFor="other-interest" className="text-sm font-medium">
            Tell us more about your interest
          </Label>
          <Input
            id="other-interest"
            placeholder="e.g., DevOps, Game Development, IoT..."
            value={data.tech_interests_other || ''}
            onChange={(e) => updateData({ tech_interests_other: e.target.value })}
            className="bg-background"
          />
        </div>
      )}

      {/* Selection Summary */}
      <div className="p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{selectedInterests.length}</span> area{selectedInterests.length !== 1 ? 's' : ''} selected
        </p>
        {selectedInterests.length === 0 && (
          <p className="text-sm text-amber-500 mt-1">Please select at least one area to continue</p>
        )}
      </div>
    </div>
  );
};

export default TechInterestsStep;
