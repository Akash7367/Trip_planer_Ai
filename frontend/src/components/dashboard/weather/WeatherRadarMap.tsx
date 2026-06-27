'use client';

import React, { useState } from 'react';

interface WeatherRadarMapProps {
  destinationName: string;
}

export default function WeatherRadarMap({ destinationName }: WeatherRadarMapProps) {
  const [mapType, setMapType] = useState<'rain' | 'cloud' | 'aqi'>('rain');

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h4 className="text-[14.5px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
          Simulated Weather Radar & Storm Tracker
        </h4>
        <div className="flex bg-surface-container p-0.5 rounded-lg text-[10px] font-bold">
          <button
            onClick={() => setMapType('rain')}
            className={`px-2.5 py-1 rounded cursor-pointer ${mapType === 'rain' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            Rain Radar
          </button>
          <button
            onClick={() => setMapType('cloud')}
            className={`px-2.5 py-1 rounded cursor-pointer ${mapType === 'cloud' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            Cloud Map
          </button>
          <button
            onClick={() => setMapType('aqi')}
            className={`px-2.5 py-1 rounded cursor-pointer ${mapType === 'aqi' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
          >
            AQI Heat
          </button>
        </div>
      </div>

      {/* Radar Map Simulation Frame */}
      <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-surface-variant/20 shadow-inner">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

        {/* Circular Radar Scan Lines */}
        <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/20 animate-pulse flex items-center justify-center">
          <div className="w-[100px] h-[100px] rounded-full border border-primary/10"></div>
        </div>

        {/* Dynamic Map Layers (SVG) */}
        <svg className="w-full h-full absolute inset-0 z-10">
          {mapType === 'rain' && (
            <>
              {/* Rain clouds shapes */}
              <circle cx="120" cy="90" r="40" className="fill-blue-500/30 animate-pulse" />
              <circle cx="140" cy="80" r="30" className="fill-blue-500/20" />
              <path d="M120 130 L110 150 M130 130 L120 150 M140 120 L130 140" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" className="animate-bounce" />
            </>
          )}

          {mapType === 'cloud' && (
            <>
              <circle cx="160" cy="110" r="60" className="fill-white/10" />
              <circle cx="200" cy="90" r="45" className="fill-white/15" />
            </>
          )}

          {mapType === 'aqi' && (
            <>
              {/* Heat zones */}
              <circle cx="180" cy="100" r="80" className="fill-emerald-500/10" />
              <circle cx="120" cy="110" r="30" className="fill-amber-500/20" />
            </>
          )}
        </svg>

        {/* Overlay Labels */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10.5px] font-bold px-2 py-0.5 rounded backdrop-blur-sm z-20 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Station: {destinationName} • Live Radar Map</span>
        </div>
      </div>
    </div>
  );
}
