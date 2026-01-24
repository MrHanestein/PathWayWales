import { TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { DemandTrend } from '@/lib/careerData';
import { cn } from '@/lib/utils';

interface DemandBadgeProps {
  trend: DemandTrend;
  showDetail?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DemandBadge = ({ trend, showDetail = false, size = 'md' }: DemandBadgeProps) => {
  const getIcon = () => {
    switch (trend.trend) {
      case 'GROWING':
        return TrendingUp;
      case 'STABLE':
        return Minus;
      case 'DECLINING':
        return TrendingDown;
    }
  };

  const getStyles = () => {
    switch (trend.trend) {
      case 'GROWING':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'STABLE':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'DECLINING':
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
    <div className={showDetail ? 'space-y-2' : ''}>
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border font-medium',
          getStyles(),
          getSizeStyles()
        )}
      >
        <Icon className={getIconSize()} />
        <span>Demand: {trend.trend}</span>
      </div>
      {showDetail && (
        <p className="text-xs text-muted-foreground pl-1">
          {trend.detail}
        </p>
      )}
    </div>
  );
};

export default DemandBadge;
