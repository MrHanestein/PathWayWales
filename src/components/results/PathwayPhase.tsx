import { BookOpen, Award, Briefcase } from 'lucide-react';
import { LearningPhase } from '@/lib/careerData';
import { cn } from '@/lib/utils';

interface PathwayPhaseProps {
  phases: LearningPhase[];
}

const phaseIcons = [BookOpen, Award, Briefcase];
const phaseColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-emerald-500 to-emerald-600',
];

const PathwayPhase = ({ phases }: PathwayPhaseProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg">Your Learning Pathway</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const Icon = phaseIcons[index] || BookOpen;
            const isLast = index === phases.length - 1;
            
            return (
              <div key={phase.phase} className="relative flex gap-4">
                {/* Phase number circle */}
                <div
                  className={cn(
                    'relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br',
                    phaseColors[index] || phaseColors[0]
                  )}
                >
                  {phase.phase}
                </div>

                {/* Phase content */}
                <div className={cn(
                  'flex-1 rounded-xl border border-border bg-card p-4',
                  isLast && 'ring-2 ring-primary/20'
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        {phase.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{phase.duration}</p>
                    </div>
                    {isLast && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Goal
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {phase.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {phase.resources.map((resource) => (
                      <span
                        key={resource}
                        className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline summary */}
      <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-center text-muted-foreground">
          Total estimated time: <span className="font-semibold text-foreground">
            {phases.reduce((acc, p) => {
              const weeks = parseInt(p.duration.split('-')[1]) || parseInt(p.duration.split('-')[0]) || 4;
              return acc + weeks;
            }, 0)} weeks
          </span> at your pace
        </p>
      </div>
    </div>
  );
};

export default PathwayPhase;
