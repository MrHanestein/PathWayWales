import { ExternalLink, Clock, PoundSterling } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceCardProps {
  name: string;
  url: string;
  description: string;
  isFree: boolean;
  duration?: string;
  cost?: string;
}

const ResourceCard = ({ name, url, description, isFree, duration, cost }: ResourceCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {name}
            </h4>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant={isFree ? "default" : "secondary"} className="text-xs">
              {isFree ? 'Free' : cost || 'Paid'}
            </Badge>
            {duration && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ResourceCard;
