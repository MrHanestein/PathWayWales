import { TrendingUp, ExternalLink } from 'lucide-react';
import { SalaryRange } from '@/lib/careerData';

interface SalaryCardProps {
  roleTitle: string;
  salary: SalaryRange;
  targetSalary?: number;
}

const formatSalary = (value: number): string => {
  return `£${value.toLocaleString()}`;
};

const SalaryCard = ({ roleTitle, salary, targetSalary }: SalaryCardProps) => {
  const entrySalaryMid = Math.round((salary.entry[0] + salary.entry[1]) / 2);
  const targetMin = salary.mid[0];
  const targetMax = salary.mid[1];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Salary Outlook</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Entry Salary</p>
          <p className="text-lg font-bold text-foreground">
            {formatSalary(salary.entry[0])} - {formatSalary(salary.entry[1])}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">12-24 Month Target</p>
          <p className="text-lg font-bold text-primary">
            {formatSalary(targetMin)} - {formatSalary(targetMax)}
          </p>
        </div>
      </div>

      {/* Salary progression bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
          style={{ width: '60%' }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Entry</span>
        <span>Mid-level (2-3 yrs)</span>
        <span>Senior</span>
      </div>

      {/* Senior salary preview */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Senior potential (5+ years)</span>
          <span className="text-sm font-semibold text-foreground">
            {formatSalary(salary.senior[0])} - {formatSalary(salary.senior[1])}
          </span>
        </div>
      </div>

      {/* Source */}
      <div className="mt-4 pt-3 border-t border-border">
        <a
          href="https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Source: ONS Annual Survey of Hours and Earnings
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default SalaryCard;
