import { ChevronRight } from 'lucide-react';
import { RoleData } from '@/lib/careerData';
import RiskBadge from './RiskBadge';
import DemandBadge from './DemandBadge';

interface AlternativeRolesProps {
  roles: RoleData[];
  onSelectRole?: (roleId: string) => void;
}

const formatSalary = (range: [number, number]): string => {
  return `£${(range[0] / 1000).toFixed(0)}k - £${(range[1] / 1000).toFixed(0)}k`;
};

const AlternativeRoles = ({ roles, onSelectRole }: AlternativeRolesProps) => {
  if (roles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg">Alternative Pathways</h3>
      <p className="text-sm text-muted-foreground">
        Based on your profile, these roles are also worth considering
      </p>

      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole?.(role.id)}
            className="w-full text-left rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {role.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {role.description}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatSalary(role.salary.entry)}
                  </span>
                  <span className="text-xs text-muted-foreground">entry</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <RiskBadge risk={role.automationRisk} size="sm" />
                  <DemandBadge trend={role.demandTrend} size="sm" />
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span>Time to entry:</span>
                  <span className="font-medium text-foreground">{role.timeToEntry}</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlternativeRoles;
