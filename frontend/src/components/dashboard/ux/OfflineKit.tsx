'use client';

import React, { useState } from 'react';

interface PackItem {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
}

export default function OfflineKit() {
  const [packs, setPacks] = useState<PackItem[]>([
    { id: '1', name: 'Offline Map & Geocodes', size: '24.5 MB', downloaded: false },
    { id: '2', name: 'Regional Translation Dictionary', size: '4.8 MB', downloaded: false },
    { id: '3', name: 'Metro Route & Timetable Index', size: '1.2 MB', downloaded: false },
    { id: '4', name: 'Emergency Hospital Contacts', size: '300 KB', downloaded: false }
  ]);

  const [simulatedUpdate, setSimulatedUpdate] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setSimulatedUpdate(id);
    setTimeout(() => {
      setPacks(prev => prev.map(p => p.id === id ? { ...p, downloaded: !p.downloaded } : p));
      setSimulatedUpdate(null);
    }, 1500);
  };

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">download_for_offline</span>
        Offline Travel Kit & Download Center
      </h4>

      <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-xl text-[12px] text-on-surface-variant leading-relaxed">
        <strong>Tip:</strong> Download local translation dictionaries and maps to search restaurants and view emergency contacts even without cell reception.
      </div>

      <div className="space-y-3.5">
        {packs.map(pack => (
          <div key={pack.id} className="flex justify-between items-center text-[12px]">
            <div>
              <span className="font-extrabold text-on-surface block">{pack.name}</span>
              <span className="text-[10px] text-on-surface-variant font-bold">Size: {pack.size}</span>
            </div>
            
            <button
              onClick={() => handleDownload(pack.id)}
              disabled={simulatedUpdate === pack.id}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer border-none flex items-center gap-1 ${
                pack.downloaded
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-red-50 hover:text-red-800'
                  : 'bg-primary text-on-primary hover:bg-opacity-95'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {simulatedUpdate === pack.id
                  ? 'sync'
                  : pack.downloaded
                  ? 'check_circle'
                  : 'download'}
              </span>
              {simulatedUpdate === pack.id
                ? 'Syncing...'
                : pack.downloaded
                ? 'Downloaded'
                : 'Download'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
