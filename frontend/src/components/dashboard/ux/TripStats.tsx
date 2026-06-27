'use client';

import React from 'react';

export default function TripStats() {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
        Travel Statistics & Explorer Scores
      </h4>

      {/* Stats progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-[12px] font-bold">
          <span className="text-on-surface-variant">Explorer Progress: Level 5</span>
          <span className="text-primary font-black">2,450 / 3,000 XP</span>
        </div>
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: '80%' }}></div>
        </div>
      </div>

      {/* Gamified counters grid */}
      <div className="grid grid-cols-2 gap-3 text-center text-[12px] font-bold">
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/10">
          <span className="text-[10px] text-on-surface-variant block uppercase">Flights Taken</span>
          <span className="text-on-surface text-[15px] font-black">12</span>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/10">
          <span className="text-[10px] text-on-surface-variant block uppercase">Hotels Stayed</span>
          <span className="text-on-surface text-[15px] font-black">8</span>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/10 col-span-2">
          <span className="text-[10px] text-on-surface-variant block uppercase">Current Travel Streak</span>
          <span className="text-primary text-[15px] font-black">🔥 3 Active Trips Streak</span>
        </div>
      </div>
    </div>
  );
}
