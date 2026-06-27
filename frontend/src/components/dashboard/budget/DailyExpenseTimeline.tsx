'use client';

import React from 'react';

export interface DailyExpense {
  day: number;
  items: { label: string; cost: number }[];
}

interface DailyExpenseTimelineProps {
  days: DailyExpense[];
}

export default function DailyExpenseTimeline({ days }: DailyExpenseTimelineProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
        Daily Cost Timelines
      </h4>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar">
        {days.map((d, idx) => {
          const dailySum = d.items.reduce((sum, item) => sum + item.cost, 0);
          return (
            <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2">
              <div className="flex justify-between items-center font-bold text-[12.5px] border-b border-surface-variant/10 pb-1.5">
                <span className="text-on-surface font-heading">Day {d.day} Schedule Expenses</span>
                <span className="text-primary font-black">₹{dailySum.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-1 text-[11.5px] text-on-surface-variant">
                {d.items.map((item, i) => (
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
