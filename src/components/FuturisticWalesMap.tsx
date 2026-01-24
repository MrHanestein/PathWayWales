import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { welshCities, walesPath, regionPaths } from "@/lib/walesCities";
import type { Job } from "@/hooks/useJobs";
import { ZoomIn, ZoomOut, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  skills?: string[];
  posted_date?: string | null;
  url?: string | null;
}

interface FuturisticWalesMapProps {
  isScanning?: boolean;
  showMarkers?: boolean;
  filterLevel?: "easy" | "moderate" | "difficult" | null;
  onMarkerClick?: (marker: JobMarker) => void;
  jobs?: Job[];
}

const getCityCoordinates = (cityName: string): { x: number; y: number } | null => {
  const city = welshCities.find(
    c => c.name.toLowerCase() === cityName.toLowerCase()
  );
  return city ? { x: city.x, y: city.y } : null;
};

const FuturisticWalesMap = ({ 
  isScanning = false, 
  showMarkers = false, 
  filterLevel, 
  onMarkerClick,
  jobs = []
}: FuturisticWalesMapProps) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scanning animation progress
  useEffect(() => {
    if (isScanning) {
      setScanProgress(0);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  // Convert jobs to markers with coordinates
  const jobMarkers: JobMarker[] = jobs
    .map(job => {
      const coords = getCityCoordinates(job.city);
      if (!coords) return null;
      
      const cityJobs = jobs.filter(j => j.city === job.city);
      const index = cityJobs.findIndex(j => j.id === job.id);
      const angle = (index * 360) / Math.max(cityJobs.length, 1);
      const radius = Math.min(index * 1.5, 6);
      const offsetX = Math.cos(angle * Math.PI / 180) * radius;
      const offsetY = Math.sin(angle * Math.PI / 180) * radius;
      
      return {
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
        skills: job.skills,
        posted_date: job.posted_date,
        url: job.url,
      } as JobMarker;
    })
    .filter((m): m is JobMarker => m !== null);

  const filteredMarkers = filterLevel 
    ? jobMarkers.filter(job => job.level === filterLevel)
    : jobMarkers;

  const getLevelGradient = (level: "easy" | "moderate" | "difficult") => {
    switch (level) {
      case "easy": return "url(#gradient-easy)";
      case "moderate": return "url(#gradient-moderate)";
      case "difficult": return "url(#gradient-difficult)";
    }
  };

  const getLevelGlow = (level: "easy" | "moderate" | "difficult") => {
    switch (level) {
      case "easy": return "drop-shadow(0 0 6px hsl(160, 63%, 42%))";
      case "moderate": return "drop-shadow(0 0 6px hsl(28, 87%, 55%))";
      case "difficult": return "drop-shadow(0 0 6px hsl(0, 72%, 51%))";
    }
  };

  const getCityJobCount = (cityName: string) => {
    return jobs.filter(j => j.city.toLowerCase() === cityName.toLowerCase()).length;
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.3, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.3, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(z => Math.max(0.5, Math.min(3, z + delta)));
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-card/50"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      />

      {/* Hex Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Orange Data Wave Effect - Scanning */}
      {isScanning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Central expanding wave */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${scanProgress * 8}%`,
              height: `${scanProgress * 8}%`,
              opacity: 1 - (scanProgress / 100),
            }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/60 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-transparent" />
          </div>
          
          {/* Scanning beam */}
          <div 
            className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent"
            style={{
              top: `${scanProgress - 20}%`,
              filter: 'blur(10px)',
            }}
          />
          
          {/* Data particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomIn className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomOut className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleReset}
          className="w-10 h-10 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <Locate className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-full border border-primary/30">
        <span className="text-xs font-mono text-primary">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Wales SVG Map */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "w-full max-w-2xl h-auto transition-transform duration-200",
          isPanning && "cursor-grabbing"
        )}
        style={{ 
          maxHeight: '75vh',
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-primary" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradients for markers */}
          <radialGradient id="gradient-easy" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(160, 80%, 60%)" />
            <stop offset="100%" stopColor="hsl(160, 63%, 35%)" />
          </radialGradient>
          
          <radialGradient id="gradient-moderate" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(28, 100%, 65%)" />
            <stop offset="100%" stopColor="hsl(28, 87%, 45%)" />
          </radialGradient>
          
          <radialGradient id="gradient-difficult" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="hsl(0, 85%, 60%)" />
            <stop offset="100%" stopColor="hsl(0, 72%, 40%)" />
          </radialGradient>

          {/* Map gradient */}
          <linearGradient id="map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card))" />
            <stop offset="50%" stopColor="hsl(var(--muted))" />
            <stop offset="100%" stopColor="hsl(var(--card))" />
          </linearGradient>

          {/* Glow for map outline */}
          <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <path
          d={walesPath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          opacity="0.15"
          filter="url(#glow-strong)"
        />

        {/* Region paths with subtle glow */}
        <path
          d={regionPaths.north}
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.2"
        />
        <path
          d={regionPaths.mid}
          fill="hsl(var(--primary) / 0.03)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.2"
        />
        <path
          d={regionPaths.south}
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.2"
        />

        {/* Wales Main Outline */}
        <path
          d={walesPath}
          fill="url(#map-gradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          filter="url(#map-glow)"
          className="transition-all duration-300"
        />

        {/* Circuit lines connecting cities */}
        {welshCities.map((city, i) => {
          const nextCity = welshCities[(i + 1) % welshCities.length];
          if (city.region !== nextCity.region) return null;
          return (
            <line
              key={`line-${i}`}
              x1={city.x}
              y1={city.y}
              x2={nextCity.x}
              y2={nextCity.y}
              stroke="hsl(var(--primary) / 0.15)"
              strokeWidth="0.3"
              strokeDasharray="1 1"
            />
          );
        })}

        {/* City Nodes */}
        {welshCities.map((city) => {
          const jobCount = getCityJobCount(city.name);
          const isHovered = hoveredCity === city.name;
          const hasJobs = jobCount > 0;
          
          return (
            <g 
              key={city.name}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              className="cursor-pointer"
            >
              {/* Outer glow ring */}
              {hasJobs && (
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 5 : 4}
                  fill="none"
                  stroke="hsl(var(--primary) / 0.3)"
                  strokeWidth="0.5"
                  className="animate-pulse"
                />
              )}
              
              {/* City node */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isHovered ? 2.5 : 2}
                fill={hasJobs ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)"}
                filter={hasJobs ? "url(#glow-primary)" : undefined}
                className="transition-all duration-300"
              />
              
              {/* Inner bright core */}
              <circle
                cx={city.x}
                cy={city.y}
                r="0.6"
                fill="white"
                opacity={hasJobs ? 0.8 : 0.3}
              />
              
              {/* City label */}
              <text
                x={city.x}
                y={city.y - 4}
                textAnchor="middle"
                className={cn(
                  "text-[2.5px] font-bold tracking-wide uppercase transition-all",
                  isHovered || hasJobs ? "fill-foreground" : "fill-muted-foreground/70"
                )}
                style={{ 
                  filter: isHovered ? 'drop-shadow(0 0 2px hsl(var(--primary)))' : undefined 
                }}
              >
                {city.name}
              </text>
              
              {/* Job count badge */}
              {isHovered && jobCount > 0 && (
                <g className="animate-in fade-in zoom-in duration-200">
                  <rect
                    x={city.x - 6}
                    y={city.y + 3}
                    width="12"
                    height="5"
                    rx="1"
                    fill="hsl(var(--primary))"
                    opacity="0.9"
                  />
                  <text
                    x={city.x}
                    y={city.y + 6.5}
                    textAnchor="middle"
                    className="fill-primary-foreground text-[2px] font-bold"
                  >
                    {jobCount} jobs
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Futuristic Job Markers */}
        {showMarkers && filteredMarkers.map((job, index) => (
          <g
            key={job.id}
            className="cursor-pointer"
            onClick={() => onMarkerClick?.(job)}
            onMouseEnter={() => setHoveredMarker(job.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            style={{
              animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* Pulsing outer ring */}
            <circle
              cx={job.x}
              cy={job.y}
              r="4"
              fill="none"
              stroke={getLevelGradient(job.level)}
              strokeWidth="0.3"
              opacity={hoveredMarker === job.id ? 1 : 0.5}
              className="animate-pulse"
            />
            
            {/* Hexagonal marker */}
            <polygon
              points={`${job.x},${job.y-3} ${job.x+2.6},${job.y-1.5} ${job.x+2.6},${job.y+1.5} ${job.x},${job.y+3} ${job.x-2.6},${job.y+1.5} ${job.x-2.6},${job.y-1.5}`}
              fill={getLevelGradient(job.level)}
              stroke="white"
              strokeWidth="0.2"
              filter="url(#glow-primary)"
              style={{ filter: getLevelGlow(job.level) }}
              className={cn(
                "transition-all duration-200",
                hoveredMarker === job.id && "scale-110"
              )}
            />
            
            {/* Inner icon */}
            <circle
              cx={job.x}
              cy={job.y}
              r="1"
              fill="white"
              opacity="0.9"
            />
            
            {/* Tooltip on hover */}
            {hoveredMarker === job.id && (
              <g className="pointer-events-none">
                <rect
                  x={job.x - 20}
                  y={job.y - 18}
                  width="40"
                  height="14"
                  rx="2"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.3"
                  filter="url(#glow-primary)"
                />
                <text
                  x={job.x}
                  y={job.y - 12}
                  textAnchor="middle"
                  className="fill-primary text-[2.5px] font-bold"
                >
                  {job.title.length > 22 ? job.title.slice(0, 22) + '...' : job.title}
                </text>
                <text
                  x={job.x}
                  y={job.y - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[2px]"
                >
                  {job.company} • {job.city}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Scan Complete Overlay */}
      {showMarkers && !isScanning && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full border border-primary/50 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-sm font-medium text-primary">
            📡 {filteredMarkers.length} opportunities found
          </span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FuturisticWalesMap;
