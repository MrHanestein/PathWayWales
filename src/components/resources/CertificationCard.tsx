import { ExternalLink, Award, Clock, PoundSterling, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CertificationCardProps {
  name: string;
  url: string;
  cost: string;
  duration: string;
  provider: string;
  description: string;
}

const CertificationCard = ({ name, url, cost, duration, provider, description }: CertificationCardProps) => {
  const isFree = cost === 'Free' || cost === '£0';
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h4>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              {provider}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
            <Badge variant={isFree ? "default" : "outline"} className="text-xs">
              {isFree ? 'Free' : cost}
            </Badge>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CertificationCard;
