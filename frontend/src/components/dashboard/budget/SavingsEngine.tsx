'use client';

import React from 'react';

interface SavingsOpportunity {
  text: string;
  saved: number;
}

interface SavingsEngineProps {
  opportunities: SavingsOpportunity[];
  optimizationTier: number; // 0 = standard, 10 = -10%, 20 = -20%
  onChangeTier: (tier: number) => void;
}

export default function SavingsEngine({
  opportunities,
  optimizationTier,
  onChangeTier
}: SavingsEngineProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
        AI Savings & Optimization Engine
      </h4>

      {/* Optimization controller */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-3">
        <span className="text-[11.5px] font-bold text-primary block uppercase tracking-wider">Select Optimization Tier</span>
        <div className="flex gap-2">
          {[
            { id: 0, label: 'Standard Comfort' },
            { id: 10, label: 'Reduce Budget by 10%' },
            { id: 20, label: 'Reduce Budget by 20%' }
          ].map(tier => (
            <button
              key={tier.id}
              onClick={() => onChangeTier(tier.id)}
              className={`flex-grow py-2 px-3 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                optimizationTier === tier.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface border border-surface-variant/30 text-on-surface-variant hover:text-primary'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Savings items list */}
      <div className="space-y-2 text-[12px] text-on-surface-variant">
        {opportunities.map((op, idx) => (
          <div key={idx} className="flex gap-2 items-start bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/10">
            <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
            <div className="flex-grow">
              <p className="font-semibold text-on-surface leading-snug">{op.text}</p>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase mt-1 inline-block">Saves: ₹{op.saved}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
