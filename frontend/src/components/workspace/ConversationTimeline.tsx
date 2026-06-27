'use client';

import React from 'react';

interface VersionSnapshot {
  id: string;
  timestamp: string;
  query: string;
  plan: any;
}

interface ConversationTimelineProps {
  versions: VersionSnapshot[];
  onRestoreVersion: (plan: any) => void;
}

export default function ConversationTimeline({ versions, onRestoreVersion }: ConversationTimelineProps) {
  if (versions.length <= 1) return null;

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-5 shadow-sm text-left">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="material-symbols-outlined text-primary text-[22px]">history</span>
        <h4 className="font-extrabold text-[15px] text-on-surface">AI Conversation Memory (Trip Trail)</h4>
      </div>

      <div className="relative pl-4 border-l-2 border-surface-variant/40 space-y-4">
        {versions.map((ver, idx) => (
          <div key={ver.id} className="relative">
            {/* Dot marker */}
            <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-surface-container-lowest ${
              idx === 0 ? 'bg-primary scale-125' : 'bg-outline-variant'
            }`} />
            
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest block">
                  Version {versions.length - idx} &bull; {ver.timestamp}
                </span>
                <p className="text-[12.5px] font-medium text-on-surface mt-1">
                  "{ver.query}"
                </p>
              </div>

              {idx > 0 && (
                <button
                  onClick={() => onRestoreVersion(ver.plan)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/5 transition-all cursor-pointer shrink-0"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
