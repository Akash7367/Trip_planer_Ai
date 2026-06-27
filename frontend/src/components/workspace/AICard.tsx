'use client';

import React from 'react';

interface AICardProps {
  title: string;
  icon: string;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export default function AICard({ title, icon, onRefresh, children }: AICardProps) {
  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl shadow-sm overflow-hidden text-left flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div className="p-4 border-b border-surface-variant/15 flex items-center justify-between bg-surface-container-low/40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
          <h4 className="text-[13px] font-black uppercase text-on-surface tracking-wider">{title}</h4>
        </div>
        
        <div className="flex items-center gap-1">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline transition-colors cursor-pointer border-none bg-transparent"
              title="Recalibrate / Refresh recommendation"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
          )}
          <div className="flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-950/45 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>AI Verified</span>
          </div>
        </div>
      </div>

      {/* Main Inner content */}
      <div className="p-5 flex-grow">
        {children}
      </div>

    </div>
  );
}
