'use client';

import React, { useState } from 'react';

interface QuerySummaryBarProps {
  originalQuery: string;
  tripSummary?: any;
  onEditQuery?: () => void;
  onRegenerate?: () => void;
}

export default function QuerySummaryBar({
  originalQuery,
  tripSummary,
  onEditQuery,
  onRegenerate
}: QuerySummaryBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Clean or parse original query into display parameters
  const getParam = (key: string, fallback: string) => {
    return tripSummary?.[key] || fallback;
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl shadow-sm overflow-hidden text-left transition-all">
      {/* Mini Bar View */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div>
            <h4 className="text-[12px] font-black text-on-surface-variant uppercase tracking-wider">What You Asked (Original Query)</h4>
            <p className="text-[14px] text-on-surface font-medium line-clamp-1 italic mt-0.5">
              "{originalQuery || tripSummary?.query || 'Plan a trip'}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold border border-outline hover:bg-surface-container-low transition-all cursor-pointer flex items-center gap-1 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
            {isExpanded ? 'Hide Specs' : 'View Specs'}
          </button>
          
          {onEditQuery && (
            <button
              onClick={onEditQuery}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-primary text-on-primary hover:bg-opacity-95 transition-all cursor-pointer flex items-center gap-1 border-none"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit Specs
            </button>
          )}

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-secondary-container text-on-secondary-container hover:bg-opacity-95 transition-all cursor-pointer flex items-center gap-1 border-none"
            >
              <span className="material-symbols-outlined text-[15px]">cached</span>
              Regenerate
            </button>
          )}
        </div>
      </div>

      {/* Expanded Parameters Panel */}
      {isExpanded && (
        <div className="border-t border-surface-variant/20 p-5 bg-surface-container-low grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-fade-in">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Trip Destination</span>
            <div className="text-[13px] font-bold text-on-surface mt-0.5">{getParam('destination', 'Assam')}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Source Origin</span>
            <div className="text-[13px] font-bold text-on-surface mt-0.5">{getParam('source_city', 'Delhi')}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Budget Level</span>
            <div className="text-[13px] font-bold text-on-surface mt-0.5">{getParam('style', 'Moderate')}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Duration</span>
            <div className="text-[13px] font-bold text-on-surface mt-0.5">{getParam('days', '5')} Days</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Preferred Language</span>
            <div className="text-[13px] font-bold text-on-surface mt-0.5">{getParam('preferred_language', 'English')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
