import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: () => void;
  isSearching?: boolean;
}

const SearchBar = ({ onSearch, isSearching = false }: SearchBarProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleSearch = () => {
    setIsActive(true);
    onSearch?.();
    // Reset after animation
    setTimeout(() => setIsActive(false), 2500);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleSearch}
        disabled={isSearching}
        className={cn(
          "w-full h-12 bg-surface hover:bg-surface-elevated border border-border",
          "flex items-center justify-center gap-3 rounded-xl",
          "transition-all duration-300",
          isActive && "bg-primary/20 border-primary"
        )}
      >
        {isSearching ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Search className="w-5 h-5 text-muted-foreground" />
        )}
        <span className="text-sm font-medium text-foreground">
          {isSearching ? "Scanning Wales..." : "Search Available Jobs"}
        </span>
      </Button>

      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-primary/30 blur-xl animate-pulse" />
      )}
    </div>
  );
};

export default SearchBar;
