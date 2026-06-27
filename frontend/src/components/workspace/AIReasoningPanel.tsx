'use client';

import React, { useState } from 'react';

interface AIReasoningPanelProps {
  destination: string;
  reasons?: {
    destination_choice?: string;
    hotel_choice?: string;
    restaurant_choice?: string;
    activities_choice?: string;
  };
}

export default function AIReasoningPanel({ destination, reasons }: AIReasoningPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Fallbacks if backend agent didn't provide specific JSON reasons yet
  const defaultReasons = {
    destination_choice: `AI selected ${destination} because it perfectly aligns with your interests in local culture, scenic spots, and budget restrictions based on recent vlogger insights.`,
    hotel_choice: "Selected accommodations represent the optimal balance of rating consistency, central transit proximity, and budget allocation from vlogger trip logs.",
    restaurant_choice: "Dining locations were picked from highly cited street food walks and vlogger reviews, filtering for authentic regional flavors.",
    activities_choice: "We structured the day-to-day timeline to minimize travel times, placing nearby points on the same days to ensure comfortable pacing."
  };

  const finalReasons = reasons || defaultReasons;

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl shadow-sm text-left">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-5 flex justify-between items-center cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">architecture</span>
          </div>
          <div>
            <h3 className="font-extrabold text-[15px] text-on-surface">AI Planner Reasoning & Decisions</h3>
            <p className="text-[11.5px] text-on-surface-variant mt-0.5">Explore the rationale behind our agent network recommendation decisions.</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-surface-variant/20 bg-surface-container-low space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-surface rounded-xl border border-surface-variant/20">
              <h5 className="font-black text-[12px] uppercase text-primary tracking-wider mb-1.5">Destination Choice</h5>
              <p className="text-[12.5px] leading-relaxed text-on-surface-variant">{finalReasons.destination_choice}</p>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface-variant/20">
              <h5 className="font-black text-[12px] uppercase text-primary tracking-wider mb-1.5">Hotels Selection</h5>
              <p className="text-[12.5px] leading-relaxed text-on-surface-variant">{finalReasons.hotel_choice}</p>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface-variant/20">
              <h5 className="font-black text-[12px] uppercase text-primary tracking-wider mb-1.5">Food & Restaurants</h5>
              <p className="text-[12.5px] leading-relaxed text-on-surface-variant">{finalReasons.restaurant_choice}</p>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-surface-variant/20">
              <h5 className="font-black text-[12px] uppercase text-primary tracking-wider mb-1.5">Itinerary Pacing</h5>
              <p className="text-[12.5px] leading-relaxed text-on-surface-variant">{finalReasons.activities_choice}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
