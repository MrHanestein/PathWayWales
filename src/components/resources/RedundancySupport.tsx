import { AlertTriangle, ExternalLink, Shield, FileText, Phone } from 'lucide-react';
import { walesResources } from '@/lib/careerData';

const RedundancySupport = () => {
  const supportLinks = [
    {
      name: 'Calculate Redundancy Pay',
      url: 'https://www.gov.uk/calculate-your-redundancy-pay',
      description: 'Official redundancy pay calculator',
      icon: FileText,
    },
    {
      name: 'Citizens Advice',
      url: 'https://www.citizensadvice.org.uk/work/leaving-a-job/redundancy/',
      description: 'Free, confidential advice on your rights',
      icon: Phone,
    },
    {
      name: 'ACAS Helpline',
      url: 'https://www.acas.org.uk/contact',
      description: 'Free workplace advice: 0300 123 1100',
      icon: Phone,
    },
  ];

  return (
    <div className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-700 dark:text-amber-400">Redundancy Support</h3>
          <p className="text-sm text-muted-foreground">
            Immediate resources and support available to you
          </p>
        </div>
      </div>

      {/* Quick action links */}
      <div className="space-y-2 mb-4">
        {supportLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors group"
          >
            <link.icon className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground group-hover:text-amber-600 transition-colors">
                {link.name}
              </span>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ))}
      </div>

      {/* Wales-specific redundancy resources */}
      <div className="pt-4 border-t border-amber-500/20">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600" />
          Wales Redundancy Resources
        </h4>
        <div className="space-y-2">
          {walesResources.redundancy.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-background/50 transition-colors group text-sm"
            >
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {resource.name}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedundancySupport;
