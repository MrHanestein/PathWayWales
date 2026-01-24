import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceCategoryProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

const ResourceCategory = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = 'text-primary',
  children, 
  defaultOpen = true,
  count 
}: ResourceCategoryProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{title}</h3>
              {count !== undefined && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border/50">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCategory;
