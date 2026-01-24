import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "@/components/TopNavBar";
import BottomNavBar from "@/components/BottomNavBar";
import InteractiveWalesMap from "@/components/InteractiveWalesMap";
import CategoryButtons from "@/components/CategoryButtons";
import SearchBar from "@/components/SearchBar";
import PartnersCarousel from "@/components/PartnersCarousel";
import JobDetailsModal from "@/components/JobDetailsModal";
import VoiceCoach from "@/components/VoiceCoach";
import AssessmentWizard from "@/components/assessment/AssessmentWizard";
import AuthModal from "@/components/AuthModal";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { JobMarker } from "@/components/InteractiveWalesMap";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"easy" | "moderate" | "difficult" | null>(null);
  const [resourcesLocked, setResourcesLocked] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobMarker | null>(null);
  const [showVoiceCoach, setShowVoiceCoach] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { jobs, loading, refetch, getJobCounts } = useJobs();
  const jobCounts = getJobCounts();

  // Check if assessment is completed
  useEffect(() => {
    const checkAssessmentStatus = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('assessment_completed')
        .eq('id', user.id)
        .single();
      
      if (profile?.assessment_completed) {
        setResourcesLocked(false);
      }
    };
    
    checkAssessmentStatus();
  }, [user]);

  const handleSearch = () => {
    setIsScanning(true);
    setShowMarkers(false);
    refetch();
    setTimeout(() => {
      setIsScanning(false);
      setShowMarkers(true);
    }, 3000);
  };

  const handleMarkerClick = (marker: JobMarker) => {
    setSelectedJob(marker);
  };

  const handleStartPathway = () => {
    setSelectedJob(null);
    setShowVoiceCoach(true);
  };

  const handleAssessmentComplete = () => {
    setShowAssessment(false);
    setResourcesLocked(false);
    navigate('/results');
  };

  const handleAssessmentClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowAssessment(true);
  };

  if (showVoiceCoach) {
    return <VoiceCoach onClose={() => setShowVoiceCoach(false)} />;
  }

  if (showAssessment) {
    return (
      <AssessmentWizard 
        onClose={() => setShowAssessment(false)} 
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <TopNavBar />

      <main className="flex-1 flex pt-16 pb-24 relative">
        <div className="flex-1 relative">
          <InteractiveWalesMap 
            isScanning={isScanning}
            showMarkers={showMarkers}
            filterLevel={activeFilter}
            onMarkerClick={handleMarkerClick}
            jobs={jobs}
          />

          <div className="absolute bottom-4 left-4 right-20 md:left-8 md:right-28 z-20">
            <SearchBar onSearch={handleSearch} isSearching={isScanning} />
          </div>

          <div className="absolute bottom-4 right-4 w-36 md:w-44 z-20">
            <PartnersCarousel />
          </div>

          {loading && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-sm text-primary flex items-center gap-2 z-20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Syncing data...
            </div>
          )}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <CategoryButtons activeFilter={activeFilter} onFilterChange={setActiveFilter} jobCounts={jobCounts} />
        </div>

        {selectedJob && (
          <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} onStartPathway={handleStartPathway} />
        )}
      </main>

      <BottomNavBar 
        resourcesLocked={resourcesLocked}
        onResourcesClick={() => navigate('/resources')}
        onVoiceClick={() => setShowVoiceCoach(true)}
        onAssessmentClick={handleAssessmentClick}
      />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;
