import { useState } from "react";
import { Settings, DoorOpen, DoorClosed, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavBarProps {
  onSettingsClick?: () => void;
}

const TopNavBar = ({ onSettingsClick }: TopNavBarProps) => {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      // User is logged in, show dropdown menu
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:text-primary hover:bg-muted"
                >
                  <DoorOpen className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Signed in</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAuthClick}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <DoorClosed className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default TopNavBar;
