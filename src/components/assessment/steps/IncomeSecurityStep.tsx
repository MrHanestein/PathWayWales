import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AssessmentData } from '@/hooks/useAssessment';

interface IncomeSecurityStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const salaryBands = [
  { value: 'under-20k', label: 'Under £20,000' },
  { value: '20-30k', label: '£20,000 - £30,000' },
  { value: '30-40k', label: '£30,000 - £40,000' },
  { value: '40-50k', label: '£40,000 - £50,000' },
  { value: '50-60k', label: '£50,000 - £60,000' },
  { value: '60k+', label: '£60,000+' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const targetSalaryBands = [
  { value: '25-35k', label: '£25,000 - £35,000' },
  { value: '35-45k', label: '£35,000 - £45,000' },
  { value: '45-55k', label: '£45,000 - £55,000' },
  { value: '55-70k', label: '£55,000 - £70,000' },
  { value: '70k+', label: '£70,000+' },
];

const financialRunwayOptions = [
  { value: '0-1', label: '0-1 month', description: 'Need income quickly' },
  { value: '2-3', label: '2-3 months', description: 'Some flexibility' },
  { value: '4-6', label: '4-6 months', description: 'Good runway' },
  { value: '6-12', label: '6-12 months', description: 'Comfortable position' },
  { value: '12+', label: '12+ months', description: 'Very secure' },
];

const priorities = [
  'Stability',
  'Pay',
  'Remote flexibility',
  'Fast entry',
  'Meaningful work',
];

const IncomeSecurityStep = ({ data, updateData }: IncomeSecurityStepProps) => {
  const minSalary = data.minimum_salary_needed || 20000;
  
  const handlePriorityToggle = (priority: string) => {
    const current = data.priority_ranking || [];
    if (current.includes(priority)) {
      updateData({ priority_ranking: current.filter(p => p !== priority) });
    } else if (current.length < 3) {
      updateData({ priority_ranking: [...current, priority] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Income & Security</h2>
        <p className="text-muted-foreground">Understanding your financial needs helps us find realistic pathways</p>
      </div>

      {/* Current Salary Band */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Current Salary Band (Optional)</Label>
        <Select
          value={data.current_salary_band || ''}
          onValueChange={(value) => updateData({ current_salary_band: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your salary band" />
          </SelectTrigger>
          <SelectContent>
            {salaryBands.map((band) => (
              <SelectItem key={band.value} value={band.value}>
                {band.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Salary Needed */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Minimum Salary to Make a Move Viable</Label>
          <span className="text-lg font-bold text-primary">£{minSalary.toLocaleString()}</span>
        </div>
        <Slider
          value={[minSalary]}
          onValueChange={([value]) => updateData({ minimum_salary_needed: value })}
          min={15000}
          max={70000}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>£15,000</span>
          <span>£70,000</span>
        </div>
      </div>

      {/* Target Salary */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Salary in 12-24 Months</Label>
        <Select
          value={data.target_salary || ''}
          onValueChange={(value) => updateData({ target_salary: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your target" />
          </SelectTrigger>
          <SelectContent>
            {targetSalaryBands.map((band) => (
              <SelectItem key={band.value} value={band.value}>
                {band.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Accept Pay Dip */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Can you accept a pay dip for 6-12 months?</Label>
        <RadioGroup
          value={data.accept_pay_dip || ''}
          onValueChange={(value) => updateData({ accept_pay_dip: value })}
          className="flex gap-4"
        >
          {['Yes', 'No', 'Maybe'].map((option) => (
            <div key={option} className="flex items-center">
              <RadioGroupItem value={option.toLowerCase()} id={`paydip-${option}`} className="peer sr-only" />
              <Label
                htmlFor={`paydip-${option}`}
                className="px-6 py-3 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Financial Runway */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Financial Runway if Income Drops</Label>
        <RadioGroup
          value={data.financial_runway || ''}
          onValueChange={(value) => updateData({ financial_runway: value })}
          className="grid gap-2"
        >
          {financialRunwayOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroupItem value={option.value} id={`runway-${option.value}`} className="peer sr-only" />
              <Label
                htmlFor={`runway-${option.value}`}
                className="flex-1 flex justify-between items-center p-3 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:border-primary/50"
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Priority Ranking */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What Matters Most Right Now? (Pick up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => {
            const isSelected = (data.priority_ranking || []).includes(priority);
            const rank = (data.priority_ranking || []).indexOf(priority) + 1;
            
            return (
              <button
                key={priority}
                type="button"
                onClick={() => handlePriorityToggle(priority)}
                className={`px-4 py-2 rounded-lg border transition-all relative ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {rank}
                  </span>
                )}
                {priority}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {(data.priority_ranking || []).length}/3
        </p>
      </div>
    </div>
  );
};

export default IncomeSecurityStep;
