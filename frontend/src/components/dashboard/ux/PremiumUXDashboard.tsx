'use client';

import React from 'react';
import UserProfileCard from './UserProfileCard';
import OfflineKit from './OfflineKit';
import TripStats from './TripStats';

interface PremiumUXDashboardProps {
  destination?: string;
}

export default function PremiumUXDashboard({ destination = 'Goa' }: PremiumUXDashboardProps) {
  const destName = destination.split(',')[0].trim();

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Countdown Alert Banner */}
      <div className="bg-primary/5 border border-primary/25 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-primary animate-bounce" style={{ animationDuration: '4s' }}>
            flight_takeoff
          </span>
          <div>
            <h4 className="font-extrabold text-[15px] text-on-surface">Countdown to {destName} Trip</h4>
            <p className="text-[12px] text-on-surface-variant font-semibold mt-0.5">Passport, visa check, and luggage checklist verifications complete.</p>
          </div>
        </div>

        <div className="bg-primary text-on-primary text-[14px] font-black px-4.5 py-2.5 rounded-xl text-center self-stretch sm:self-auto flex items-center justify-center shrink-0">
          🕒 14 Days Left!
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserProfileCard />
        <OfflineKit />
        <TripStats />
      </div>

    </div>
  );
}
