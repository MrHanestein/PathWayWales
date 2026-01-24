import { Settings, DoorOpen, DoorClosed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavBarProps {
  isLoggedIn?: boolean;
  onSettingsClick?: () => void;
  onAuthClick?: () => void;
}

const TopNavBar = ({ isLoggedIn = false, onSettingsClick, onAuthClick }: TopNavBarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">PW</span>
        </div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Pathway<span className="text-primary">Wales</span>
        </h1>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAuthClick}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {isLoggedIn ? (
            <DoorOpen className="w-5 h-5 text-primary" />
          ) : (
            <DoorClosed className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default TopNavBar;
