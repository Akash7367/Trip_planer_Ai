'use client';

import React from 'react';

export interface Experience {
  name: string;
  type: string;
  duration: string;
  cost: string;
  whyLocal: string;
}

interface LocalExperiencesProps {
  experiences: Experience[];
}

export default function LocalExperiences({ experiences }: LocalExperiencesProps) {
  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">local_activity</span>
        Unique Local Workshops & Heritage Walks
      </h4>

      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[12px]"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[13.5px] text-on-surface">{exp.name}</span>
                <span className="bg-primary/10 text-primary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {exp.type}
                </span>
              </div>
              <p className="text-on-surface-variant text-[11.5px] leading-relaxed">
                💡 <strong>Why it is authentic:</strong> {exp.whyLocal}
              </p>
            </div>

            <div className="flex sm:flex-col items-baseline sm:items-end gap-1.5 shrink-0 text-right font-bold text-[11px] text-on-surface-variant">
              <span>Cost: <span className="text-primary font-black">₹{exp.cost}</span></span>
              <span className="text-[10px] font-normal italic">({exp.duration})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
