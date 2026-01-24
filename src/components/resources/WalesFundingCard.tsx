import { ExternalLink, MapPin, Sparkles } from 'lucide-react';

interface WalesFundingCardProps {
  name: string;
  url: string;
  description: string;
  isHighlighted?: boolean;
}

const WalesFundingCard = ({ name, url, description, isHighlighted = false }: WalesFundingCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-xl border-2 transition-all group ${
        isHighlighted 
          ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent hover:border-amber-500/50' 
          : 'border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent hover:border-green-500/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isHighlighted ? 'bg-amber-500/20' : 'bg-green-500/10'
        }`}>
          {isHighlighted ? (
            <Sparkles className="w-5 h-5 text-amber-500" />
          ) : (
            <MapPin className="w-5 h-5 text-green-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold transition-colors ${
              isHighlighted 
                ? 'text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-300' 
                : 'text-foreground group-hover:text-green-600'
            }`}>
              {name}
            </h4>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {isHighlighted && (
            <span className="inline-block mt-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Recommended for you
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default WalesFundingCard;
