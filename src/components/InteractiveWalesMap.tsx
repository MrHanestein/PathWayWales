import { useEffect, useRef, useState } from 'react';
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
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState<'idle' | 'sweeping' | 'pulsing' | 'complete'>('idle');

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
      minZoom: 5,
      maxZoom: 15,
      pitch: 30,
      bearing: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    
    // Close popups on zoom/pan to prevent misalignment
    map.current.on('zoomstart', () => {
      popupRef.current?.remove();
    });
    
    map.current.on('dragstart', () => {
      popupRef.current?.remove();
    });
    
    map.current.on('load', () => {
      setMapLoaded(true);
      
      if (map.current) {
        // Wales bounding box with subtle highlight
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
                  [-5.5, 51.3], [-2.6, 51.3], [-2.6, 53.5], [-5.5, 53.5], [-5.5, 51.3]
                ]]
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
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      popupRef.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add Welsh regions with colors
  const addWelshRegions = (mapInstance: mapboxgl.Map) => {
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
  };

  // Update markers when jobs change - FIXED to not move to top-left
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers properly
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    popupRef.current?.remove();

    if (!showMarkers) return;

    const filteredJobs = filterLevel 
      ? jobs.filter(job => job.entry_level === filterLevel)
      : jobs;

    // Group jobs by city
    const jobsByCity: Record<string, Job[]> = {};
    filteredJobs.forEach(job => {
      if (!jobsByCity[job.city]) jobsByCity[job.city] = [];
      jobsByCity[job.city].push(job);
    });

    // Create markers for each city
    Object.entries(jobsByCity).forEach(([city, cityJobs]) => {
      const coords = cityCoordinates[city];
      if (!coords) return;

      cityJobs.forEach((job, index) => {
        // Offset markers in same city
        const angle = (index * 360) / Math.max(cityJobs.length, 1);
        const radius = 0.015 * Math.min(index, 5);
        const offsetLng = Math.cos(angle * Math.PI / 180) * radius;
        const offsetLat = Math.sin(angle * Math.PI / 180) * radius;

        const markerLng = coords[0] + offsetLng;
        const markerLat = coords[1] + offsetLat;

        const levelColors: Record<string, string> = {
          easy: '#22c55e',
          moderate: '#f97316',
          difficult: '#ef4444'
        };

        const levelGradients: Record<string, string> = {
          easy: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          moderate: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          difficult: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        };

        // Create futuristic hexagonal marker
        const el = document.createElement('div');
        el.className = 'futuristic-marker';
        el.style.cssText = `
          width: 40px;
          height: 46px;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
          filter: drop-shadow(0 0 12px ${levelColors[job.entry_level]}80);
        `;

        el.innerHTML = `
          <svg viewBox="0 0 40 46" width="40" height="46" style="position: absolute; top: 0; left: 0;">
            <defs>
              <linearGradient id="grad-${job.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${levelColors[job.entry_level]};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${levelColors[job.entry_level]};stop-opacity:0.7" />
              </linearGradient>
              <filter id="glow-${job.id}" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- Outer hexagon -->
            <polygon 
              points="20,2 38,12 38,34 20,44 2,34 2,12" 
              fill="url(#grad-${job.id})" 
              stroke="${levelColors[job.entry_level]}" 
              stroke-width="2"
              filter="url(#glow-${job.id})"
            />
            <!-- Inner hexagon -->
            <polygon 
              points="20,8 32,15 32,31 20,38 8,31 8,15" 
              fill="rgba(0,0,0,0.4)" 
              stroke="${levelColors[job.entry_level]}" 
              stroke-width="1"
              stroke-opacity="0.5"
            />
            <!-- Center dot -->
            <circle cx="20" cy="23" r="5" fill="white" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <!-- Orbiting ring -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            margin-left: -25px;
            margin-top: -25px;
            border: 1px solid ${levelColors[job.entry_level]}40;
            border-radius: 50%;
            animation: marker-orbit 4s linear infinite;
            pointer-events: none;
          "></div>
          <!-- Entry level badge -->
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            background: ${levelColors[job.entry_level]};
            color: white;
            padding: 2px 6px;
            border-radius: 8px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${job.entry_level === 'easy' ? '🎯' : job.entry_level === 'moderate' ? '⚡' : '🔥'}
          </div>
        `;

        // Create the marker with center anchor for stable positioning
        const marker = new mapboxgl.Marker({ 
          element: el, 
          anchor: 'center'
        })
          .setLngLat([markerLng, markerLat])
          .addTo(map.current!);

        // Create popup - FIXED positioning
        const popupContent = `
          <div class="job-popup-content" style="
            background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
            border: 1px solid ${levelColors[job.entry_level]};
            border-radius: 16px;
            padding: 16px 20px;
            min-width: 260px;
            max-width: 320px;
            box-shadow: 0 0 40px ${levelColors[job.entry_level]}30, 0 8px 32px rgba(0,0,0,0.5);
            backdrop-filter: blur(12px);
          ">
            <div style="
              width: 100%;
              height: 4px;
              background: ${levelGradients[job.entry_level]};
              border-radius: 2px;
              margin-bottom: 12px;
            "></div>
            <div style="font-weight: 700; color: white; font-size: 15px; margin-bottom: 6px; line-height: 1.3;">
              ${job.title}
            </div>
            <div style="color: #9ca3af; font-size: 13px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <span style="color: ${levelColors[job.entry_level]};">●</span>
              ${job.company} • ${job.city}
            </div>
            ${job.salary_min || job.salary_max ? `
              <div style="color: #22c55e; font-size: 14px; font-weight: 600; margin-bottom: 10px;">
                💰 £${job.salary_min?.toLocaleString() || '?'} - £${job.salary_max?.toLocaleString() || '?'}
              </div>
            ` : ''}
            ${job.skills && job.skills.length > 0 ? `
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
                ${job.skills.slice(0, 4).map(skill => `
                  <span style="
                    padding: 3px 8px;
                    background: rgba(255,255,255,0.1);
                    color: #d1d5db;
                    border-radius: 6px;
                    font-size: 11px;
                  ">${skill}</span>
                `).join('')}
              </div>
            ` : ''}
            <div style="
              display: inline-block;
              padding: 5px 12px;
              background: ${levelColors[job.entry_level]}20;
              color: ${levelColors[job.entry_level]};
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              border: 1px solid ${levelColors[job.entry_level]}40;
            ">
              ${job.entry_level === 'easy' ? '🎯 Easy Entry' : job.entry_level === 'moderate' ? '⚡ Moderate' : '🔥 Competitive'}
            </div>
            <div style="color: #6b7280; font-size: 11px; margin-top: 10px; text-align: center;">
              Click for full details →
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -30],
          anchor: 'bottom',
          className: 'job-popup',
          maxWidth: 'none'
        }).setHTML(popupContent);

        // Hover events - popup stays at marker location
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.15)';
          el.style.filter = `drop-shadow(0 0 20px ${levelColors[job.entry_level]})`;
          el.style.zIndex = '100';
          
          // Set popup at the marker's coordinates
          popup.setLngLat([markerLng, markerLat]);
          popup.addTo(map.current!);
          popupRef.current = popup;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.filter = `drop-shadow(0 0 12px ${levelColors[job.entry_level]}80)`;
          el.style.zIndex = '1';
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
    
    map.current.once('style.load', () => {
      if (map.current) {
        addWelshRegions(map.current);
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
        .futuristic-marker {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
          will-change: transform;
        }
        @keyframes marker-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InteractiveWalesMap;
