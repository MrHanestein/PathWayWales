import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentProgressProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'About You',
  'Income',
  'Life',
  'Goals',
  'Tech',
  'Skills',
  'Stability',
  'Confidence',
];

const AssessmentProgress = ({ currentStep, totalSteps }: AssessmentProgressProps) => {
  return (
    <div className="w-full px-4 py-6">
      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div 
              key={label} 
              className="flex flex-col items-center gap-1"
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 border-2 border-primary text-primary",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNum
                )}
              </div>
              <span 
                className={cn(
                  "text-[10px] text-center hidden sm:block transition-colors",
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: Current Step Label */}
      <div className="sm:hidden text-center mt-3">
        <span className="text-sm font-medium text-primary">
          Step {currentStep}: {stepLabels[currentStep - 1]}
        </span>
      </div>
    </div>
  );
};

export default AssessmentProgress;
