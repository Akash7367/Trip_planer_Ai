'use client';

import React, { useState } from 'react';

interface DailyTimelineProps {
  itinerary: any[];
}

export default function DailyTimeline({ itinerary }: DailyTimelineProps) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!itinerary || itinerary.length === 0) {
    return <div className="text-[13px] text-on-surface-variant text-center">No day timeline available</div>;
  }

  const currentDay = itinerary[activeDayIdx];

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/20 pb-4">
        <div>
          <h4 className="font-extrabold text-[15px] text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
            Day Timeline
          </h4>
          <p className="text-[11.5px] text-on-surface-variant mt-0.5">Explore chronological pacing slots per day.</p>
        </div>

        {/* Day selection tabs */}
        <div className="flex gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {itinerary.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDayIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all border-none ${
                activeDayIdx === idx
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Day {day.day || idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Day Schedule Detail Card */}
      <div className="space-y-4">
        <h3 className="text-[15.5px] font-bold text-on-surface">
          {currentDay.title || `Schedule for Day ${currentDay.day}`}
        </h3>

        {/* Timeline Slots */}
        <div className="space-y-4 pl-4 border-l-2 border-primary/20 relative">
          
          {/* Morning */}
          <div className="relative">
            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary">Morning</span>
              <p className="text-[13px] leading-relaxed text-on-surface-variant mt-1 font-medium">{currentDay.morning}</p>
            </div>
          </div>

          {/* Afternoon */}
          <div className="relative">
            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary">Afternoon</span>
              <p className="text-[13px] leading-relaxed text-on-surface-variant mt-1 font-medium">{currentDay.afternoon}</p>
            </div>
          </div>

          {/* Evening */}
          <div className="relative">
            <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary">Evening & Vlog Insight</span>
              <p className="text-[13px] leading-relaxed text-on-surface-variant mt-1 font-medium">{currentDay.evening}</p>
              {currentDay.why_selected_rationale && (
                <div className="mt-2 p-2.5 rounded-lg bg-surface-container border border-surface-variant/20 flex items-start gap-1.5 italic text-[11px] text-primary">
                  <span className="material-symbols-outlined text-[15px] mt-0.5">psychology</span>
                  <span>{currentDay.why_selected_rationale}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
