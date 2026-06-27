'use client';

import React from 'react';

export interface TransitItem {
  id: string;
  type: 'flight' | 'train' | 'metro';
  provider: string;
  number: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
  cost: number;
  details: string[];
}

interface TransitCardProps {
  item: TransitItem;
  onBook?: (name: string) => void;
}

export default function TransitCard({ item, onBook }: TransitCardProps) {
  const isFlight = item.type === 'flight';
  const isTrain = item.type === 'train';

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left hover:shadow-sm transition-all">
      <div className="flex items-start gap-3 flex-grow">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[22px] shrink-0 border border-primary/20">
          <span className="material-symbols-outlined">
            {isFlight ? 'flight' : isTrain ? 'train' : 'subway'}
          </span>
        </div>
        
        <div className="space-y-1 flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-[15px] text-on-surface">{item.provider}</span>
            <span className="text-[10px] font-bold uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant border border-surface-variant/10">
              {item.number}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[12.5px] text-on-surface-variant">
            <div>
              <span className="text-[10px] block font-bold uppercase tracking-wider text-primary">From</span>
              <span className="font-semibold text-on-surface">{item.from}</span>
              <span className="block text-[10px] italic">{item.depTime}</span>
            </div>
            <div>
              <span className="text-[10px] block font-bold uppercase tracking-wider text-primary">To</span>
              <span className="font-semibold text-on-surface">{item.to}</span>
              <span className="block text-[10px] italic">{item.arrTime}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] block font-bold uppercase tracking-wider text-on-surface-variant">Duration</span>
              <span className="font-semibold text-on-surface">{item.duration}</span>
            </div>
          </div>

          {/* Bullet specifications */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {item.details.map((d, idx) => (
              <span key={idx} className="bg-surface-container-low border border-surface-variant/15 text-on-surface-variant text-[9.5px] font-bold px-2 py-0.5 rounded-full">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing / Booking CTA */}
      <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto border-t md:border-none border-surface-variant/20 pt-3.5 md:pt-0 shrink-0">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[18px] font-black text-primary">₹{item.cost.toLocaleString('en-IN')}</span>
          <span className="text-[10.5px] text-on-surface-variant font-medium">/ seat</span>
        </div>

        {onBook && (
          <button
            onClick={() => onBook(item.provider)}
            className="bg-primary text-on-primary font-bold text-[11px] px-4 py-2 rounded-lg mt-2 hover:bg-opacity-95 transition-all cursor-pointer border-none"
          >
            Select Ride
          </button>
        )}
      </div>
    </div>
  );
}
