import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import type { Job } from '@/hooks/useJobs';
import { welshCities } from '@/lib/walesCities';
import { ZoomIn, ZoomOut, Locate, Layers, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mapbox public token (publishable - safe for client-side)
mapboxgl.accessToken = 'pk.eyJ1IjoibXJoYW5lc3RlaW4iLCJhIjoiY21rczhtMmowMTlnNTNoc2Fybml6aTdkbyJ9.2WYq0r036bodNoQShopafQ';

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
  lng?: number;
  lat?: number;
}

interface InteractiveWalesMapProps {
  isScanning?: boolean;
  showMarkers?: boolean;
  filterLevel?: "easy" | "moderate" | "difficult" | null;
  onMarkerClick?: (marker: JobMarker) => void;
  jobs?: Job[];
}

// Welsh counties with approximate coordinates for coloring
const welshCounties = [
  { name: 'Gwynedd', color: '#10b981', jobs: 0 },
  { name: 'Anglesey', color: '#14b8a6', jobs: 0 },
  { name: 'Conwy', color: '#06b6d4', jobs: 0 },
  { name: 'Denbighshire', color: '#0ea5e9', jobs: 0 },
  { name: 'Flintshire', color: '#3b82f6', jobs: 0 },
  { name: 'Wrexham', color: '#6366f1', jobs: 0 },
  { name: 'Powys', color: '#8b5cf6', jobs: 0 },
  { name: 'Ceredigion', color: '#a855f7', jobs: 0 },
  { name: 'Pembrokeshire', color: '#d946ef', jobs: 0 },
  { name: 'Carmarthenshire', color: '#ec4899', jobs: 0 },
  { name: 'Swansea', color: '#f43f5e', jobs: 0 },
  { name: 'Neath Port Talbot', color: '#ef4444', jobs: 0 },
  { name: 'Bridgend', color: '#f97316', jobs: 0 },
  { name: 'Vale of Glamorgan', color: '#eab308', jobs: 0 },
  { name: 'Cardiff', color: '#84cc16', jobs: 0 },
  { name: 'Rhondda Cynon Taf', color: '#22c55e', jobs: 0 },
  { name: 'Merthyr Tydfil', color: '#10b981', jobs: 0 },
  { name: 'Caerphilly', color: '#14b8a6', jobs: 0 },
  { name: 'Blaenau Gwent', color: '#06b6d4', jobs: 0 },
  { name: 'Torfaen', color: '#0ea5e9', jobs: 0 },
  { name: 'Monmouthshire', color: '#3b82f6', jobs: 0 },
  { name: 'Newport', color: '#6366f1', jobs: 0 },
];

// City coordinates for markers (lng, lat)
const cityCoordinates: Record<string, [number, number]> = {
  'Cardiff': [-3.1791, 51.4816],
  'Swansea': [-3.9436, 51.6214],
  'Newport': [-3.0000, 51.5842],
  'Wrexham': [-2.9916, 53.0462],
  'Bangor': [-4.1272, 53.2274],
  'Barry': [-3.2668, 51.4000],
  'Neath': [-3.8075, 51.6604],
  'Port Talbot': [-3.7981, 51.5906],
  'Bridgend': [-3.5768, 51.5079],
  'Merthyr Tydfil': [-3.3750, 51.7475],
  'Caerphilly': [-3.2180, 51.5786],
  'Llandudno': [-3.8255, 53.3241],
  'Colwyn Bay': [-3.7267, 53.2934],
  'Rhyl': [-3.4916, 53.3192],
  'Aberystwyth': [-4.0829, 52.4153],
  'Newtown': [-3.3138, 52.5129],
  'Welshpool': [-3.1457, 52.6600],
};

const InteractiveWalesMap = ({
  isScanning = false,
  showMarkers = false,
  filterLevel,
  onMarkerClick,
  jobs = []
}: InteractiveWalesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [scanProgress, setScanProgress] = useState(0);

  // Scanning animation
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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const styleUrls: Record<string, string> = {
      dark: 'mapbox://styles/mapbox/dark-v11',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      streets: 'mapbox://styles/mapbox/streets-v12',
    };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrls[mapStyle],
      center: [-3.5, 52.2], // Center of Wales
      zoom: 7,
      minZoom: 5,
      maxZoom: 15,
      pitch: 30,
      bearing: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add Wales boundary highlight
      if (map.current) {
        // Add a source for UK administrative boundaries
        map.current.addSource('admin-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-streets-v8'
        });

        // Wales bounding box mask - create a subtle highlight
        map.current.addLayer({
          id: 'wales-highlight',
          type: 'fill',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-5.5, 51.3],
                  [-2.6, 51.3],
                  [-2.6, 53.5],
                  [-5.5, 53.5],
                  [-5.5, 51.3]
                ]]
              }
            }
          },
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.05
          }
        });

        // Add a glow effect around Wales
        map.current.addLayer({
          id: 'wales-border-glow',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [-5.3, 51.35],
                  [-5.45, 51.7],
                  [-5.3, 52.0],
                  [-5.1, 52.3],
                  [-4.8, 52.6],
                  [-4.1, 52.9],
                  [-4.2, 53.2],
                  [-4.0, 53.4],
                  [-3.5, 53.35],
                  [-3.0, 53.25],
                  [-2.75, 53.1],
                  [-2.95, 52.8],
                  [-3.0, 52.5],
                  [-2.95, 52.2],
                  [-2.7, 51.85],
                  [-2.65, 51.55],
                  [-2.95, 51.38],
                  [-3.4, 51.35],
                  [-4.0, 51.4],
                  [-4.5, 51.45],
                  [-5.0, 51.45],
                  [-5.3, 51.35]
                ]]
              }
            }
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 3,
            'line-blur': 2,
            'line-opacity': 0.8
          }
        });

        // Add colorful Welsh regions
        addWelshRegions(map.current);
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add Welsh regions with colors
  const addWelshRegions = (mapInstance: mapboxgl.Map) => {
    // Define Welsh local authority areas with colors
    const regions: Array<{
      name: string;
      coordinates: [number, number][];
      color: string;
    }> = [
      {
        name: 'Cardiff',
        coordinates: [[-3.25, 51.42], [-3.1, 51.42], [-3.1, 51.52], [-3.25, 51.52], [-3.25, 51.42]],
        color: '#22c55e'
      },
      {
        name: 'Swansea',
        coordinates: [[-4.1, 51.55], [-3.85, 51.55], [-3.85, 51.7], [-4.1, 51.7], [-4.1, 51.55]],
        color: '#f43f5e'
      },
      {
        name: 'Newport',
        coordinates: [[-3.1, 51.52], [-2.9, 51.52], [-2.9, 51.65], [-3.1, 51.65], [-3.1, 51.52]],
        color: '#6366f1'
      },
      {
        name: 'Wrexham',
        coordinates: [[-3.15, 52.95], [-2.85, 52.95], [-2.85, 53.1], [-3.15, 53.1], [-3.15, 52.95]],
        color: '#8b5cf6'
      },
      {
        name: 'Gwynedd',
        coordinates: [[-4.5, 52.5], [-3.8, 52.5], [-3.8, 53.1], [-4.5, 53.1], [-4.5, 52.5]],
        color: '#10b981'
      },
      {
        name: 'Powys',
        coordinates: [[-3.8, 51.9], [-3.0, 51.9], [-3.0, 52.7], [-3.8, 52.7], [-3.8, 51.9]],
        color: '#a855f7'
      },
      {
        name: 'Pembrokeshire',
        coordinates: [[-5.3, 51.6], [-4.6, 51.6], [-4.6, 52.1], [-5.3, 52.1], [-5.3, 51.6]],
        color: '#d946ef'
      },
      {
        name: 'Carmarthenshire',
        coordinates: [[-4.6, 51.7], [-3.9, 51.7], [-3.9, 52.2], [-4.6, 52.2], [-4.6, 51.7]],
        color: '#ec4899'
      },
      {
        name: 'Ceredigion',
        coordinates: [[-4.6, 52.1], [-3.7, 52.1], [-3.7, 52.5], [-4.6, 52.5], [-4.6, 52.1]],
        color: '#f97316'
      },
      {
        name: 'North Wales Coast',
        coordinates: [[-4.0, 53.15], [-3.3, 53.15], [-3.3, 53.4], [-4.0, 53.4], [-4.0, 53.15]],
        color: '#0ea5e9'
      },
      {
        name: 'South Wales Valleys',
        coordinates: [[-3.6, 51.55], [-3.2, 51.55], [-3.2, 51.8], [-3.6, 51.8], [-3.6, 51.55]],
        color: '#eab308'
      },
    ];

    regions.forEach((region, index) => {
      mapInstance.addLayer({
        id: `region-${index}`,
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: region.name },
            geometry: {
              type: 'Polygon',
              coordinates: [region.coordinates]
            }
          }
        },
        paint: {
          'fill-color': region.color,
          'fill-opacity': 0.25,
          'fill-outline-color': region.color
        }
      });

      // Add border for each region
      mapInstance.addLayer({
        id: `region-border-${index}`,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: region.name },
            geometry: {
              type: 'Polygon',
              coordinates: [region.coordinates]
            }
          }
        },
        paint: {
          'line-color': region.color,
          'line-width': 2,
          'line-opacity': 0.6
        }
      });
    });
  };

  // Update markers when jobs change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (!showMarkers) return;

    // Filter jobs
    const filteredJobs = filterLevel 
      ? jobs.filter(job => job.entry_level === filterLevel)
      : jobs;

    // Group jobs by city
    const jobsByCity: Record<string, Job[]> = {};
    filteredJobs.forEach(job => {
      if (!jobsByCity[job.city]) {
        jobsByCity[job.city] = [];
      }
      jobsByCity[job.city].push(job);
    });

    // Create markers for each city
    Object.entries(jobsByCity).forEach(([city, cityJobs]) => {
      const coords = cityCoordinates[city];
      if (!coords) return;

      cityJobs.forEach((job, index) => {
        // Offset markers in same city
        const angle = (index * 360) / Math.max(cityJobs.length, 1);
        const radius = 0.01 * Math.min(index, 5);
        const offsetLng = Math.cos(angle * Math.PI / 180) * radius;
        const offsetLat = Math.sin(angle * Math.PI / 180) * radius;

        const levelColors: Record<string, string> = {
          easy: '#22c55e',
          moderate: '#f97316',
          difficult: '#ef4444'
        };

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'job-marker';
        el.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: ${levelColors[job.entry_level]};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 20px ${levelColors[job.entry_level]}80, 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: white;
              border-radius: 50%;
              opacity: 0.9;
            "></div>
          </div>
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
          el.style.zIndex = '100';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.zIndex = '1';
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([coords[0] + offsetLng, coords[1] + offsetLat])
          .addTo(map.current!);

        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          className: 'job-popup'
        }).setHTML(`
          <div style="
            background: #1a1a1a;
            border: 1px solid ${levelColors[job.entry_level]};
            border-radius: 12px;
            padding: 12px 16px;
            min-width: 200px;
            box-shadow: 0 0 30px ${levelColors[job.entry_level]}40;
          ">
            <div style="font-weight: 600; color: white; font-size: 14px; margin-bottom: 4px;">
              ${job.title}
            </div>
            <div style="color: #888; font-size: 12px; margin-bottom: 8px;">
              ${job.company} • ${job.city}
            </div>
            <div style="
              display: inline-block;
              padding: 4px 8px;
              background: ${levelColors[job.entry_level]}20;
              color: ${levelColors[job.entry_level]};
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
            ">
              ${job.entry_level === 'easy' ? '🎯 Easy Entry' : job.entry_level === 'moderate' ? '⚡ Moderate' : '🔥 Competitive'}
            </div>
          </div>
        `);

        el.addEventListener('mouseenter', () => {
          marker.setPopup(popup);
          popup.addTo(map.current!);
        });

        el.addEventListener('mouseleave', () => {
          popup.remove();
        });

        el.addEventListener('click', () => {
          const cityCoord = cityCoordinates[job.city];
          const jobMarker: JobMarker = {
            id: job.id,
            city: job.city,
            x: 0,
            y: 0,
            level: job.entry_level,
            title: job.title,
            company: job.company,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            requirements: job.requirements,
            description: job.description,
            skills: job.skills,
            posted_date: job.posted_date,
            lng: cityCoord?.[0],
            lat: cityCoord?.[1],
          };
          onMarkerClick?.(jobMarker);
        });

        markersRef.current.push(marker);
      });
    });
  }, [jobs, showMarkers, filterLevel, mapLoaded, onMarkerClick]);

  // Map controls
  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleReset = () => {
    map.current?.flyTo({
      center: [-3.5, 52.2],
      zoom: 7,
      pitch: 30,
      bearing: 0,
      duration: 1500
    });
  };

  const handleStyleChange = (style: 'dark' | 'satellite' | 'streets') => {
    if (!map.current) return;
    setMapStyle(style);
    
    const styleUrls: Record<string, string> = {
      dark: 'mapbox://styles/mapbox/dark-v11',
      satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
      streets: 'mapbox://styles/mapbox/streets-v12',
    };
    
    map.current.setStyle(styleUrls[style]);
    
    // Re-add layers after style change
    map.current.once('style.load', () => {
      if (map.current) {
        addWelshRegions(map.current);
      }
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Expanding wave */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-500"
            style={{
              width: `${scanProgress * 10}%`,
              height: `${scanProgress * 10}%`,
              opacity: 1 - (scanProgress / 100),
              boxShadow: '0 0 60px rgba(249, 115, 22, 0.5)',
            }}
          />
          
          {/* Scanning line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            style={{
              top: `${scanProgress}%`,
              boxShadow: '0 0 30px rgba(249, 115, 22, 0.8)',
            }}
          />

          {/* Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse"
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

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full border border-primary/30">
          <span className="text-xs font-mono text-primary">Wales Interactive Map</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-card/90 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomIn className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-card/90 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomOut className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleReset}
          className="w-10 h-10 bg-card/90 backdrop-blur-sm border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <Locate className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* Style Switcher */}
      <div className="absolute top-20 left-4 z-10 flex flex-col gap-1">
        <Button 
          size="sm" 
          variant={mapStyle === 'dark' ? 'default' : 'outline'}
          onClick={() => handleStyleChange('dark')}
          className="text-xs h-8 gap-1"
        >
          <MapIcon className="w-3 h-3" />
          Dark
        </Button>
        <Button 
          size="sm" 
          variant={mapStyle === 'satellite' ? 'default' : 'outline'}
          onClick={() => handleStyleChange('satellite')}
          className="text-xs h-8 gap-1"
        >
          <Layers className="w-3 h-3" />
          Satellite
        </Button>
        <Button 
          size="sm" 
          variant={mapStyle === 'streets' ? 'default' : 'outline'}
          onClick={() => handleStyleChange('streets')}
          className="text-xs h-8 gap-1"
        >
          <MapIcon className="w-3 h-3" />
          Streets
        </Button>
      </div>

      {/* Job count overlay */}
      {showMarkers && !isScanning && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full border border-primary/50 animate-in fade-in slide-in-from-bottom-4 z-10">
          <span className="text-sm font-medium text-primary">
            📡 {filterLevel ? jobs.filter(j => j.entry_level === filterLevel).length : jobs.length} opportunities found across Wales
          </span>
        </div>
      )}

      <style>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .job-marker {
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default InteractiveWalesMap;
