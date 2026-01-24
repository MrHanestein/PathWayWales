import { useState } from "react";
import TopNavBar from "@/components/TopNavBar";
import BottomNavBar from "@/components/BottomNavBar";
import FuturisticWalesMap from "@/components/FuturisticWalesMap";
import CategoryButtons from "@/components/CategoryButtons";
import SearchBar from "@/components/SearchBar";
import PartnersCarousel from "@/components/PartnersCarousel";
import JobDetailsModal from "@/components/JobDetailsModal";
import { useJobs } from "@/hooks/useJobs";
import type { JobMarker } from "@/components/FuturisticWalesMap";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"easy" | "moderate" | "difficult" | null>(null);
  const [resourcesLocked, setResourcesLocked] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobMarker | null>(null);

  // Fetch jobs from database
  const { jobs, loading, refetch, getJobCounts } = useJobs();
  const jobCounts = getJobCounts();

  const handleSearch = () => {
    setIsScanning(true);
    setShowMarkers(false);
    
    // Refetch jobs and show animation
    refetch();
    
    // Show markers after scan animation
    setTimeout(() => {
      setIsScanning(false);
      setShowMarkers(true);
    }, 2000);
  };

  const handleMarkerClick = (marker: JobMarker) => {
    setSelectedJob(marker);
  };

  const handleStartPathway = () => {
    // TODO: Navigate to pathway/assessment
    setSelectedJob(null);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content Area */}
      <main className="flex-1 flex pt-16 pb-24 relative">
        {/* Map Area - Takes most of the space */}
        <div className="flex-1 relative">
          <FuturisticWalesMap 
            isScanning={isScanning}
            showMarkers={showMarkers}
            filterLevel={activeFilter}
            onMarkerClick={handleMarkerClick}
            jobs={jobs}
          />

          {/* Search Bar - Bottom of map */}
          <div className="absolute bottom-4 left-4 right-20 md:left-8 md:right-28">
            <SearchBar 
              onSearch={handleSearch}
              isSearching={isScanning}
            />
          </div>

          {/* Partners Carousel - Bottom right */}
          <div className="absolute bottom-4 right-4 w-36 md:w-44">
            <PartnersCarousel />
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 text-sm text-primary flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Syncing data...
            </div>
          )}
        </div>

        {/* Right Sidebar - Category Buttons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <CategoryButtons 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            jobCounts={jobCounts}
          />
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onStartPathway={handleStartPathway}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar 
        resourcesLocked={resourcesLocked}
      />
    </div>
  );
};

export default Index;
