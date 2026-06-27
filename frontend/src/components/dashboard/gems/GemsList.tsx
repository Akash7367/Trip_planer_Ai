'use client';

import React from 'react';

export interface HiddenGem {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  whySpecial: string;
  image: string;
  cost: string;
  timeNeeded: string;
  badge: 'Underrated' | 'Local Favorite' | 'Trending';
}

interface GemsListProps {
  gems: HiddenGem[];
  onSelectGem?: (name: string) => void;
}

export default function GemsList({ gems, onSelectGem }: GemsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {gems.map(gem => (
        <div
          key={gem.id}
          className="bg-surface border border-surface-variant/30 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
        >
          {/* Card Hero Image */}
          <div className="h-[140px] relative bg-neutral-900">
            <img
              src={gem.image}
              alt={gem.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-primary text-on-primary text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow">
              {gem.badge}
            </span>
            <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
              👥 Crowd: {gem.crowdLevel}
            </span>
          </div>

          {/* Card Details Body */}
          <div className="p-4.5 space-y-3 flex-grow flex flex-col justify-between">
            <div className="space-y-1">
              <h5 className="font-extrabold text-[14px] text-on-surface leading-snug">
                {gem.name}
              </h5>
              <span className="text-[10px] font-bold text-primary uppercase block tracking-wider">
                {gem.category} • 📍 {gem.location}
              </span>
              <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
                {gem.description}
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-xl text-[11px] text-on-surface font-medium leading-normal">
              💡 <strong>Insider Tip:</strong> {gem.whySpecial}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-surface-variant/10 text-[11px] text-on-surface-variant font-bold">
              <span>Cost: <span className="text-primary">{gem.cost}</span></span>
              <span>Time: {gem.timeNeeded}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
