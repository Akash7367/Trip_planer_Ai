'use client';

import React from 'react';

interface TravelAdvisoryProps {
  temperature: number;
  rainProb: number;
  aqi: number;
  uvIndex: number;
}

export default function TravelAdvisory({
  temperature,
  rainProb,
  aqi,
  uvIndex
}: TravelAdvisoryProps) {
  // Compute Travel scores based on parameters
  const flightRisk = rainProb > 70 ? 'High Delay Risk (Storms)' : rainProb > 40 ? 'Medium Risk' : 'Low Delay Risk';
  const walkingComfort = temperature > 34 ? 'Low (Heat stress)' : rainProb > 50 ? 'Medium-Low' : 'Excellent';
  const photoScore = rainProb > 60 ? 40 : 95;
  const trekScore = rainProb > 50 ? 'Avoid (Landslide risk)' : 'Safe & Recommended';

  const aqiCategory = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : 'Unhealthy';

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14.5px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">healing</span>
        Health Advisory & Travel Delay Risks
      </h4>

      {/* Grid: Health index & Water reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2 text-[12px]">
          <span className="font-extrabold text-[12.5px] text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
            Medical Health Advisor
          </span>
          <ul className="space-y-1.5 text-on-surface-variant">
            <li><strong>Air Quality Index (AQI):</strong> {aqi} ({aqiCategory})</li>
            <li><strong>UV Exposure Level:</strong> Index {uvIndex} ({uvIndex > 6 ? 'High' : 'Low-Moderate'})</li>
            <li><strong>Hydration target:</strong> {temperature > 32 ? 'Minimum 3.5 Liters' : '2.0 Liters'}</li>
            <li><strong>Pollen Levels:</strong> Low (No allergies alerts)</li>
          </ul>
        </div>

        {/* Transit risks */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20 space-y-2 text-[12px]">
          <span className="font-extrabold text-[12.5px] text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[18px]">commute</span>
            Transportation Impact Tracker
          </span>
          <ul className="space-y-1.5 text-on-surface-variant">
            <li><strong>Flight operations:</strong> <span className="font-semibold text-on-surface">{flightRisk}</span></li>
            <li><strong>Walking comfort:</strong> <span className="font-semibold text-on-surface">{walkingComfort}</span></li>
            <li><strong>Trekking / Outdoors:</strong> <span className="font-semibold text-on-surface">{trekScore}</span></li>
            <li><strong>Photography rating:</strong> <span className="font-semibold text-on-surface">{photoScore}/100</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
