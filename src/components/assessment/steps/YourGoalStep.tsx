import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, TrendingUp, Shield } from 'lucide-react';
import { AssessmentData } from '@/hooks/useAssessment';

interface YourGoalStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const goalTypes = [
  {
    value: 'switch-tech',
    label: 'Switch into Tech',
    description: 'Start fresh in the technology sector',
    icon: Rocket,
  },
  {
    value: 'progress-tech',
    label: 'Progress with Tech Skills',
    description: 'Use tech to advance in your current field',
    icon: TrendingUp,
  },
  {
    value: 'stable-adjacent',
    label: 'Move to Stable Adjacent Role',
    description: 'Find a more secure role using existing skills',
    icon: Shield,
  },
];

const timelines = [
  { value: '0-3', label: '0-3 months', description: 'ASAP' },
  { value: '3-6', label: '3-6 months', description: 'Short-term' },
  { value: '6-12', label: '6-12 months', description: 'Medium-term' },
  { value: '12-24', label: '12-24 months', description: 'Long-term' },
];

const entryRoutes = [
  { value: 'certification', label: 'Certification', description: 'Get qualified with industry-recognized certs' },
  { value: 'portfolio', label: 'Portfolio Projects', description: 'Build real projects to demonstrate skills' },
  { value: 'apprenticeship', label: 'Apprenticeship', description: 'Earn while you learn with structured training' },
  { value: 'internal', label: 'Internal Move', description: 'Transition within your current company' },
  { value: 'freelance', label: 'Freelance', description: 'Start with contract or freelance work' },
  { value: 'unsure', label: 'Not Sure Yet', description: 'Need guidance on the best route' },
];

const YourGoalStep = ({ data, updateData }: YourGoalStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Goal</h2>
        <p className="text-muted-foreground">What are you trying to achieve?</p>
      </div>

      {/* Goal Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What are you trying to do?</Label>
        <RadioGroup
          value={data.goal_type || ''}
          onValueChange={(value) => updateData({ goal_type: value })}
          className="grid gap-3"
        >
          {goalTypes.map((goal) => {
            const Icon = goal.icon;
            return (
              <div key={goal.value} className="flex items-center">
                <RadioGroupItem value={goal.value} id={`goal-${goal.value}`} className="peer sr-only" />
                <Label
                  htmlFor={`goal-${goal.value}`}
                  className="flex-1 flex items-center gap-4 p-4 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:border-primary/50"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{goal.label}</div>
                    <div className="text-sm text-muted-foreground">{goal.description}</div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {/* Desired Timeline */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Desired Timeline</Label>
        <RadioGroup
          value={data.desired_timeline || ''}
          onValueChange={(value) => updateData({ desired_timeline: value })}
          className="flex flex-wrap gap-2"
        >
          {timelines.map((timeline) => (
            <div key={timeline.value} className="flex items-center">
              <RadioGroupItem value={timeline.value} id={`timeline-${timeline.value}`} className="peer sr-only" />
              <Label
                htmlFor={`timeline-${timeline.value}`}
                className="px-4 py-3 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50 text-center"
              >
                <div className="font-medium">{timeline.label}</div>
                <div className="text-xs text-muted-foreground">{timeline.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Preferred Entry Route */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Preferred Entry Route</Label>
        <div className="grid grid-cols-2 gap-3">
          {entryRoutes.map((route) => (
            <button
              key={route.value}
              type="button"
              onClick={() => updateData({ preferred_entry_route: route.value })}
              className={`p-4 rounded-lg border text-left transition-all ${
                data.preferred_entry_route === route.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-sm">{route.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{route.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourGoalStep;
