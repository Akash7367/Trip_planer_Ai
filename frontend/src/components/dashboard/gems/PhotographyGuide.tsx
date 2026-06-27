'use client';

import React from 'react';

interface PhotoSpot {
  name: string;
  bestTime: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  lensTip: string;
}

interface PhotographyGuideProps {
  spots: PhotoSpot[];
}

export default function PhotographyGuide({ spots }: PhotographyGuideProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">photo_camera</span>
        Photographer's Scouting Guide
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
        {spots.map((spot, idx) => (
          <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2">
            <div className="flex justify-between items-start border-b border-surface-variant/15 pb-1.5 font-bold">
              <span className="text-on-surface">{spot.name}</span>
              <span className="bg-surface-variant/20 text-on-surface-variant text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded">
                Diff: {spot.difficulty}
              </span>
            </div>
            <ul className="space-y-1 text-on-surface-variant">
              <li><strong>Best Shooting Window:</strong> {spot.bestTime}</li>
              <li><strong>Gear Tip:</strong> {spot.lensTip}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
