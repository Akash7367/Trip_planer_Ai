'use client';

import React from 'react';

interface Badge {
  name: string;
  icon: string;
  desc: string;
}

export default function UserProfileCard() {
  const badges: Badge[] = [
    { name: 'Sea Wanderer', icon: 'sailing', desc: 'Visited 5 beach destinations' },
    { name: 'Culture Scout', icon: 'museum', desc: 'Booked 4 museum/temple entries' },
    { name: 'Local Foodie', icon: 'restaurant', desc: 'Explored 3 hidden street stalls' }
  ];

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-5 text-left shadow-sm">
      
      {/* Bio section */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[22px] border border-primary/20 shrink-0">
          AT
        </div>
        <div>
          <h4 className="font-extrabold text-[15px] text-on-surface">Akash Travelogue</h4>
          <span className="text-[11px] text-on-surface-variant font-bold block">Explorer Level 5 • India</span>
        </div>
      </div>

      {/* Preferences section */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Travel Preferences</span>
        <div className="flex flex-wrap gap-2 text-[10.5px] font-bold">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Moderate Budget</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Adventure Level: High</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Food: Veg Friendly</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Walking: Max 5km/day</span>
        </div>
      </div>

      {/* Visited counters */}
      <div className="grid grid-cols-3 gap-3 text-center bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/10 text-[12px] font-bold">
        <div>
          <span className="text-[10px] text-on-surface-variant block uppercase">Countries</span>
          <span className="text-on-surface text-[15px] font-black">4</span>
        </div>
        <div>
          <span className="text-[10px] text-on-surface-variant block uppercase">Cities</span>
          <span className="text-on-surface text-[15px] font-black">18</span>
        </div>
        <div>
          <span className="text-[10px] text-on-surface-variant block uppercase">Explored Gems</span>
          <span className="text-emerald-600 text-[15px] font-black">9</span>
        </div>
      </div>

      {/* Badges */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Achievements</span>
        <div className="space-y-2">
          {badges.map((b, idx) => (
            <div key={idx} className="flex gap-2.5 items-center text-[12px] text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-[20px] bg-primary/5 p-1 rounded-lg border border-primary/25">{b.icon}</span>
              <div>
                <strong className="text-on-surface block font-bold leading-none">{b.name}</strong>
                <span className="text-[10px] text-on-surface-variant">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
