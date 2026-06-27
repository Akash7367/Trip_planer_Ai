'use client';

import React from 'react';
import { Restaurant } from './RestaurantCard';

interface FoodComparisonModalProps {
  restaurants: Restaurant[];
  onClose: () => void;
  onSelectBook: (name: string) => void;
}

export default function FoodComparisonModal({
  restaurants,
  onClose,
  onSelectBook
}: FoodComparisonModalProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface-lowest w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden relative border border-surface-variant flex flex-col max-h-[85vh] animate-scale-up text-left">
        
        {/* Header */}
        <div className="p-5 border-b border-surface-variant/30 flex justify-between items-center bg-surface-lowest">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-black flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[24px]">compare_arrows</span>
              Restaurant Comparison Matrix
            </h3>
            <p className="text-[12px] text-on-surface-variant mt-0.5">Compare pricing, hygiene, cuisines, and travel times side-by-side.</p>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant cursor-pointer border-none bg-transparent"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Matrix Table */}
        <div className="overflow-auto p-5">
          <table className="w-full text-[13px] border-collapse text-left min-w-[650px]">
            <thead>
              <tr className="bg-surface-variant/20 border-b border-surface-variant/30">
                <th className="p-3 font-bold text-on-surface-variant">Feature Index</th>
                {restaurants.map(r => (
                  <th key={r.id} className="p-3 font-black text-on-surface">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Cuisines</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3 text-on-surface-variant">{r.cuisines.join(', ')}</td>
                ))}
              </tr>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Rating</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3 font-bold text-on-surface">{r.rating} ★</td>
                ))}
              </tr>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Cost for Two</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3 font-black text-primary">₹{r.averageCostForTwo}</td>
                ))}
              </tr>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Hygiene Score</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3 font-bold text-emerald-600">{r.hygieneScore}% FSSAI</td>
                ))}
              </tr>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Wait Time</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3">{r.waitingTime}</td>
                ))}
              </tr>
              <tr className="border-b border-surface-variant/10">
                <td className="p-3 font-bold text-on-surface-variant">Distance & Transit</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3">{r.distance} ({r.travelTime})</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-on-surface-variant">Booking</td>
                {restaurants.map(r => (
                  <td key={r.id} className="p-3">
                    <button
                      onClick={() => onSelectBook(r.name)}
                      className="bg-primary text-on-primary font-bold text-[11px] px-3.5 py-1.5 rounded-lg hover:opacity-95 cursor-pointer border-none"
                    >
                      Book Table
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
