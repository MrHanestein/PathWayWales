import { useState } from "react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  x: number;
  y: number;
}

interface JobMarker {
  id: string;
  city: string;
  x: number;
  y: number;
  level: "easy" | "moderate" | "difficult";
  title: string;
  company: string;
}

interface WalesMapProps {
  isScanning?: boolean;
  showMarkers?: boolean;
  filterLevel?: "easy" | "moderate" | "difficult" | null;
  onMarkerClick?: (marker: JobMarker) => void;
}

const cities: City[] = [
  { name: "Wrexham", x: 72, y: 22 },
  { name: "Aberystwyth", x: 35, y: 45 },
  { name: "Swansea", x: 38, y: 75 },
  { name: "Cardiff", x: 65, y: 82 },
  { name: "Newport", x: 78, y: 80 },
];

const sampleJobs: JobMarker[] = [
  { id: "1", city: "Cardiff", x: 62, y: 78, level: "easy", title: "IT Support Technician", company: "Welsh Gov" },
  { id: "2", city: "Cardiff", x: 68, y: 84, level: "moderate", title: "Junior Developer", company: "Admiral" },
  { id: "3", city: "Swansea", x: 35, y: 72, level: "easy", title: "Help Desk Analyst", company: "DVLA" },
  { id: "4", city: "Swansea", x: 42, y: 78, level: "difficult", title: "Security Engineer", company: "Amazon" },
  { id: "5", city: "Newport", x: 75, y: 77, level: "moderate", title: "Data Analyst", company: "ONS" },
  { id: "6", city: "Wrexham", x: 70, y: 25, level: "easy", title: "Tech Support", company: "JCB" },
  { id: "7", city: "Wrexham", x: 75, y: 19, level: "difficult", title: "Cloud Architect", company: "AWS" },
  { id: "8", city: "Aberystwyth", x: 32, y: 42, level: "moderate", title: "Research Developer", company: "University" },
];

const WalesMap = ({ isScanning = false, showMarkers = false, filterLevel, onMarkerClick }: WalesMapProps) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const filteredJobs = filterLevel 
    ? sampleJobs.filter(job => job.level === filterLevel)
    : sampleJobs;

  const getLevelColor = (level: "easy" | "moderate" | "difficult") => {
    switch (level) {
      case "easy": return "fill-entry-easy stroke-entry-easy";
      case "moderate": return "fill-entry-moderate stroke-entry-moderate";
      case "difficult": return "fill-entry-difficult stroke-entry-difficult";
    }
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
        className="w-full max-w-md h-auto"
        style={{ maxHeight: '70vh' }}
      >
        {/* Wales Outline - Simplified stylized shape */}
        <path
          d="M 45 5 
             L 75 8 
             L 80 15 
             L 78 25 
             L 72 35 
             L 68 45 
             L 72 55 
             L 78 65 
             L 82 75 
             L 78 85 
             L 70 90 
             L 55 92 
             L 40 88 
             L 30 82 
             L 25 72 
             L 28 60 
             L 22 50 
             L 25 40 
             L 30 30 
             L 35 20 
             L 40 10 
             Z"
          className="fill-map-background stroke-map-outline"
          strokeWidth="0.8"
        />

        {/* City Dots */}
        {cities.map((city) => (
          <g key={city.name}>
            <circle
              cx={city.x}
              cy={city.y}
              r="1.5"
              className="fill-muted-foreground/60"
            />
            <text
              x={city.x}
              y={city.y - 3}
              textAnchor="middle"
              className="fill-muted-foreground text-[2.5px] font-medium"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Job Markers */}
        {showMarkers && filteredJobs.map((job) => (
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
                  x={job.x - 15}
                  y={job.y - 12}
                  width="30"
                  height="8"
                  rx="1"
                  className="fill-card stroke-border"
                  strokeWidth="0.2"
                />
                <text
                  x={job.x}
                  y={job.y - 7}
                  textAnchor="middle"
                  className="fill-foreground text-[2px] font-medium"
                >
                  {job.title}
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
export type { JobMarker };
