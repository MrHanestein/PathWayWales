import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, TrendingUp, AlertTriangle, Clock, Bot, UserX } from 'lucide-react';
import { AssessmentData } from '@/hooks/useAssessment';

interface StabilityImpactStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const worryOptions = [
  { value: 'age-bias', label: 'Age Bias', description: 'Concerns about ageism in hiring', icon: UserX },
  { value: 'starting-again', label: '"Starting Again"', description: 'Fear of losing seniority', icon: AlertTriangle },
  { value: 'salary-dip', label: 'Salary Dip', description: 'Taking a pay cut initially', icon: TrendingUp },
  { value: 'time', label: 'Time Investment', description: 'How long it will take', icon: Clock },
  { value: 'ai-replacing', label: 'AI Replacing Roles', description: 'Jobs being automated', icon: Bot },
  { value: 'interview-confidence', label: 'Interview Confidence', description: 'Performing in tech interviews', icon: Shield },
];

const rolePreferences = [
  { value: 'low-automation', label: 'Lower Automation Exposure', description: 'Roles less likely to be automated' },
  { value: 'long-term-demand', label: 'Strong Long-term Demand', description: 'Growing job market' },
  { value: 'remote-friendly', label: 'Remote-Friendly', description: 'Work from home options' },
  { value: 'clear-progression', label: 'Clear Progression Ladder', description: 'Defined career path' },
];

const StabilityImpactStep = ({ data, updateData }: StabilityImpactStepProps) => {
  const stabilityValue = data.stability_vs_growth || 5;
  const selectedWorries = data.biggest_worries || [];
  const selectedPreferences = data.role_preferences || [];

  const toggleWorry = (worry: string) => {
    if (selectedWorries.includes(worry)) {
      updateData({ biggest_worries: selectedWorries.filter(w => w !== worry) });
    } else if (selectedWorries.length < 2) {
      updateData({ biggest_worries: [...selectedWorries, worry] });
    }
  };

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      updateData({ role_preferences: selectedPreferences.filter(p => p !== pref) });
    } else {
      updateData({ role_preferences: [...selectedPreferences, pref] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Stability & AI Impact</h2>
        <p className="text-muted-foreground">Help us understand your priorities for job security</p>
      </div>

      {/* Stability vs Growth Slider */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">How important is stability vs growth opportunity?</Label>
        <div className="relative pt-2">
          <Slider
            value={[stabilityValue]}
            onValueChange={([value]) => updateData({ stability_vs_growth: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">Stability</span>
            </div>
            <div className="text-lg font-bold text-primary">{stabilityValue}/10</div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Growth</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {stabilityValue <= 3 && "You prioritize job security above all else"}
          {stabilityValue > 3 && stabilityValue <= 5 && "You prefer a balance with slight lean to stability"}
          {stabilityValue > 5 && stabilityValue <= 7 && "You're open to calculated risks for growth"}
          {stabilityValue > 7 && "You're willing to take risks for high-growth opportunities"}
        </p>
      </div>

      {/* Biggest Worries */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Biggest Worry About Tech (Pick up to 2)</Label>
        <div className="grid gap-3">
          {worryOptions.map((worry) => {
            const Icon = worry.icon;
            const isSelected = selectedWorries.includes(worry.value);
            const isDisabled = !isSelected && selectedWorries.length >= 2;
            
            return (
              <button
                key={worry.value}
                type="button"
                onClick={() => toggleWorry(worry.value)}
                disabled={isDisabled}
                className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
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
                <div className="flex-1">
                  <div className="font-medium">{worry.label}</div>
                  <div className="text-sm text-muted-foreground">{worry.description}</div>
                </div>
                <Checkbox checked={isSelected} className="pointer-events-none" />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {selectedWorries.length}/2
        </p>
      </div>

      {/* Role Preferences */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Do you want roles that are: (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {rolePreferences.map((pref) => {
            const isSelected = selectedPreferences.includes(pref.value);
            
            return (
              <button
                key={pref.value}
                type="button"
                onClick={() => togglePreference(pref.value)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Checkbox checked={isSelected} className="mt-1 pointer-events-none" />
                  <div>
                    <div className="font-medium text-sm">{pref.label}</div>
                    <div className="text-xs text-muted-foreground">{pref.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Impact Note */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">About AI & Job Security</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your results will include AI/automation exposure data from WEF Future of Jobs 2025 
              and ONS research, helping you choose roles with long-term stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StabilityImpactStep;
