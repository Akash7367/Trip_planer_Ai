'use client';

import React, { useState, useMemo } from 'react';
import BudgetBreakdown, { BudgetCategory } from './BudgetBreakdown';
import SavingsEngine from './SavingsEngine';
import DailyExpenseTimeline, { DailyExpense } from './DailyExpenseTimeline';
import BudgetSimulator from './BudgetSimulator';

interface BudgetDashboardProps {
  destination?: string;
  peopleCount?: number;
  daysCount?: number;
}

export default function BudgetDashboard({
  destination = 'Goa',
  peopleCount = 1,
  daysCount = 5
}: BudgetDashboardProps) {
  const [optimizationTier, setOptimizationTier] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState(false);

  const destName = destination.split(',')[0].trim();
  const travelers = peopleCount || 1;
  const days = daysCount || 5;

  // Raw default values
  const baseBudget = useMemo(() => {
    const isJapan = destName.toLowerCase().includes('kyoto') || destName.toLowerCase().includes('tokyo');
    return isJapan ? 125000 : 25000;
  }, [destName]);

  // Adjust total cost based on the active optimization slider tier
  const adjustedTotal = useMemo(() => {
    const discount = optimizationTier === 10 ? 0.10 : optimizationTier === 20 ? 0.20 : 0;
    return Math.round(baseBudget * travelers * (1 - discount));
  }, [baseBudget, travelers, optimizationTier]);

  const costPerPerson = Math.round(adjustedTotal / travelers);

  // Dynamic breakdown categories
  const categories: BudgetCategory[] = useMemo(() => {
    const factor = (1 - (optimizationTier / 100));
    return [
      {
        title: 'Transportation',
        items: [
          { label: 'Outstation flights/trains', cost: Math.round(12000 * factor) },
          { label: 'Local metro & shuttle cabs', cost: Math.round(1800 * factor) },
          { label: 'Highway toll & parking fees', cost: Math.round(400 * factor) }
        ]
      },
      {
        title: 'Hotels & Accommodation',
        items: [
          { label: 'Hotel/Home stay rooms', cost: Math.round(8000 * factor) },
          { label: 'Resort service taxes & fees', cost: Math.round(960 * factor) }
        ]
      },
      {
        title: 'Dining & Food',
        items: [
          { label: 'Main restaurant lunches/dinners', cost: Math.round(3500 * factor) },
          { label: 'Local street snacks & tea/juice', cost: Math.round(500 * factor) }
        ]
      },
      {
        title: 'Emergency & Miscellaneous',
        items: [
          { label: 'Emergency buffer cash', cost: Math.round(1500 * factor) },
          { label: 'Travel insurance plan', cost: Math.round(450 * factor) }
        ]
      }
    ];
  }, [optimizationTier]);

  // AI Savings suggestions list
  const savingsOpportunities = useMemo(() => {
    return [
      { text: 'Choosing local trains/buses instead of taxis saves ₹2,500.', saved: 2500 },
      { text: 'Reserving standard rooms near monuments cuts transfer fees by ₹1,000.', saved: 1000 },
      { text: 'Booking dinners through partner cards cuts service charges by 15%.', saved: 650 }
    ];
  }, []);

  // Daily Expense Timelines
  const dailyExpenses: DailyExpense[] = useMemo(() => {
    const factor = (1 - (optimizationTier / 100));
    const list: DailyExpense[] = [];
    for (let d = 1; d <= days; d++) {
      list.push({
        day: d,
        items: [
          { label: 'Morning Local Transport', cost: Math.round(300 * factor) },
          { label: 'General lunch & drinks', cost: Math.round(550 * factor) },
          { label: 'Attraction Entrance Passes', cost: Math.round(150 * factor) },
          { label: 'Standard Dinner', cost: Math.round(800 * factor) }
        ]
      });
    }
    return list;
  }, [days, optimizationTier]);

  const handleExportPDF = () => {
    setDownloadProgress(true);
    setTimeout(() => setDownloadProgress(false), 2000);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">payments</span>
            Budget Planner & Expense Intelligence
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Personalized budget breakdown for <span className="font-bold text-primary">{travelers}</span> travelers over <span className="font-bold text-primary">{days}</span> days.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="bg-primary text-on-primary font-bold text-[12.5px] px-5 py-2.5 rounded-xl hover:bg-opacity-95 transition-all cursor-pointer flex items-center gap-1.5 border-none"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {downloadProgress ? 'Exporting...' : 'Export Budget Guide'}
        </button>
      </div>

      {/* Main summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Estimated Total</span>
          <span className="font-black text-[22px] text-primary mt-1 block">₹{adjustedTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Cost Per Person</span>
          <span className="font-black text-[22px] text-on-surface mt-1 block">₹{costPerPerson.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Confidence Score</span>
          <span className="font-black text-[22px] text-emerald-600 mt-1 block">94%</span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Emergency Cash</span>
          <span className="font-black text-[20px] text-orange-600 mt-1.5 block">₹{(1500 * travelers).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Breakdowns & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetBreakdown categories={categories} />
        <DailyExpenseTimeline days={dailyExpenses} />
      </div>

      {/* Savings engine */}
      <SavingsEngine
        opportunities={savingsOpportunities}
        optimizationTier={optimizationTier}
        onChangeTier={setOptimizationTier}
      />

      {/* Simulator Tools (Budget Tracker, Surcharges & Can I Afford This calculator) */}
      <BudgetSimulator />
    </div>
  );
}
