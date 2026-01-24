import { useState } from "react";
import TopNavBar from "@/components/TopNavBar";
import BottomNavBar from "@/components/BottomNavBar";
import WalesMap from "@/components/WalesMap";
import CategoryButtons from "@/components/CategoryButtons";
import SearchBar from "@/components/SearchBar";
import PartnersCarousel from "@/components/PartnersCarousel";
import { useJobs } from "@/hooks/useJobs";
import type { JobMarker } from "@/components/WalesMap";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"easy" | "moderate" | "difficult" | null>(null);
  const [resourcesLocked, setResourcesLocked] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobMarker | null>(null);

  // Fetch jobs from database
  const { jobs, loading, getJobCounts } = useJobs();
  const jobCounts = getJobCounts();

  const handleSearch = () => {
    setIsScanning(true);
    setShowMarkers(false);
    
    // Simulate scanning animation
    setTimeout(() => {
      setIsScanning(false);
      setShowMarkers(true);
    }, 2000);
  };

  const handleMarkerClick = (marker: JobMarker) => {
    setSelectedJob(marker);
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
    if (min) return `From £${min.toLocaleString()}`;
    if (max) return `Up to £${max.toLocaleString()}`;
    return "Salary not specified";
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content Area */}
      <main className="flex-1 flex pt-16 pb-24 relative">
        {/* Map Area - Takes most of the space */}
        <div className="flex-1 relative">
          <WalesMap 
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
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-card/90 px-4 py-2 rounded-full text-sm text-muted-foreground">
              Loading jobs...
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
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-40"
            onClick={() => setSelectedJob(null)}
          >
            <div 
              className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedJob.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium text-white
                  ${selectedJob.level === 'easy' ? 'bg-entry-easy' : ''}
                  ${selectedJob.level === 'moderate' ? 'bg-entry-moderate' : ''}
                  ${selectedJob.level === 'difficult' ? 'bg-entry-difficult' : ''}
                `}>
                  {selectedJob.level === 'easy' && 'Easy Entry'}
                  {selectedJob.level === 'moderate' && 'Moderate'}
                  {selectedJob.level === 'difficult' && 'Competitive'}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  📍 {selectedJob.city}, Wales
                </p>
                <p className="text-primary font-medium">
                  💰 {formatSalary(selectedJob.salary_min, selectedJob.salary_max)}
                </p>
                
                {selectedJob.description && (
                  <p className="text-muted-foreground text-xs">
                    {selectedJob.description}
                  </p>
                )}
                
                <div className="pt-3 border-t border-border">
                  <p className="font-medium text-foreground mb-2">Requirements:</p>
                  <ul className="text-muted-foreground space-y-1">
                    {selectedJob.requirements && selectedJob.requirements.length > 0 ? (
                      selectedJob.requirements.map((req, i) => (
                        <li key={i}>• {req}</li>
                      ))
                    ) : (
                      <>
                        {selectedJob.level === 'easy' && (
                          <>
                            <li>• Basic IT skills</li>
                            <li>• Communication skills</li>
                            <li>• Willingness to learn</li>
                          </>
                        )}
                        {selectedJob.level === 'moderate' && (
                          <>
                            <li>• 1-2 years experience</li>
                            <li>• Relevant qualification</li>
                            <li>• Problem-solving skills</li>
                          </>
                        )}
                        {selectedJob.level === 'difficult' && (
                          <>
                            <li>• 3+ years experience</li>
                            <li>• Industry certifications</li>
                            <li>• Proven track record</li>
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <button 
                className="w-full mt-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-colors"
                onClick={() => setSelectedJob(null)}
              >
                Start Pathway
              </button>
            </div>
          </div>
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
