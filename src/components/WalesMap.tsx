import { useState } from "react";
import { cn } from "@/lib/utils";
import { welshCities, walesPath, WelshCity } from "@/lib/walesCities";
import type { Job } from "@/hooks/useJobs";

export interface JobMarker {
  id: string;
  city: string;
  x: number;
  y: number;
  level: "easy" | "moderate" | "difficult";
  title: string;
  company: string;
  salary_min?: number | null;
  salary_max?: number | null;
  requirements?: string[];
  description?: string | null;
}

type JobMarkerInternal = JobMarker;

interface WalesMapProps {
  isScanning?: boolean;
  showMarkers?: boolean;
  filterLevel?: "easy" | "moderate" | "difficult" | null;
  onMarkerClick?: (marker: JobMarker) => void;
  jobs?: Job[];
}

// Map jobs to city coordinates
const getCityCoordinates = (cityName: string): { x: number; y: number } | null => {
  const city = welshCities.find(
    c => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city ? { x: city.x, y: city.y } : null;
};

const WalesMap = ({ 
  isScanning = false, 
  showMarkers = false, 
  filterLevel, 
  onMarkerClick,
  jobs = []
}: WalesMapProps) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Convert jobs to markers with coordinates
  const jobMarkers: JobMarker[] = jobs
    .map(job => {
      const coords = getCityCoordinates(job.city);
      if (!coords) return null;
      
      // Add slight offset for jobs in same city
      const cityJobs = jobs.filter(j => j.city === job.city);
      const index = cityJobs.findIndex(j => j.id === job.id);
      const offsetX = (index % 3) * 3 - 3;
      const offsetY = Math.floor(index / 3) * 3;
      
      const marker: JobMarker = {
        id: job.id,
        city: job.city,
        x: coords.x + offsetX,
        y: coords.y + offsetY,
        level: job.entry_level,
        title: job.title,
        company: job.company,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        requirements: job.requirements,
        description: job.description,
      };
      return marker;
    })
    .filter((m): m is JobMarker => m !== null);

  const filteredMarkers = filterLevel 
    ? jobMarkers.filter(job => job.level === filterLevel)
    : jobMarkers;

  const getLevelColor = (level: "easy" | "moderate" | "difficult") => {
    switch (level) {
      case "easy": return "fill-entry-easy stroke-entry-easy";
      case "moderate": return "fill-entry-moderate stroke-entry-moderate";
      case "difficult": return "fill-entry-difficult stroke-entry-difficult";
    }
  };

  // Get job count for a city
  const getCityJobCount = (cityName: string) => {
    return jobs.filter(j => j.city.toLowerCase() === cityName.toLowerCase()).length;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--map-grid)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--map-grid)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanning Beam Effect */}
      {isScanning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-scan-beam"
          />
        </div>
      )}

      {/* Wales SVG Map */}
      <svg
        viewBox="0 0 100 100"
        className="w-full max-w-lg h-auto"
        style={{ maxHeight: '75vh' }}
      >
        {/* Wales Outline - More detailed shape */}
        <path
          d={walesPath}
          className="fill-map-background stroke-map-outline"
          strokeWidth="0.8"
        />

        {/* City Dots and Labels */}
        {welshCities.map((city) => {
          const jobCount = getCityJobCount(city.name);
          const isHovered = hoveredCity === city.name;
          
          return (
            <g 
              key={city.name}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              className="cursor-pointer"
            >
              {/* City dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isHovered ? 2 : 1.5}
                className={cn(
                  "transition-all duration-200",
                  jobCount > 0 
                    ? "fill-primary/80" 
                    : "fill-muted-foreground/60"
                )}
              />
              
              {/* City label */}
              <text
                x={city.x}
                y={city.y - 3.5}
                textAnchor="middle"
                className={cn(
                  "text-[2.2px] font-medium transition-all",
                  isHovered ? "fill-foreground" : "fill-muted-foreground"
                )}
              >
                {city.name}
              </text>
              
              {/* Job count badge on hover */}
              {isHovered && jobCount > 0 && (
                <g>
                  <rect
                    x={city.x - 8}
                    y={city.y + 2}
                    width="16"
                    height="5"
                    rx="1"
                    className="fill-card stroke-border"
                    strokeWidth="0.2"
                  />
                  <text
                    x={city.x}
                    y={city.y + 5.5}
                    textAnchor="middle"
                    className="fill-primary text-[2px] font-semibold"
                  >
                    {jobCount} jobs
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Job Markers */}
        {showMarkers && filteredMarkers.map((job) => (
          <g
            key={job.id}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onMarkerClick?.(job)}
            onMouseEnter={() => setHoveredMarker(job.id)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            {/* Marker Pin */}
            <circle
              cx={job.x}
              cy={job.y}
              r="2.5"
              className={cn(
                getLevelColor(job.level),
                "stroke-[0.3] opacity-90",
                hoveredMarker === job.id && "opacity-100 animate-pulse-glow"
              )}
            />
            {/* Inner dot */}
            <circle
              cx={job.x}
              cy={job.y}
              r="0.8"
              className="fill-background"
            />
            
            {/* Tooltip on hover */}
            {hoveredMarker === job.id && (
              <g>
                <rect
                  x={job.x - 18}
                  y={job.y - 14}
                  width="36"
                  height="10"
                  rx="1"
                  className="fill-card stroke-border"
                  strokeWidth="0.2"
                />
                <text
                  x={job.x}
                  y={job.y - 9}
                  textAnchor="middle"
                  className="fill-foreground text-[2px] font-medium"
                >
                  {job.title.length > 20 ? job.title.slice(0, 20) + '...' : job.title}
                </text>
                <text
                  x={job.x}
                  y={job.y - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[1.5px]"
                >
                  {job.company}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WalesMap;
