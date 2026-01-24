import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";

const TOUR_STORAGE_KEY = "pathwaywales_tour_done";

interface TourStep {
  target: string;
  title: string;
  content: string;
}

const tourSteps: TourStep[] = [
  {
    target: "map",
    title: "Welcome to PathwayWales!",
    content: "This is your career map of Wales. Tech jobs appear as pins - green means easy entry, orange moderate, red competitive.",
  },
  {
    target: "partners",
    title: "Hiring Partners",
    content: "We partner with Welsh employers actively hiring career changers. Swipe to see who's looking for people like you.",
  },
  {
    target: "bottom-nav",
    title: "Your Toolkit",
    content: "Assessment (right) to discover your path, Learning Resources (left, unlocks after assessment), and AI Career Coach (middle) to guide you.",
  },
  {
    target: "assessment",
    title: "Start Here!",
    content: "Complete your career assessment to unlock personalized learning pathways and get matched with suitable roles.",
  },
  {
    target: "search",
    title: "Find Opportunities",
    content: "Use search to scan for live opportunities matching your profile.",
  },
];

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);

  useEffect(() => {
    const tourDone = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourDone) {
      // Delay to let the page render
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateHighlight = useCallback(() => {
    if (!isOpen) return;
    
    const step = tourSteps[currentStep];
    const element = document.querySelector(`[data-tour="${step.target}"]`);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      });
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay with cutout */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          clipPath: highlightRect
            ? `polygon(
                0% 0%, 
                0% 100%, 
                ${highlightRect.left}px 100%, 
                ${highlightRect.left}px ${highlightRect.top}px, 
                ${highlightRect.left + highlightRect.width}px ${highlightRect.top}px, 
                ${highlightRect.left + highlightRect.width}px ${highlightRect.top + highlightRect.height}px, 
                ${highlightRect.left}px ${highlightRect.top + highlightRect.height}px, 
                ${highlightRect.left}px 100%, 
                100% 100%, 
                100% 0%
              )`
            : "none",
        }}
      />

      {/* Highlight box with glow */}
      {highlightRect && (
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            border: "2px solid white",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
          }}
        />
      )}

      {/* Tooltip card */}
      {highlightRect && (
        <div
          className="absolute bg-card border border-border rounded-xl p-5 shadow-2xl max-w-sm transition-all duration-300"
          style={{
            top: highlightRect.top + highlightRect.height + 20,
            left: Math.min(
              Math.max(highlightRect.left, 16),
              window.innerWidth - 340
            ),
          }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-3">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-6 bg-primary"
                    : idx < currentStep
                    ? "w-3 bg-primary/50"
                    : "w-3 bg-muted"
                }`}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{step.content}</p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Skip
            </Button>
            <Button size="sm" onClick={handleNext} className="gap-1">
              {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingTour;
