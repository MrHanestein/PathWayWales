import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';
import { AutomationRisk } from '@/lib/careerData';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  risk: AutomationRisk;
  showReason?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge = ({ risk, showReason = false, size = 'md' }: RiskBadgeProps) => {
  const getIcon = () => {
    switch (risk.risk) {
      case 'LOW':
        return Shield;
      case 'MEDIUM':
        return AlertTriangle;
      case 'HIGH':
        return AlertCircle;
    }
  };

  const getStyles = () => {
    switch (risk.risk) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'HIGH':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
    }
  };

  const Icon = getIcon();

  return (
    <div className={showReason ? 'space-y-2' : ''}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border font-medium',
          getStyles(),
          getSizeStyles()
        )}
      >
        <Icon className={getIconSize()} />
        <span>AI Risk: {risk.risk}</span>
      </div>
      {showReason && (
        <p className="text-xs text-muted-foreground pl-1">
          {risk.reason}
        </p>
      )}
    </div>
  );
};

export default RiskBadge;
