'use client';

import React, { useState, useMemo } from 'react';

export default function BudgetSimulator() {
  // 1. Slider Simulator States
  const [sliderValue, setSliderValue] = useState<number>(30000);
  
  // 2. Can I Afford This States
  const [affordInput, setAffordInput] = useState<number>(18000);
  const [affordResult, setAffordResult] = useState<any | null>(null);

  // Dynamic upgrade recommendations based on slider
  const upgrades = useMemo(() => {
    if (sliderValue < 20000) {
      return {
        hotel: 'Economy hostel / dormitory',
        transport: 'Local trains & shared buses',
        food: 'Local street food stalls & cafes',
        level: 'Backpacker Budget'
      };
    } else if (sliderValue < 45000) {
      return {
        hotel: '3-star boutique residency rooms',
        transport: 'App cabs & private taxi bookings',
        food: 'Casual family restaurants',
        level: 'Standard Comfort'
      };
    } else {
      return {
        hotel: '5-star beach resort pool villa',
        transport: 'Private chauffeur AC sedan',
        food: 'Fine dining beachside eateries',
        level: 'Luxury Indulgence'
      };
    }
  }, [sliderValue]);

  // "Can I Afford This" logic
  const handleCalculateAffordability = (e: React.FormEvent) => {
    e.preventDefault();
    if (affordInput < 10000) {
      setAffordResult({
        affordable: false,
        text: 'Minimum baseline cost for this trip is ₹12,000. Try adding an emergency buffer or shortening the trip.',
        deductions: []
      });
      return;
    }

    setAffordResult({
      affordable: true,
      text: `Fits baseline parameters! We adjusted recommendations to fit ₹${affordInput.toLocaleString('en-IN')}.`,
      deductions: [
        'Replace private taxi rides with metro transit (Saves ₹2,500)',
        'Upgrade to dormitory bed instead of private AC rooms (Saves ₹4,200)',
        'Choose street food stalls for lunches (Saves ₹1,800)',
        'Skip 1 premium paid museum pass (Saves ₹500)'
      ],
      newBudget: Math.round(affordInput - 450)
    });
  };

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-6 text-left shadow-sm">
      
      {/* 1. Dynamic Upgrade Slider */}
      <div className="space-y-3.5">
        <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
          AI Budget Upgrade Simulator
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[12.5px] font-bold text-on-surface-variant">
            <span>Simulate Limit</span>
            <span className="text-primary font-black text-[15px]">₹{sliderValue.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="80000"
            step="5000"
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            className="w-full h-1.5 bg-surface-variant/30 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-xl text-[12px] space-y-1.5 mt-2">
            <div className="font-bold text-primary flex justify-between">
              <span>Optimized Tier: {upgrades.level}</span>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <ul className="space-y-1 text-on-surface-variant font-medium">
              <li>🏨 <strong>Hotel:</strong> {upgrades.hotel}</li>
              <li>🚗 <strong>Transit:</strong> {upgrades.transport}</li>
              <li>🍽️ <strong>Dining:</strong> {upgrades.food}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Live Tracker (During Trip Simulation) */}
      <div className="space-y-3.5 border-t border-surface-variant/20 pt-4">
        <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
          Live Trip Expense Tracker
        </h4>
        <div className="grid grid-cols-3 gap-2.5 text-center text-[12px] font-bold">
          <div className="bg-surface-container-low p-2 rounded-xl border border-surface-variant/10">
            <span className="text-on-surface-variant text-[10px] block">Estimated</span>
            <span className="text-on-surface">₹35,000</span>
          </div>
          <div className="bg-surface-container-low p-2 rounded-xl border border-surface-variant/10">
            <span className="text-on-surface-variant text-[10px] block">Actual Spent</span>
            <span className="text-on-surface">₹21,300</span>
          </div>
          <div className="bg-surface-container-low p-2 rounded-xl border border-surface-variant/10">
            <span className="text-on-surface-variant text-[10px] block">Remaining</span>
            <span className="text-emerald-600">₹13,700</span>
          </div>
        </div>
        
        {/* Today's alert warning */}
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl flex items-center justify-between text-[11.5px] font-semibold">
          <span>Today\'s spending: ₹2,950 (Budget: ₹2,500)</span>
          <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px] text-orange-800 animate-bounce">warning</span>
            Over Budget by ₹450
          </span>
        </div>
      </div>

      {/* 3. AI Cost Predictor */}
      <div className="space-y-3.5 border-t border-surface-variant/20 pt-4">
        <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-primary text-[20px]">trending_up</span>
          AI Festival Price Forecast
        </h4>
        <p className="text-[12px] text-on-surface-variant leading-relaxed">
          Traveling during peak festivals like <strong>Diwali</strong> or <strong>New Year</strong> triggers seasonal surcharge hikes:
        </p>
        <div className="grid grid-cols-3 gap-2.5 text-[11px] font-bold text-center">
          <div className="bg-red-500/10 text-red-700 dark:bg-red-950/20 dark:text-red-400 p-2.5 rounded-lg border border-red-500/20">
            <span>Hotel rates</span>
            <span className="block font-black text-[13px] mt-0.5">+35% Hike</span>
          </div>
          <div className="bg-red-500/10 text-red-700 dark:bg-red-950/20 dark:text-red-400 p-2.5 rounded-lg border border-red-500/20">
            <span>Airfare tickets</span>
            <span className="block font-black text-[13px] mt-0.5">+42% Hike</span>
          </div>
          <div className="bg-red-500/10 text-red-700 dark:bg-red-950/20 dark:text-red-400 p-2.5 rounded-lg border border-red-500/20">
            <span>Eatery meals</span>
            <span className="block font-black text-[13px] mt-0.5">+15% Hike</span>
          </div>
        </div>
      </div>

      {/* 4. Can I Afford This? */}
      <div className="space-y-3.5 border-t border-surface-variant/20 pt-4">
        <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
          "Can I Afford This?" AI Diagnostic
        </h4>
        <form onSubmit={handleCalculateAffordability} className="flex gap-2">
          <input
            type="number"
            value={affordInput}
            onChange={(e) => setAffordInput(parseInt(e.target.value))}
            placeholder="Enter budget (e.g. 18000)..."
            className="flex-grow p-2.5 rounded-xl bg-surface-container border border-surface-variant/30 text-[13px] outline-none focus:ring-1 focus:ring-primary text-on-surface"
          />
          <button
            type="submit"
            className="bg-primary text-on-primary font-bold text-[12.5px] px-4 py-2.5 rounded-xl hover:bg-opacity-95 transition-all border-none cursor-pointer"
          >
            Check Affordable
          </button>
        </form>

        {affordResult && (
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2.5 animate-fade-in text-[12px]">
            <div className="font-bold text-on-surface">{affordResult.text}</div>
            {affordResult.deductions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider">Required Trade-offs:</span>
                <ul className="list-disc pl-4 text-on-surface-variant space-y-1">
                  {affordResult.deductions.map((d: string, i: number) => <li key={i}>{d}</li>)}
                </ul>
                <div className="pt-2 font-bold text-emerald-600">Adjusted Target Budget: ₹{affordResult.newBudget}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Hidden Expense Warnings */}
      <div className="space-y-3.5 border-t border-surface-variant/20 pt-4">
        <h4 className="text-[14px] font-bold text-error uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span className="material-symbols-outlined text-[18px]">info</span>
          Hidden Expense Warnings
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">photo_camera</span> Camera fees at gates</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">lock</span> Temple locker fees</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">local_parking</span> Parking and Toll charges</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[14px]">work_history</span> Luggage storage slips</span>
        </div>
      </div>

    </div>
  );
}
