'use client';

import React from 'react';

interface DynamicHeroProps {
  destination: string;
  coverPhoto: string;
  duration: number;
  budget: string;
  weatherTemp: string;
  preferredLanguage: string;
}

export default function DynamicHero({
  destination,
  coverPhoto,
  duration,
  budget,
  weatherTemp,
  preferredLanguage
}: DynamicHeroProps) {
  // Client-side time logic
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full rounded-2xl overflow-hidden relative shadow-sm border border-surface-variant/30 text-left min-h-[220px] md:min-h-[280px]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
      
      {coverPhoto ? (
        <img src={coverPhoto} alt={destination} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
      )}

      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        <span className="text-[10px] font-extrabold text-white uppercase tracking-widest bg-primary px-3 py-1 rounded-full shadow-sm">
          Active Itinerary
        </span>
        <span className="text-[10px] font-extrabold text-white uppercase tracking-widest bg-black/45 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
          INR Currency (₹)
        </span>
      </div>

      {/* Details Container */}
      <div className="absolute bottom-6 left-6 right-6 z-20 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-primary-container tracking-wider uppercase">{duration} Days Trip Workspace</span>
          <h2 className="text-[30px] md:text-[42px] font-black mt-1 font-heading leading-tight drop-shadow-md">{destination}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-primary-container font-extrabold">Est. Budget</div>
            <div className="text-[14px] font-black">{budget}</div>
          </div>
          <div className="w-px h-8 bg-white/25" />
          <div>
            <div className="text-[9px] uppercase tracking-wider text-primary-container font-extrabold">Weather</div>
            <div className="text-[14px] font-black">{weatherTemp}</div>
          </div>
          <div className="w-px h-8 bg-white/25" />
          <div>
            <div className="text-[9px] uppercase tracking-wider text-primary-container font-extrabold">Local Time</div>
            <div className="text-[14px] font-black">{timeString}</div>
          </div>
          <div className="w-px h-8 bg-white/25" />
          <div>
            <div className="text-[9px] uppercase tracking-wider text-primary-container font-extrabold">Language</div>
            <div className="text-[14px] font-black">{preferredLanguage}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
