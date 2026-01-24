import { Zap, ExternalLink, Clock, Award, Briefcase } from 'lucide-react';

interface RedundancyFastTrackProps {
  urgencyLevel: 'high' | 'urgent';
}

const RedundancyFastTrack = ({ urgencyLevel }: RedundancyFastTrackProps) => {
  const fastTrackOptions = [
    {
      icon: Clock,
      title: 'IT Support roles',
      detail: '1-3 months to job-ready',
      highlight: true,
    },
    {
      icon: Award,
      title: 'CompTIA A+ certification',
      detail: '2-4 weeks intensive study',
      highlight: false,
    },
    {
      icon: Briefcase,
      title: 'Contract/temp roles',
      detail: 'Income while upskilling',
      highlight: false,
    },
  ];

  const resources = [
    {
      name: 'ReAct+ Programme',
      url: 'https://businesswales.gov.wales/skillsgateway/react',
      description: 'Redundancy support & training funding',
    },
    {
      name: 'Gov.uk Redundancy Rights',
      url: 'https://www.gov.uk/redundancy-your-rights',
      description: 'Check your entitlements',
    },
    {
      name: 'Careers Wales',
      url: 'https://careerswales.gov.wales/',
      description: 'Free career advice',
    },
  ];

  return (
    <div className="rounded-xl border-2 border-amber-500/50 bg-amber-500/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-500">Fast-Track Options</h3>
          <p className="text-xs text-muted-foreground">
            {urgencyLevel === 'urgent' 
              ? 'Prioritized for your timeline'
              : 'Accelerated pathways available'}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Given your situation, here are the fastest routes to income:
      </p>

      <ul className="space-y-3 mb-5">
        {fastTrackOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <li
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                option.highlight 
                  ? 'bg-amber-500/10 border border-amber-500/30' 
                  : 'bg-background/50'
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 ${option.highlight ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{option.title}</p>
                <p className="text-xs text-muted-foreground">{option.detail}</p>
              </div>
              {option.highlight && (
                <span className="ml-auto text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                  Fastest
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="pt-4 border-t border-amber-500/20">
        <p className="text-xs text-muted-foreground mb-3">Support Resources:</p>
        <div className="space-y-2">
          {resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.name}
                </p>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedundancyFastTrack;
