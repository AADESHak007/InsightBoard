'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression, PathOptions, Layer } from 'leaflet';
import { Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

interface BoroughMapProps {
  metric: string;
  data: Record<string, number>;
}

export default function BoroughMap({ metric, data }: BoroughMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // NYC center coordinates
  const center: LatLngExpression = [40.7128, -74.0060];
  const zoom = 10;

  useEffect(() => {
    setIsClient(true);
    // Load GeoJSON data
    fetch('/data/nyc-boroughs.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Error loading GeoJSON:', err));
  }, []);

  // Calculate color based on value
  const getColor = (value: number, min: number, max: number): string => {
    if (max === min) return '#3b82f6'; // Default blue if no variation
    
    const normalized = (value - min) / (max - min);
    
    // Color scale from light blue to dark blue
    if (normalized < 0.2) return '#dbeafe';
    if (normalized < 0.4) return '#93c5fd';
    if (normalized < 0.6) return '#60a5fa';
    if (normalized < 0.8) return '#3b82f6';
    return '#1e40af';
  };

  // Get min and max values for color scaling
  const values = Object.values(data);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Style function for GeoJSON features
  const style = (feature?: Feature<Geometry>): PathOptions => {
    if (!feature || !feature.properties) {
      return {
        fillColor: '#3b82f6',
        weight: 2,
        opacity: 1,
        color: '#1f2937',
        fillOpacity: 0.7,
      };
    }
    
    const boroughName = feature.properties.name;
    const value = data[boroughName] || 0;
    
    return {
      fillColor: getColor(value, minValue, maxValue),
      weight: 2,
      opacity: 1,
      color: '#1f2937',
      fillOpacity: 0.7,
    };
  };

  // Event handlers
  const onEachFeature = (feature: Feature<Geometry>, layer: Layer) => {
    if (!feature.properties) return;
    const boroughName = feature.properties.name;
    const value = data[boroughName] || 0;

    // Check if layer has bindTooltip method
    if ('bindTooltip' in layer && typeof layer.bindTooltip === 'function') {
      layer.bindTooltip(
        `<div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
           <div class="font-bold text-lg mb-1">${boroughName}</div>
           <div class="text-cyan-400 font-semibold">${value.toLocaleString()}</div>
           <div class="text-xs text-gray-400">${metric}</div>
         </div>`,
        {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip'
        }
      );
    }

    // Check if layer has bindPopup method
    if ('bindPopup' in layer && typeof layer.bindPopup === 'function') {
      layer.bindPopup(
        `<div class="bg-gray-900 text-white p-4 rounded-xl shadow-xl border border-gray-700 min-w-[200px]">
           <div class="flex items-center justify-between mb-3">
             <h3 class="font-bold text-xl">${boroughName}</h3>
             <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
           </div>
           <div class="space-y-2">
             <div class="flex justify-between items-center">
               <span class="text-gray-400">${metric}:</span>
               <span class="text-cyan-400 font-bold text-lg">${value.toLocaleString()}</span>
             </div>
             <div class="w-full bg-gray-700 rounded-full h-2 mt-3">
               <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                    style="width: ${maxValue > 0 ? (value / maxValue) * 100 : 0}%"></div>
             </div>
             <div class="text-xs text-gray-500 text-center mt-2">
               ${maxValue > 0 ? ((value / maxValue) * 100).toFixed(1) : 0}% of highest value
             </div>
           </div>
         </div>`
      );
    }

    // Hover effects
    if ('on' in layer && typeof layer.on === 'function' && 'setStyle' in layer) {
      layer.on({
        mouseover: (e) => {
          const hoverLayer = e.target;
          if ('setStyle' in hoverLayer && typeof hoverLayer.setStyle === 'function') {
            hoverLayer.setStyle({
              weight: 4,
              color: '#ffffff',
              fillOpacity: 0.9,
              dashArray: '5, 5',
            });
          }
        },
        mouseout: (e) => {
          const outLayer = e.target;
          if ('setStyle' in outLayer && typeof outLayer.setStyle === 'function') {
            outLayer.setStyle({
              weight: 2,
              color: '#1f2937',
              fillOpacity: 0.7,
              dashArray: null,
            });
          }
        },
      });
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading borough data...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
