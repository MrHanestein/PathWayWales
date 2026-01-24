import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { AssessmentData } from '@/hooks/useAssessment';

interface LifeSituationStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const employmentStatuses = [
  'Full-time employed',
  'Part-time employed',
  'Unemployed',
  'Career break',
  'Self-employed',
  'Facing redundancy',
];

const reasonsForChange = [
  { value: 'redundancy', label: 'Redundancy' },
  { value: 'career-growth', label: 'Career Growth' },
  { value: 'interest-tech', label: 'Interest in Tech' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

const familySituations = [
  'Single, no dependents',
  'Partner, no children',
  'Partner with children',
  'Single parent',
  'Carer responsibilities',
];

const learningBudgets = [
  { value: 'free', label: 'Free resources only' },
  { value: '1-50', label: 'Up to £50/month' },
  { value: '50-150', label: '£50-£150/month' },
  { value: '150+', label: '£150+/month' },
];

const noticePeriodStatuses = [
  { value: 'in-notice', label: 'Currently in notice period' },
  { value: 'completed', label: 'Notice period completed' },
  { value: 'unsure', label: 'Unsure' },
];

const immediateNeeds = [
  { value: 'income', label: 'Income fast', icon: '💰' },
  { value: 'confidence', label: 'Confidence building', icon: '💪' },
  { value: 'direction', label: 'Career direction', icon: '🧭' },
  { value: 'cv-applications', label: 'CV & applications', icon: '📄' },
  { value: 'retraining', label: 'Retraining plan', icon: '📚' },
];

const LifeSituationStep = ({ data, updateData }: LifeSituationStepProps) => {
  const weeklyHours = data.weekly_hours_available || 10;
  const isRedundancy = data.reason_for_change === 'redundancy' || data.employment_status === 'Facing redundancy';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Life Situation</h2>
        <p className="text-muted-foreground">Help us understand your current circumstances</p>
      </div>

      {/* Employment Status */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Employment Status</Label>
        <Select
          value={data.employment_status || ''}
          onValueChange={(value) => updateData({ employment_status: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your status" />
          </SelectTrigger>
          <SelectContent>
            {employmentStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reason for Change */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Main Reason for Career Change</Label>
        <RadioGroup
          value={data.reason_for_change || ''}
          onValueChange={(value) => updateData({ reason_for_change: value })}
          className="grid grid-cols-2 gap-2"
        >
          {reasonsForChange.map((reason) => (
            <div key={reason.value} className="flex items-center">
              <RadioGroupItem value={reason.value} id={`reason-${reason.value}`} className="peer sr-only" />
              <Label
                htmlFor={`reason-${reason.value}`}
                className="flex-1 p-3 text-center rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
              >
                {reason.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Redundancy Support Block */}
      {isRedundancy && (
        <div className="p-4 rounded-lg border border-amber-500/50 bg-amber-500/10 space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Redundancy Support</span>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Redundancy Date</Label>
            <input
              type="month"
              value={data.redundancy_date || ''}
              onChange={(e) => updateData({ redundancy_date: e.target.value })}
              className="w-full p-2 rounded-lg border border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Notice Period Status</Label>
            <Select
              value={data.notice_period_status || ''}
              onValueChange={(value) => updateData({ notice_period_status: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {noticePeriodStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Biggest Immediate Need</Label>
            <div className="grid grid-cols-2 gap-2">
              {immediateNeeds.map((need) => (
                <button
                  key={need.value}
                  type="button"
                  onClick={() => updateData({ biggest_immediate_need: need.value })}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    data.biggest_immediate_need === need.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg mr-2">{need.icon}</span>
                  <span className="text-sm">{need.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-500/30">
            <p className="text-sm text-muted-foreground mb-2">Helpful resources:</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.gov.uk/redundancy-your-rights"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Gov.uk Rights <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.acas.org.uk/redundancy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                ACAS Guidance <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Family Situation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Family Situation</Label>
        <Select
          value={data.family_situation || ''}
          onValueChange={(value) => updateData({ family_situation: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your situation" />
          </SelectTrigger>
          <SelectContent>
            {familySituations.map((situation) => (
              <SelectItem key={situation} value={situation}>
                {situation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Hours Available */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Weekly Hours Available for Learning</Label>
          <span className="text-lg font-bold text-primary">{weeklyHours} hrs</span>
        </div>
        <Slider
          value={[weeklyHours]}
          onValueChange={([value]) => updateData({ weekly_hours_available: value })}
          min={5}
          max={40}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5 hours</span>
          <span>40 hours</span>
        </div>
      </div>

      {/* Learning Budget */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Preferred Learning Budget</Label>
        <RadioGroup
          value={data.learning_budget || ''}
          onValueChange={(value) => updateData({ learning_budget: value })}
          className="grid grid-cols-2 gap-2"
        >
          {learningBudgets.map((budget) => (
            <div key={budget.value} className="flex items-center">
              <RadioGroupItem value={budget.value} id={`budget-${budget.value}`} className="peer sr-only" />
              <Label
                htmlFor={`budget-${budget.value}`}
                className="flex-1 p-3 text-center rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
              >
                {budget.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default LifeSituationStep;
