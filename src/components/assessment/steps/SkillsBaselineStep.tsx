import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssessmentData } from '@/hooks/useAssessment';

interface SkillsBaselineStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const digitalTools = [
  'Excel / Google Sheets',
  'CRM tools (Salesforce, HubSpot)',
  'SQL / Databases',
  'Power BI / Tableau',
  'Jira / Trello / Asana',
  'Scripting (Python, VBA, etc.)',
  'GitHub / Version Control',
  'Linux / Command Line',
  'Cloud tools (AWS, Azure, GCP)',
];

const transferableStrengths = [
  'Leadership',
  'Stakeholder Management',
  'Training / Teaching',
  'Process Improvement',
  'Compliance / Regulation',
  'Customer Service',
  'Operations Management',
  'Data Analysis',
  'Project Management',
  'Problem Solving',
  'Budget Management',
  'Team Coordination',
];

const learningStyles = [
  { value: 'guided', label: 'Guided Step-by-Step', description: 'Structured courses with clear progression' },
  { value: 'self-paced', label: 'Self-Paced', description: 'Learn at my own speed' },
  { value: 'mix', label: 'Mix of Both', description: 'Flexible combination' },
  { value: 'live-support', label: 'Prefer Live Support', description: 'With tutors or mentors' },
];

const proofOptions = [
  { value: 'linkedin', label: 'LinkedIn Ready', description: 'Profile up to date' },
  { value: 'cv', label: 'CV Updated', description: 'Ready to apply' },
  { value: 'portfolio', label: 'Portfolio Started', description: 'Have work samples' },
  { value: 'none', label: 'None Yet', description: "Haven't started" },
];

const SkillsBaselineStep = ({ data, updateData }: SkillsBaselineStepProps) => {
  const comfortLevel = data.digital_comfort_level || 5;
  const selectedTools = data.tools_used || [];
  const selectedStrengths = data.transferable_strengths || [];

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      updateData({ tools_used: selectedTools.filter(t => t !== tool) });
    } else {
      updateData({ tools_used: [...selectedTools, tool] });
    }
  };

  const toggleStrength = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      updateData({ transferable_strengths: selectedStrengths.filter(s => s !== strength) });
    } else {
      updateData({ transferable_strengths: [...selectedStrengths, strength] });
    }
  };

  const getComfortLabel = (level: number) => {
    if (level <= 2) return 'Beginner';
    if (level <= 4) return 'Basic';
    if (level <= 6) return 'Intermediate';
    if (level <= 8) return 'Proficient';
    return 'Expert';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Skills & Upskilling</h2>
        <p className="text-muted-foreground">Understanding your current skills helps us tailor your pathway</p>
      </div>

      {/* Digital Comfort Level */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Comfort with Digital Tools</Label>
          <span className="text-sm font-medium text-primary">
            {comfortLevel}/10 - {getComfortLabel(comfortLevel)}
          </span>
        </div>
        <Slider
          value={[comfortLevel]}
          onValueChange={([value]) => updateData({ digital_comfort_level: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Beginner</span>
          <span>Expert</span>
        </div>
      </div>

      {/* Tools Used */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Which tools have you used? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {digitalTools.map((tool) => {
            const isSelected = selectedTools.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <Checkbox checked={isSelected} className="pointer-events-none" />
                <span>{tool}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transferable Strengths */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Transferable Strengths (Select all that apply)</Label>
        <div className="flex flex-wrap gap-2">
          {transferableStrengths.map((strength) => {
            const isSelected = selectedStrengths.includes(strength);
            return (
              <button
                key={strength}
                type="button"
                onClick={() => toggleStrength(strength)}
                className={`px-3 py-2 rounded-full border text-sm transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                {strength}
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Preferred Learning Style</Label>
        <RadioGroup
          value={data.learning_style || ''}
          onValueChange={(value) => updateData({ learning_style: value })}
          className="grid grid-cols-2 gap-2"
        >
          {learningStyles.map((style) => (
            <div key={style.value} className="flex items-center">
              <RadioGroupItem value={style.value} id={`style-${style.value}`} className="peer sr-only" />
              <Label
                htmlFor={`style-${style.value}`}
                className="flex-1 p-3 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:border-primary/50"
              >
                <div className="font-medium text-sm">{style.label}</div>
                <div className="text-xs text-muted-foreground">{style.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Existing Proof */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Proof You Already Have</Label>
        <RadioGroup
          value={data.existing_proof || ''}
          onValueChange={(value) => updateData({ existing_proof: value })}
          className="grid grid-cols-2 gap-2"
        >
          {proofOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroupItem value={option.value} id={`proof-${option.value}`} className="peer sr-only" />
              <Label
                htmlFor={`proof-${option.value}`}
                className="flex-1 p-3 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:border-primary/50"
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SkillsBaselineStep;
