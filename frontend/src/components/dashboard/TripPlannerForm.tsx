'use client';

import React from 'react';

interface TripPlannerFormProps {
  query: string;
  setQuery: (val: string) => void;
  sourceCity: string;
  setSourceCity: (val: string) => void;
  days: number;
  setDays: (val: number) => void;
  travelers: number;
  setTravelers: (val: number) => void;
  isPlanning: boolean;
  logs: string[];
  onSubmit: (e: React.FormEvent) => void;
}

export default function TripPlannerForm({
  query,
  setQuery,
  sourceCity,
  setSourceCity,
  days,
  setDays,
  travelers,
  setTravelers,
  isPlanning,
  logs,
  onSubmit
}: TripPlannerFormProps) {
  return (
    <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
      <h3 className="text-[18px] font-bold text-[#001a41] mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#0058bc]">flight_takeoff</span> Plan Your Trip
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Prompt Itinerary Goal</label>
          <textarea 
            className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none focus:border-[#0058bc] h-28 resize-none"
            placeholder="Describe destination and style preferences (e.g. A family trip to Goa visiting beaches and seafood shacks)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            disabled={isPlanning}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Days</label>
            <input 
              type="number"
              min={1}
              max={30}
              className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={isPlanning}
            />
          </div>
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Travelers</label>
            <input 
              type="number"
              min={1}
              max={10}
              className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              disabled={isPlanning}
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Starting City</label>
          <input 
            type="text"
            className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none"
            value={sourceCity}
            onChange={(e) => setSourceCity(e.target.value)}
            disabled={isPlanning}
          />
        </div>

        <button 
          type="submit"
          disabled={isPlanning}
          className="w-full bg-[#0058bc] hover:bg-opacity-90 text-white rounded-xl py-3.5 text-[14px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isPlanning ? "Running Agents..." : "Run Agent Orchestrator"} 
          <span className="material-symbols-outlined text-[18px]">magic_button</span>
        </button>
      </form>

      {/* Logs output console */}
      {(isPlanning || logs.length > 0) && (
        <div className="mt-8 pt-6 border-t border-[#eeedf3]">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#414755] mb-3">Agent Graph Logs</h4>
          <div className="bg-[#f4f3f8] rounded-xl p-4 font-mono text-[11px] text-[#414755] h-48 overflow-y-auto space-y-1.5 border border-[#eeedf3]">
            {logs.map((log, idx) => (
              <div key={idx} className={log.startsWith("ERROR") ? "text-red-600" : log.startsWith("SUCCESS") ? "text-[#0058bc] font-bold" : ""}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
