import { cn } from "@/lib/utils";

interface CategoryButtonsProps {
  activeFilter?: "easy" | "moderate" | "difficult" | null;
  onFilterChange?: (filter: "easy" | "moderate" | "difficult" | null) => void;
  jobCounts?: {
    easy: number;
    moderate: number;
    difficult: number;
  };
}

const CategoryButtons = ({ activeFilter, onFilterChange, jobCounts }: CategoryButtonsProps) => {
  const categories = [
    { 
      level: "easy" as const, 
      label: "Easy Entry",
      description: "Low requirements",
      colorClass: "bg-entry-easy hover:bg-entry-easy/80 border-entry-easy"
    },
    { 
      level: "moderate" as const, 
      label: "Moderate",
      description: "Some experience",
      colorClass: "bg-entry-moderate hover:bg-entry-moderate/80 border-entry-moderate"
    },
    { 
      level: "difficult" as const, 
      label: "Competitive",
      description: "High requirements",
      colorClass: "bg-entry-difficult hover:bg-entry-difficult/80 border-entry-difficult"
    },
  ];

  const handleClick = (level: "easy" | "moderate" | "difficult") => {
    if (activeFilter === level) {
      onFilterChange?.(null);
    } else {
      onFilterChange?.(level);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {categories.map((category) => {
        const count = jobCounts?.[category.level] ?? 0;
        
        return (
          <div key={category.level} className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleClick(category.level)}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
                "border-2 shadow-lg",
                category.colorClass,
                activeFilter === category.level 
                  ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" 
                  : "opacity-80 hover:opacity-100 hover:scale-105"
              )}
              title={`${category.label}: ${category.description}`}
            >
              <span className="text-sm font-bold text-white">
                {count}
              </span>
            </button>
            <span className="text-[10px] text-muted-foreground text-center">
              {category.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryButtons;
