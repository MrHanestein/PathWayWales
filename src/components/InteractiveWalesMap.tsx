import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import type { Job } from '@/hooks/useJobs';
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
  url?: string | null;
}

interface InteractiveWalesMapProps {
  isScanning?: boolean;
  showMarkers?: boolean;
  filterLevel?: "easy" | "moderate" | "difficult" | null;
  onMarkerClick?: (marker: JobMarker) => void;
  jobs?: Job[];
}

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

// Colors for entry levels
const LEVEL_COLORS = {
  easy: '#22c55e',
  moderate: '#f97316',
  difficult: '#ef4444'
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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState<'idle' | 'sweeping' | 'pulsing' | 'complete'>('idle');

  // Helper to get job coordinates with offset for overlapping
  const getJobCoordinates = useCallback((job: Job, allJobs: Job[]): [number, number] => {
    // Use job's stored lat/lng if available
    if (job.lat !== null && job.lng !== null && job.lat !== undefined && job.lng !== undefined) {
      // Still apply small offset for jobs with same exact coordinates
      const sameCoordJobs = allJobs.filter(j => 
        j.lat === job.lat && j.lng === job.lng
      );
      if (sameCoordJobs.length > 1) {
        const index = sameCoordJobs.findIndex(j => j.id === job.id);
        const angle = (index * 360) / sameCoordJobs.length;
        const radius = 0.008;
        return [
          Number(job.lng) + Math.cos(angle * Math.PI / 180) * radius,
          Number(job.lat) + Math.sin(angle * Math.PI / 180) * radius
        ];
      }
      return [Number(job.lng), Number(job.lat)];
    }

    // Fallback to city coordinates
    const coords = cityCoordinates[job.city];
    if (!coords) return [-3.5, 52.2]; // Wales center fallback

    const cityJobs = allJobs.filter(j => j.city === job.city);
    if (cityJobs.length > 1) {
      const index = cityJobs.findIndex(j => j.id === job.id);
      const angle = (index * 360) / cityJobs.length;
      const radius = 0.008 * Math.min(index + 1, 5);
      return [
        coords[0] + Math.cos(angle * Math.PI / 180) * radius,
        coords[1] + Math.sin(angle * Math.PI / 180) * radius
      ];
    }
    return coords;
  }, []);

  // Enhanced scanning animation with phases
  useEffect(() => {
    if (isScanning) {
      setScanProgress(0);
      setScanPhase('sweeping');
      
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanPhase('complete');
            setTimeout(() => setScanPhase('idle'), 800);
            return 100;
          }
          if (prev >= 75) {
            setScanPhase('pulsing');
          }
          return prev + 1.5;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
      setScanPhase('idle');
    }
  }, [isScanning]);

  // Add Welsh regions with colors
  const addWelshRegions = useCallback((mapInstance: mapboxgl.Map) => {
    const regions = [
      { name: 'Cardiff', coordinates: [[-3.25, 51.42], [-3.1, 51.42], [-3.1, 51.52], [-3.25, 51.52], [-3.25, 51.42]], color: '#22c55e' },
      { name: 'Swansea', coordinates: [[-4.1, 51.55], [-3.85, 51.55], [-3.85, 51.7], [-4.1, 51.7], [-4.1, 51.55]], color: '#f43f5e' },
      { name: 'Newport', coordinates: [[-3.1, 51.52], [-2.9, 51.52], [-2.9, 51.65], [-3.1, 51.65], [-3.1, 51.52]], color: '#6366f1' },
      { name: 'Wrexham', coordinates: [[-3.15, 52.95], [-2.85, 52.95], [-2.85, 53.1], [-3.15, 53.1], [-3.15, 52.95]], color: '#8b5cf6' },
      { name: 'Gwynedd', coordinates: [[-4.5, 52.5], [-3.8, 52.5], [-3.8, 53.1], [-4.5, 53.1], [-4.5, 52.5]], color: '#10b981' },
      { name: 'Powys', coordinates: [[-3.8, 51.9], [-3.0, 51.9], [-3.0, 52.7], [-3.8, 52.7], [-3.8, 51.9]], color: '#a855f7' },
      { name: 'Pembrokeshire', coordinates: [[-5.3, 51.6], [-4.6, 51.6], [-4.6, 52.1], [-5.3, 52.1], [-5.3, 51.6]], color: '#d946ef' },
      { name: 'Carmarthenshire', coordinates: [[-4.6, 51.7], [-3.9, 51.7], [-3.9, 52.2], [-4.6, 52.2], [-4.6, 51.7]], color: '#ec4899' },
      { name: 'Ceredigion', coordinates: [[-4.6, 52.1], [-3.7, 52.1], [-3.7, 52.5], [-4.6, 52.5], [-4.6, 52.1]], color: '#f97316' },
      { name: 'North Wales Coast', coordinates: [[-4.0, 53.15], [-3.3, 53.15], [-3.3, 53.4], [-4.0, 53.4], [-4.0, 53.15]], color: '#0ea5e9' },
      { name: 'South Wales Valleys', coordinates: [[-3.6, 51.55], [-3.2, 51.55], [-3.2, 51.8], [-3.6, 51.8], [-3.6, 51.55]], color: '#eab308' },
    ];

    regions.forEach((region, index) => {
      if (mapInstance.getLayer(`region-${index}`)) return; // Already added
      
      mapInstance.addLayer({
        id: `region-${index}`,
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: region.name },
            geometry: { type: 'Polygon', coordinates: [region.coordinates] }
          }
        },
        paint: {
          'fill-color': region.color,
          'fill-opacity': 0.2,
          'fill-outline-color': region.color
        }
      });

      mapInstance.addLayer({
        id: `region-border-${index}`,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: { name: region.name },
            geometry: { type: 'Polygon', coordinates: [region.coordinates] }
          }
        },
        paint: {
          'line-color': region.color,
          'line-width': 2,
          'line-opacity': 0.6
        }
      });
    });
  }, []);

  // Add GeoJSON source and layers for jobs
  const addJobLayers = useCallback((mapInstance: mapboxgl.Map) => {
    // Add GeoJSON source for jobs if not exists
    if (!mapInstance.getSource('jobs-source')) {
      mapInstance.addSource('jobs-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
    }

    // Add circle layers for each entry level
    const levels: Array<'easy' | 'moderate' | 'difficult'> = ['easy', 'moderate', 'difficult'];
    
    levels.forEach(level => {
      const layerId = `jobs-${level}`;
      if (mapInstance.getLayer(layerId)) return;

      mapInstance.addLayer({
        id: layerId,
        type: 'circle',
        source: 'jobs-source',
        filter: ['==', ['get', 'entry_level'], level],
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            6, 8,
            10, 12,
            14, 16
          ],
          'circle-color': LEVEL_COLORS[level],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
          'circle-stroke-opacity': 0.8
        }
      });

      // Add outer glow layer
      const glowLayerId = `jobs-${level}-glow`;
      if (!mapInstance.getLayer(glowLayerId)) {
        mapInstance.addLayer({
          id: glowLayerId,
          type: 'circle',
          source: 'jobs-source',
          filter: ['==', ['get', 'entry_level'], level],
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              6, 14,
              10, 20,
              14, 26
            ],
            'circle-color': LEVEL_COLORS[level],
            'circle-opacity': 0.25,
            'circle-blur': 1
          }
        }, layerId); // Insert below main layer
      }
    });
  }, []);

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
      center: [-3.5, 52.2],
      zoom: 7,
      minZoom: 6,
      maxZoom: 15,
      pitch: 30,
      bearing: 0,
      maxBounds: [[-7, 50], [0, 55]],
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    
    // Close popups on zoom/pan
    map.current.on('zoomstart', () => popupRef.current?.remove());
    map.current.on('dragstart', () => popupRef.current?.remove());
    
    map.current.on('load', () => {
      setMapLoaded(true);
      
      if (map.current) {
        // Wales highlight
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
                coordinates: [[[-5.5, 51.3], [-2.6, 51.3], [-2.6, 53.5], [-5.5, 53.5], [-5.5, 51.3]]]
              }
            }
          },
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.05
          }
        });

        // Wales border glow
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
                  [-5.3, 51.35], [-5.45, 51.7], [-5.3, 52.0], [-5.1, 52.3],
                  [-4.8, 52.6], [-4.1, 52.9], [-4.2, 53.2], [-4.0, 53.4],
                  [-3.5, 53.35], [-3.0, 53.25], [-2.75, 53.1], [-2.95, 52.8],
                  [-3.0, 52.5], [-2.95, 52.2], [-2.7, 51.85], [-2.65, 51.55],
                  [-2.95, 51.38], [-3.4, 51.35], [-4.0, 51.4], [-4.5, 51.45],
                  [-5.0, 51.45], [-5.3, 51.35]
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

        addWelshRegions(map.current);
        addJobLayers(map.current);
      }
    });

    return () => {
      popupRef.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, [addWelshRegions, addJobLayers]);

  // Update GeoJSON source when jobs/filter changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const source = map.current.getSource('jobs-source') as mapboxgl.GeoJSONSource;
    if (!source) {
      // Source not ready yet, add layers
      addJobLayers(map.current);
      return;
    }

    const filteredJobs = filterLevel 
      ? jobs.filter(job => job.entry_level === filterLevel)
      : jobs;

    const features = showMarkers ? filteredJobs.map(job => {
      const [lng, lat] = getJobCoordinates(job, jobs);
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat]
        },
        properties: {
          id: job.id,
          title: job.title,
          company: job.company,
          city: job.city,
          entry_level: job.entry_level,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          requirements: JSON.stringify(job.requirements || []),
          skills: JSON.stringify(job.skills || []),
          description: job.description,
          posted_date: job.posted_date,
          url: job.url,
          lng,
          lat
        }
      };
    }) : [];

    source.setData({
      type: 'FeatureCollection',
      features
    });
  }, [jobs, showMarkers, filterLevel, mapLoaded, getJobCoordinates, addJobLayers]);

  // Add click and hover handlers for job layers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const levels: Array<'easy' | 'moderate' | 'difficult'> = ['easy', 'moderate', 'difficult'];
    
    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      const feature = e.features?.[0];
      if (!feature || !feature.properties) return;

      const props = feature.properties;
      const coords = (feature.geometry as GeoJSON.Point).coordinates;

      // Zoom to location first
      map.current?.flyTo({
        center: coords as [number, number],
        zoom: 12,
        pitch: 40,
        duration: 800
      });

      // Create JobMarker from feature properties
      const jobMarker: JobMarker = {
        id: props.id,
        city: props.city,
        x: 0,
        y: 0,
        level: props.entry_level as 'easy' | 'moderate' | 'difficult',
        title: props.title,
        company: props.company,
        salary_min: props.salary_min,
        salary_max: props.salary_max,
        requirements: props.requirements ? JSON.parse(props.requirements) : [],
        skills: props.skills ? JSON.parse(props.skills) : [],
        description: props.description,
        posted_date: props.posted_date,
        lng: props.lng,
        lat: props.lat,
        url: props.url
      };

      // Slight delay to let zoom complete
      setTimeout(() => {
        onMarkerClick?.(jobMarker);
      }, 400);
    };

    const handleMouseEnter = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = 'pointer';

      const feature = e.features?.[0];
      if (!feature || !feature.properties) return;

      const props = feature.properties;
      const coords = (feature.geometry as GeoJSON.Point).coordinates;
      const levelColor = LEVEL_COLORS[props.entry_level as keyof typeof LEVEL_COLORS] || '#22c55e';

      const salaryText = props.salary_min || props.salary_max 
        ? `💰 £${props.salary_min?.toLocaleString() || '?'} - £${props.salary_max?.toLocaleString() || '?'}`
        : '';

      const popupContent = `
        <div style="
          background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
          border: 1px solid ${levelColor};
          border-radius: 16px;
          padding: 16px 20px;
          min-width: 240px;
          max-width: 300px;
          box-shadow: 0 0 40px ${levelColor}30, 0 8px 32px rgba(0,0,0,0.5);
        ">
          <div style="width: 100%; height: 4px; background: ${levelColor}; border-radius: 2px; margin-bottom: 12px;"></div>
          <div style="font-weight: 700; color: white; font-size: 15px; margin-bottom: 6px; line-height: 1.3;">
            ${props.title}
          </div>
          <div style="color: #9ca3af; font-size: 13px; margin-bottom: 10px;">
            <span style="color: ${levelColor};">●</span> ${props.company} • ${props.city}
          </div>
          ${salaryText ? `<div style="color: #22c55e; font-size: 14px; font-weight: 600; margin-bottom: 10px;">${salaryText}</div>` : ''}
          <div style="
            display: inline-block;
            padding: 5px 12px;
            background: ${levelColor}20;
            color: ${levelColor};
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid ${levelColor}40;
          ">
            ${props.entry_level === 'easy' ? '🎯 Easy Entry' : props.entry_level === 'moderate' ? '⚡ Moderate' : '🔥 Competitive'}
          </div>
          <div style="color: #6b7280; font-size: 11px; margin-top: 10px; text-align: center;">
            Click to zoom & view details →
          </div>
        </div>
      `;

      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -15],
        anchor: 'bottom',
        className: 'job-popup',
        maxWidth: 'none'
      })
        .setLngLat(coords as [number, number])
        .setHTML(popupContent)
        .addTo(map.current);
    };

    const handleMouseLeave = () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = '';
      popupRef.current?.remove();
    };

    // Add handlers for each layer
    levels.forEach(level => {
      const layerId = `jobs-${level}`;
      
      if (map.current?.getLayer(layerId)) {
        map.current.on('click', layerId, handleClick);
        map.current.on('mouseenter', layerId, handleMouseEnter);
        map.current.on('mouseleave', layerId, handleMouseLeave);
      }
    });

    return () => {
      levels.forEach(level => {
        const layerId = `jobs-${level}`;
        if (map.current?.getLayer(layerId)) {
          map.current.off('click', layerId, handleClick);
          map.current.off('mouseenter', layerId, handleMouseEnter);
          map.current.off('mouseleave', layerId, handleMouseLeave);
        }
      });
    };
  }, [mapLoaded, onMarkerClick]);

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
    
    map.current.once('style.load', () => {
      if (map.current) {
        addWelshRegions(map.current);
        addJobLayers(map.current);
        // Re-trigger data update
        setMapLoaded(false);
        setTimeout(() => setMapLoaded(true), 100);
      }
    });
  };

  // Generate random particles for burst effect
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const distance = 40 + Math.random() * 60;
    return {
      angle,
      distance,
      delay: Math.random() * 0.5,
      size: 3 + Math.random() * 4,
    };
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Enhanced Cyber Scan Animation */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radar sweep - rotating beam */}
          <div 
            className="absolute left-1/2 top-1/2 w-[200%] h-1 origin-left"
            style={{
              transform: `translate(-50%, -50%) rotate(${scanProgress * 3.6}deg)`,
              background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.9) 0%, rgba(249, 115, 22, 0.4) 30%, transparent 100%)',
              boxShadow: '0 0 30px rgba(249, 115, 22, 0.8), 0 0 60px rgba(249, 115, 22, 0.4)',
            }}
          />

          {/* Concentric expanding rings */}
          {[0, 1, 2, 3].map((ringIndex) => (
            <div
              key={ringIndex}
              className="absolute left-1/2 top-1/2 rounded-full border-2 border-orange-500"
              style={{
                width: `${(scanProgress * 8) - (ringIndex * 80)}px`,
                height: `${(scanProgress * 8) - (ringIndex * 80)}px`,
                transform: 'translate(-50%, -50%)',
                opacity: Math.max(0, 1 - (scanProgress / 100) - (ringIndex * 0.15)),
                boxShadow: `0 0 20px rgba(249, 115, 22, ${0.5 - ringIndex * 0.1}), inset 0 0 20px rgba(249, 115, 22, ${0.2 - ringIndex * 0.05})`,
                display: (scanProgress * 8) - (ringIndex * 80) > 0 ? 'block' : 'none',
              }}
            />
          ))}

          {/* Particle burst effect */}
          {scanPhase === 'pulsing' && particles.map((particle, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full bg-orange-400"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                transform: `translate(-50%, -50%) translate(
                  ${Math.cos(particle.angle * Math.PI / 180) * particle.distance * ((scanProgress - 75) / 25)}px,
                  ${Math.sin(particle.angle * Math.PI / 180) * particle.distance * ((scanProgress - 75) / 25)}px
                )`,
                opacity: 1 - ((scanProgress - 75) / 25),
                boxShadow: `0 0 ${particle.size * 2}px rgba(249, 115, 22, 0.8)`,
                transition: 'transform 0.1s linear',
              }}
            />
          ))}

          {/* Horizontal scan line with glow */}
          <div 
            className="absolute left-0 right-0 h-1"
            style={{
              top: `${scanProgress}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.3) 10%, rgba(249, 115, 22, 1) 50%, rgba(249, 115, 22, 0.3) 90%, transparent 100%)',
              boxShadow: '0 0 40px rgba(249, 115, 22, 0.9), 0 0 80px rgba(249, 115, 22, 0.5)',
            }}
          >
            <div 
              className="absolute -top-8 left-0 right-0 h-16"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(249, 115, 22, 0.15), transparent)',
              }}
            />
          </div>

          {/* Grid overlay that lights up */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: `radial-gradient(circle at 50% 50%, black ${scanProgress}%, transparent ${scanProgress + 20}%)`,
              WebkitMaskImage: `radial-gradient(circle at 50% 50%, black ${scanProgress}%, transparent ${scanProgress + 20}%)`,
            }}
          />

          {/* Progress counter */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="font-mono text-orange-500 text-4xl font-bold tracking-wider animate-pulse">
              {Math.round(scanProgress)}%
            </div>
            <div className="font-mono text-orange-400/80 text-sm tracking-widest mt-2 uppercase">
              {scanPhase === 'sweeping' ? 'Scanning Wales...' : scanPhase === 'pulsing' ? 'Analyzing Data...' : 'Complete'}
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-orange-500/60" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-orange-500/60" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-orange-500/60" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-orange-500/60" />
        </div>
      )}

      {/* Signal flash when complete */}
      {scanPhase === 'complete' && showMarkers && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-orange-500/20 animate-pulse" style={{ animationDuration: '0.3s' }} />
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="glass-panel px-3 py-1.5 rounded-full">
          <span className="text-xs font-mono text-primary">🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales Interactive Map</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomIn}
          className="w-10 h-10 glass-panel border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomIn className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleZoomOut}
          className="w-10 h-10 glass-panel border-primary/30 hover:border-primary hover:bg-primary/20"
        >
          <ZoomOut className="w-5 h-5 text-primary" />
        </Button>
        <Button 
          size="icon" 
          variant="outline"
          onClick={handleReset}
          className="w-10 h-10 glass-panel border-primary/30 hover:border-primary hover:bg-primary/20"
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
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 glass-panel rounded-full border border-primary/50 animate-in fade-in slide-in-from-bottom-4 z-10">
          <span className="text-sm font-medium text-primary">
            📡 {filterLevel ? jobs.filter(j => j.entry_level === filterLevel).length : jobs.length} opportunities found across Wales
          </span>
        </div>
      )}

      <style>{`
        .mapboxgl-popup {
          z-index: 50 !important;
        }
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 16px !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .mapboxgl-ctrl-group {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default InteractiveWalesMap;
