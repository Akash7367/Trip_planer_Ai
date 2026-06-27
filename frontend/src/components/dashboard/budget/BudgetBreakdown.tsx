'use client';

import React from 'react';

export interface BudgetCategory {
  title: string;
  items: { label: string; cost: number }[];
}

interface BudgetBreakdownProps {
  categories: BudgetCategory[];
}

export default function BudgetBreakdown({ categories }: BudgetBreakdownProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">donut_large</span>
        Itemized Cost Breakdowns
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => {
          const totalCatCost = cat.items.reduce((sum, item) => sum + item.cost, 0);
          return (
            <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-3">
              <div className="flex justify-between items-center border-b border-surface-variant/20 pb-2">
                <span className="font-extrabold text-[13px] text-on-surface">{cat.title}</span>
                <span className="font-black text-primary text-[13px]">₹{totalCatCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-2 text-[12px] text-on-surface-variant">
                {cat.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{item.label}</span>
                    <span className="font-semibold text-on-surface">₹{item.cost.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
