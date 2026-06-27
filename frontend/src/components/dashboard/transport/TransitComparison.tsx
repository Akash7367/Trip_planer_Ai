'use client';

import React from 'react';

export interface ComparisonRow {
  modeA: string;
  modeB: string;
  routeDetails: string; // e.g. "Delhi Airport -> Jaipur Palace"
  costDiff: string;
  timeDiff: string;
  comfort: string;
  savings: number;
}

interface TransitComparisonProps {
  comparisons: ComparisonRow[];
}

export default function TransitComparison({ comparisons }: TransitComparisonProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">compare_arrows</span>
        Transit Mode Comparison Matrix
      </h4>

      <div className="space-y-3.5">
        {comparisons.map((row, idx) => (
          <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-3 text-[12px] leading-relaxed">
            <div className="flex justify-between items-center border-b border-surface-variant/15 pb-1.5 font-bold">
              <span className="text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">directions</span>
                {row.modeA} vs {row.modeB}
              </span>
              <span className="bg-emerald-600/10 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                Save ₹{row.savings}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-on-surface-variant font-medium">
              <div>
                <span className="text-[9.5px] block uppercase font-bold text-primary">Exact Route</span>
                <span className="text-on-surface font-semibold">{row.routeDetails}</span>
              </div>
              <div>
                <span className="text-[9.5px] block uppercase font-bold text-primary">Cost Difference</span>
                <span className="text-on-surface font-semibold">{row.costDiff}</span>
              </div>
              <div>
                <span className="text-[9.5px] block uppercase font-bold text-primary">Travel Time</span>
                <span className="text-on-surface font-semibold">{row.timeDiff}</span>
              </div>
              <div>
                <span className="text-[9.5px] block uppercase font-bold text-primary">Comfort Level</span>
                <span className="text-on-surface font-semibold">{row.comfort}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
