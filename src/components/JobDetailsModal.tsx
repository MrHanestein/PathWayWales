import { X, MapPin, Building2, Briefcase, GraduationCap, Clock, DollarSign, Sparkles, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobMarker } from "@/components/FuturisticWalesMap";

// Valid job board domains for direct links
const JOB_BOARD_DOMAINS = [
  'indeed.co.uk', 'indeed.com',
  'reed.co.uk',
  'linkedin.com',
  'totaljobs.com',
  'cwjobs.co.uk',
  'gov.wales', 'gov.uk',
  'glassdoor.co.uk', 'glassdoor.com',
  'monster.co.uk'
];

function isValidJobBoardUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return JOB_BOARD_DOMAINS.some(domain => hostname.includes(domain.split('/')[0]));
  } catch {
    return false;
  }
}

function extractJobBoardName(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('indeed')) return 'Indeed';
    if (hostname.includes('reed')) return 'Reed';
    if (hostname.includes('linkedin')) return 'LinkedIn';
    if (hostname.includes('totaljobs')) return 'Totaljobs';
    if (hostname.includes('cwjobs')) return 'CWJobs';
    if (hostname.includes('glassdoor')) return 'Glassdoor';
    if (hostname.includes('monster')) return 'Monster';
    if (hostname.includes('gov.wales') || hostname.includes('gov.uk')) return 'Gov Jobs';
    return 'Job Board';
  } catch {
    return 'Job Board';
  }
}

interface JobDetailsModalProps {
  job: JobMarker;
  onClose: () => void;
  onStartPathway: () => void;
}

const JobDetailsModal = ({ job, onClose, onStartPathway }: JobDetailsModalProps) => {
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Competitive salary";
    if (min && max) return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
    if (min) return `From £${min.toLocaleString()}`;
    if (max) return `Up to £${max.toLocaleString()}`;
    return "Competitive salary";
  };

  const getLevelInfo = (level: "easy" | "moderate" | "difficult") => {
    switch (level) {
      case "easy": 
        return { 
          label: "Easy Entry", 
          color: "bg-entry-easy", 
          description: "Perfect for beginners with minimal requirements",
          icon: "🎯"
        };
      case "moderate": 
        return { 
          label: "Moderate", 
          color: "bg-entry-moderate",
          description: "Some experience preferred but not required",
          icon: "⚡"
        };
      case "difficult": 
        return { 
          label: "Competitive", 
          color: "bg-entry-difficult",
          description: "Requires specific skills and experience",
          icon: "🔥"
        };
    }
  };

  const levelInfo = getLevelInfo(job.level);
  
  const postedDate = job.posted_date 
    ? new Date(job.posted_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently posted';

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-card border border-primary/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 60px hsl(var(--primary) / 0.15), 0 0 100px hsl(var(--primary) / 0.05)',
        }}
      >
        {/* Header with gradient */}
        <div className="relative p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/10 via-transparent to-primary/5">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Level badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white mb-4",
            levelInfo.color
          )}>
            <span>{levelInfo.icon}</span>
            <span>{levelInfo.label}</span>
          </div>

          {/* Title and company */}
          <h2 className="text-xl font-bold text-foreground mb-2 pr-8">{job.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {job.city}, Wales
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                Salary
              </div>
              <p className="font-semibold text-primary text-sm">
                {formatSalary(job.salary_min, job.salary_max)}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                Posted
              </div>
              <p className="font-semibold text-foreground text-sm">{postedDate}</p>
            </div>
          </div>

          {/* Entry Level Description */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm mb-1">Entry Difficulty</p>
                <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                About the Role
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {req}
                  </li>
                ))
              ) : (
                <>
                  {job.level === 'easy' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-easy mt-2 shrink-0" />
                        No prior experience required
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-easy mt-2 shrink-0" />
                        Basic computer skills
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-easy mt-2 shrink-0" />
                        Willingness to learn and grow
                      </li>
                    </>
                  )}
                  {job.level === 'moderate' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-moderate mt-2 shrink-0" />
                        1-2 years related experience preferred
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-moderate mt-2 shrink-0" />
                        Relevant qualification or equivalent
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-moderate mt-2 shrink-0" />
                        Good problem-solving abilities
                      </li>
                    </>
                  )}
                  {job.level === 'difficult' && (
                    <>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-difficult mt-2 shrink-0" />
                        3+ years professional experience
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-difficult mt-2 shrink-0" />
                        Industry certifications required
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-entry-difficult mt-2 shrink-0" />
                        Proven track record of results
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Desired Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <Badge 
                    key={i} 
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
          <div className="flex gap-3">
            {isValidJobBoardUrl((job as any).url) ? (
              <Button 
                variant="outline"
                className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => {
                  window.open((job as any).url, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply on {extractJobBoardName((job as any).url)}
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="flex-1 border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted/10"
                onClick={() => {
                  // Targeted search on job boards
                  const searchQuery = encodeURIComponent(`${job.title} ${job.company} jobs ${job.city} Wales`);
                  window.open(
                    `https://www.google.com/search?q=${searchQuery}+site:indeed.co.uk+OR+site:reed.co.uk+OR+site:linkedin.com/jobs`,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Find This Job
              </Button>
            )}
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={onStartPathway}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Pathway
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
