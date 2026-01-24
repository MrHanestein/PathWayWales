import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssessmentData } from '@/hooks/useAssessment';

interface AboutYouStepProps {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

const ageBands = ['40-44', '45-49', '50-54', '55-59', '60+'];

const experienceOptions = [
  { value: '0-5', label: '0-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10-20', label: '10-20 years' },
  { value: '20+', label: '20+ years' },
];

const industries = [
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Public Sector',
  'Technology',
  'Other',
];

const qualifications = [
  { value: 'gcse', label: 'GCSEs / O-Levels' },
  { value: 'a-levels', label: 'A-Levels' },
  { value: 'diploma', label: 'Diploma / HND' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'apprenticeship', label: 'Apprenticeship' },
  { value: 'professional', label: 'Professional Certification' },
  { value: 'none', label: 'No Formal Qualifications' },
];

const workPreferences = [
  { value: 'remote', label: 'Remote Only', description: 'Work from home exclusively' },
  { value: 'hybrid', label: 'Hybrid', description: 'Mix of home and office' },
  { value: 'onsite', label: 'On-site OK', description: 'Happy to work in office' },
];

const AboutYouStep = ({ data, updateData }: AboutYouStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">About You</h2>
        <p className="text-muted-foreground">Let's start with some basics about your background</p>
      </div>

      {/* Age Band */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Age Band</Label>
        <RadioGroup
          value={data.age_band || ''}
          onValueChange={(value) => updateData({ age_band: value })}
          className="flex flex-wrap gap-2"
        >
          {ageBands.map((band) => (
            <div key={band} className="flex items-center">
              <RadioGroupItem value={band} id={`age-${band}`} className="peer sr-only" />
              <Label
                htmlFor={`age-${band}`}
                className="px-4 py-2 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary hover:border-primary/50"
              >
                {band}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Current Job Title */}
      <div className="space-y-2">
        <Label htmlFor="job-title" className="text-sm font-medium">Current or Most Recent Job Title</Label>
        <Input
          id="job-title"
          placeholder="e.g., Office Manager, Sales Executive, Teacher"
          value={data.current_job_title || ''}
          onChange={(e) => updateData({ current_job_title: e.target.value })}
          className="bg-background"
        />
      </div>

      {/* Years of Experience */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Years of Professional Experience</Label>
        <Select
          value={data.years_experience || ''}
          onValueChange={(value) => updateData({ years_experience: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your experience" />
          </SelectTrigger>
          <SelectContent>
            {experienceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Current or Most Recent Industry</Label>
        <Select
          value={data.industry || ''}
          onValueChange={(value) => updateData({ industry: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Highest Qualification */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Highest Qualification</Label>
        <Select
          value={data.highest_qualification || ''}
          onValueChange={(value) => updateData({ highest_qualification: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select your qualification" />
          </SelectTrigger>
          <SelectContent>
            {qualifications.map((qual) => (
              <SelectItem key={qual.value} value={qual.value}>
                {qual.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
        <Input
          id="location"
          placeholder="Postcode or nearest town (e.g., Cardiff, CF10)"
          value={data.location || ''}
          onChange={(e) => updateData({ location: e.target.value })}
          className="bg-background"
        />
      </div>

      {/* Work Preference */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Work Preference</Label>
        <RadioGroup
          value={data.work_preference || ''}
          onValueChange={(value) => updateData({ work_preference: value })}
          className="grid gap-3"
        >
          {workPreferences.map((pref) => (
            <div key={pref.value} className="flex items-center">
              <RadioGroupItem value={pref.value} id={`work-${pref.value}`} className="peer sr-only" />
              <Label
                htmlFor={`work-${pref.value}`}
                className="flex-1 p-4 rounded-lg border border-border bg-background cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:border-primary/50"
              >
                <div className="font-medium">{pref.label}</div>
                <div className="text-sm text-muted-foreground">{pref.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default AboutYouStep;
