import { BookOpen, Mic, ClipboardList, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomNavBarProps {
  resourcesLocked?: boolean;
  activeTab?: "resources" | "voice" | "assessment";
  onResourcesClick?: () => void;
  onVoiceClick?: () => void;
  onAssessmentClick?: () => void;
}

const BottomNavBar = ({
  resourcesLocked = true,
  activeTab,
  onResourcesClick,
  onVoiceClick,
  onAssessmentClick,
}: BottomNavBarProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-8 px-6 py-4 bg-background/85 backdrop-blur-md border-t border-border">
      {/* Resources - Can be locked */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onResourcesClick}
        disabled={resourcesLocked}
        className={cn(
          "relative flex flex-col items-center gap-1 h-auto py-2 px-4",
          activeTab === "resources" && !resourcesLocked && "text-primary",
          resourcesLocked && "opacity-60"
        )}
      >
        <div className="relative">
          <BookOpen className="w-6 h-6" />
          {resourcesLocked && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-muted rounded-full flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-muted-foreground" />
            </div>
          )}
        </div>
        <span className="text-xs font-medium">Resources</span>
      </Button>

      {/* Voice Chat - Center, larger */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onVoiceClick}
        className={cn(
          "relative flex flex-col items-center gap-1 h-auto py-2 px-6",
          activeTab === "voice" && "text-primary"
        )}
      >
        <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center hover:bg-primary/30 transition-colors">
          <Mic className="w-7 h-7 text-primary" />
        </div>
        <span className="text-xs font-medium mt-1">Voice Chat</span>
      </Button>

      {/* Assessment */}
      <Button
        variant="ghost"
        size="lg"
        onClick={onAssessmentClick}
        className={cn(
          "relative flex flex-col items-center gap-1 h-auto py-2 px-4",
          activeTab === "assessment" && "text-primary"
        )}
      >
        <ClipboardList className="w-6 h-6" />
        <span className="text-xs font-medium">Assessment</span>
      </Button>
    </nav>
  );
};

export default BottomNavBar;
