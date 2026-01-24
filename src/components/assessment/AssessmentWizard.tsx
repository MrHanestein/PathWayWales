import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssessment } from '@/hooks/useAssessment';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from '@/components/AuthModal';
import AssessmentProgress from './AssessmentProgress';
import AboutYouStep from './steps/AboutYouStep';
import IncomeSecurityStep from './steps/IncomeSecurityStep';
import LifeSituationStep from './steps/LifeSituationStep';
import YourGoalStep from './steps/YourGoalStep';
import TechInterestsStep from './steps/TechInterestsStep';
import SkillsBaselineStep from './steps/SkillsBaselineStep';
import StabilityImpactStep from './steps/StabilityImpactStep';
import ConfidenceCheckStep from './steps/ConfidenceCheckStep';
import CompletionStep from './steps/CompletionStep';

interface AssessmentWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

const AssessmentWizard = ({ onClose, onComplete }: AssessmentWizardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    data,
    updateData,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    completeAssessment,
    loading,
    saving,
  } = useAssessment();

  const [isCompleted, setIsCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      console.log('[Wizard] Starting assessment completion...');
      const success = await completeAssessment();
      console.log('[Wizard] Completion result:', success);
      
      if (success) {
        // Add a small delay to ensure database write is committed
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsCompleted(true);
      }
    } else {
      await nextStep();
    }
  };

  const verifyAndNavigate = async (destination: '/results' | '/resources') => {
    if (!user) {
      navigate(destination);
      return;
    }

    setIsNavigating(true);
    
    try {
      // Verify the assessment is saved before navigating
      const { data: verified, error } = await supabase
        .from('assessments')
        .select('id, completed')
        .eq('user_id', user.id)
        .eq('completed', true)
        .maybeSingle();
      
      console.log('[Wizard] Navigation verification:', { verified, error });
      
      if (error) throw error;
      
      if (!verified) {
        toast({
          title: "Still saving...",
          description: "Please wait a moment and try again.",
        });
        return;
      }
      
      onComplete();
      navigate(destination);
    } catch (error) {
      console.error('[Wizard] Navigation verification failed:', error);
      toast({
        title: "Error",
        description: "Could not verify your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
    }
  };

  const handleViewResults = () => verifyAndNavigate('/results');
  const handleViewResources = () => verifyAndNavigate('/resources');

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.age_band && data.current_job_title && data.years_experience && 
               data.industry && data.highest_qualification && data.location && data.work_preference;
      case 2:
        return data.minimum_salary_needed && data.target_salary && 
               data.accept_pay_dip && data.financial_runway;
      case 3:
        return data.employment_status && data.reason_for_change && 
               data.family_situation && data.weekly_hours_available && data.learning_budget;
      case 4:
        return data.goal_type && data.desired_timeline && data.preferred_entry_route;
      case 5:
        return (data.tech_interests || []).length > 0;
      case 6:
        return data.digital_comfort_level && data.learning_style && data.existing_proof;
      case 7:
        return data.stability_vs_growth;
      case 8:
        return data.confidence_level;
      default:
        return true;
    }
  };

  const renderStep = () => {
    if (isCompleted) {
      return (
        <CompletionStep 
          onViewResults={handleViewResults}
          onViewResources={handleViewResources}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <AboutYouStep data={data} updateData={updateData} />;
      case 2:
        return <IncomeSecurityStep data={data} updateData={updateData} />;
      case 3:
        return <LifeSituationStep data={data} updateData={updateData} />;
      case 4:
        return <YourGoalStep data={data} updateData={updateData} />;
      case 5:
        return <TechInterestsStep data={data} updateData={updateData} />;
      case 6:
        return <SkillsBaselineStep data={data} updateData={updateData} />;
      case 7:
        return <StabilityImpactStep data={data} updateData={updateData} />;
      case 8:
        return <ConfidenceCheckStep data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
        <h1 className="text-lg font-semibold">Career Assessment</h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </header>

      {/* Progress Bar */}
      {!isCompleted && (
        <AssessmentProgress currentStep={currentStep} totalSteps={totalSteps} />
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {renderStep()}
        </div>
      </main>

      {/* Footer Navigation */}
      {!isCompleted && (
        <footer className="border-t border-border bg-background/95 backdrop-blur px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-3">
            {currentStep === totalSteps && !user && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm text-center">
                ⚠️ You'll need to sign in to save your results and unlock resources
              </div>
            )}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || saving}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || saving || isNavigating}
                className="gap-2"
              >
                {(saving || isNavigating) && <Loader2 className="w-4 h-4 animate-spin" />}
                {currentStep === totalSteps ? 'Complete' : 'Next'}
                {!saving && !isNavigating && currentStep !== totalSteps && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </footer>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default AssessmentWizard;
