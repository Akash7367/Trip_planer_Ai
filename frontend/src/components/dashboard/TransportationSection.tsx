'use client';

import React, { useState, useMemo } from 'react';
import TransitCard, { TransitItem } from './transport/TransitCard';
import TransitComparison, { ComparisonRow } from './transport/TransitComparison';
import InteractiveMap from '../InteractiveMap';

interface TransportationSectionProps {
  sourceCity?: string;
  destination?: string;
  budgetTier?: string; // 'budget' | 'moderate' | 'luxury'
}

export default function TransportationSection({
  sourceCity = 'Mumbai',
  destination = 'Goa',
  budgetTier = 'moderate'
}: TransportationSectionProps) {
  const [activeTab, setActiveTab] = useState<'flights' | 'trains' | 'metro'>('flights');
  const [bookingConfirmedMsg, setBookingConfirmedMsg] = useState<string | null>(null);

  const destName = destination.split(',')[0].trim();
  const srcName = sourceCity.split(',')[0].trim();
  const destLower = destName.toLowerCase();

  // Route detection flags
  const isJapan = destLower.includes('kyoto') || destLower.includes('tokyo') || destLower.includes('osaka');
  const isGoa = destLower.includes('goa');
  const isJaipur = destLower.includes('jaipur');

  // Dynamic transit options dataset — always uses real srcName → destName
  const transitOptions = useMemo(() => {
    // Determine airline based on route type
    const airline = isJapan ? 'Japan Airlines' : isGoa ? 'IndiGo Airlines' : isJaipur ? 'Air India Express' : 'Air India';
    const flightNum = isJapan ? 'JL-131' : isGoa ? '6E-5218' : isJaipur ? 'IX-723' : `AI-${Math.floor(Math.random() * 900) + 100}`;
    const flightDuration = isJapan ? '1h 15m' : isGoa ? '1h 25m' : isJaipur ? '55m' : '2h 20m';
    const flightArr = isJapan ? '09:30 AM' : isGoa ? '09:40 AM' : isJaipur ? '09:10 AM' : '10:35 AM';
    const flightCost = isJapan ? 12500 : isGoa ? 4200 : isJaipur ? 2800 : 5400;

    const trainProvider = isJapan ? 'Tokaido Shinkansen (Nozomi)' : isGoa ? 'Tejas Express' : isJaipur ? 'Ajmer Shatabdi Express' : 'Rajdhani Express';
    const trainNum = isJapan ? 'N-82' : isGoa ? '22119' : isJaipur ? '12015' : '12957';
    const trainDuration = isJapan ? '2h 15m' : isGoa ? '8h 35m' : isJaipur ? '4h 40m' : '6h 15m';
    const trainArr = isJapan ? '08:20 AM' : isGoa ? '02:40 PM' : isJaipur ? '10:45 AM' : '12:20 PM';
    const trainCost = isJapan ? 14000 : isGoa ? 1550 : isJaipur ? 850 : 1250;

    const metroProvider = isJapan ? 'Karasuma Subway Line' : isGoa ? 'Kadamba Bus Service' : isJaipur ? 'Jaipur Metro Pink Line' : `${destName} City Metro`;
    const metroDuration = isJapan ? '10 mins' : isGoa ? '1h 10m' : isJaipur ? '15 mins' : '30 mins';
    const metroCost = isJapan ? 220 : isGoa ? 250 : isJaipur ? 30 : 60;
    const metroFrom = isJapan ? 'Kyoto Central Station' : `${destName} Airport / Main Station`;
    const metroTo = isJapan ? 'Shijo Station (City Centre)' : `${destName} City Centre`;

    const list: TransitItem[] = [
      {
        id: 'flight-1',
        type: 'flight',
        provider: airline,
        number: flightNum,
        from: `${srcName} Airport`,
        to: `${destName} Airport`,
        depTime: '08:15 AM',
        arrTime: flightArr,
        duration: flightDuration,
        cost: flightCost,
        details: ['Cabin: 7 kg', 'Checked: 15 kg', 'Complimentary WiFi', 'Non-stop']
      },
      {
        id: 'train-1',
        type: 'train',
        provider: trainProvider,
        number: trainNum,
        from: `${srcName} Railway Station`,
        to: `${destName} Railway Station`,
        depTime: '06:05 AM',
        arrTime: trainArr,
        duration: trainDuration,
        cost: trainCost,
        details: ['Chair Car / Executive AC', 'Meal onboard', 'Charging Sockets', 'Clean Bio-toilets']
      },
      {
        id: 'metro-1',
        type: 'metro',
        provider: metroProvider,
        number: 'Line-2',
        from: metroFrom,
        to: metroTo,
        depTime: 'Every 8-12 mins',
        arrTime: 'Daily runs',
        duration: metroDuration,
        cost: metroCost,
        details: ['Wheelchair accessible', 'Tap-to-pay active', 'AC coaches', 'Low carbon footprint']
      }
    ];
    return list;
  }, [destLower, srcName, destName, isJapan, isGoa, isJaipur]);

  // Dynamic comparison rows — fully driven by source and destination names
  const comparisons: ComparisonRow[] = useMemo(() => {
    const flightCost = transitOptions.find(t => t.type === 'flight')?.cost || 5000;
    const trainCost = transitOptions.find(t => t.type === 'train')?.cost || 1500;
    const metroCost = transitOptions.find(t => t.type === 'metro')?.cost || 50;
    const taxiCost = metroCost * 8;
    const flightDuration = transitOptions.find(t => t.type === 'flight')?.duration || '2h 00m';
    const trainDuration = transitOptions.find(t => t.type === 'train')?.duration || '6h 00m';
    const costDiff = Math.max(flightCost - trainCost, 0);

    return [
      {
        modeA: 'Flight',
        modeB: 'Train',
        routeDetails: `${srcName} → ${destName} Inter-city Corridor`,
        costDiff: `Flight costs ₹${costDiff.toLocaleString('en-IN')} more than Train`,
        timeDiff: `Flight (${flightDuration}) vs Train (${trainDuration}) — Flight typically saves time`,
        comfort: 'Flight offers faster travel with narrow seats; Train gives spacious AC chair cars with scenic routes',
        savings: costDiff
      },
      {
        modeA: 'Private Taxi',
        modeB: 'Metro / City Bus',
        routeDetails: `Local commute within ${destName} city area`,
        costDiff: `Taxi ≈ ₹${taxiCost}, Metro ≈ ₹${metroCost} per ride`,
        timeDiff: 'Nearly equal — Metro avoids city traffic congestion at peak hours',
        comfort: 'Taxi is door-to-door and flexible; Metro is punctual and eco-friendly',
        savings: Math.max(taxiCost - metroCost, 0)
      }
    ];
  }, [transitOptions, srcName, destName]);

  const handleBookTransit = (provider: string) => {
    setBookingConfirmedMsg(`Seat selection confirmed on ${provider}! E-ticket will follow via email.`);
    setTimeout(() => setBookingConfirmedMsg(null), 3000);
  };

  const filteredTransit = useMemo(() => {
    return transitOptions.filter(item => item.type === activeTab);
  }, [transitOptions, activeTab]);

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">commute</span>
          Transit Comparison & Routing Guide
        </h3>
        <p className="text-[12px] text-on-surface-variant mt-0.5">
          Dynamic route itineraries comparing flight tickets, rail chairs, and local metros from <span className="font-extrabold text-primary">{srcName}</span> to <span className="font-extrabold text-primary">{destName}</span>.
        </p>
      </div>

      {bookingConfirmedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-[12.5px] font-bold animate-fade-in">
          {bookingConfirmedMsg}
        </div>
      )}

      {/* Tabs Selector row */}
      <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-surface-variant/20 gap-1.5">
        {[
          { id: 'flights', label: 'Inter-City Flights', icon: 'flight' },
          { id: 'trains', label: 'Express Trains', icon: 'train' },
          { id: 'metro', label: 'Metro & Local Bus', icon: 'subway' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-grow py-2 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Filtered List */}
      <div className="space-y-4">
        {filteredTransit.map(item => (
          <TransitCard key={item.id} item={item} onBook={handleBookTransit} />
        ))}
      </div>

      {/* Comparison Grid */}
      <TransitComparison comparisons={comparisons} />

      {/* Route Map */}
      <div className="space-y-2">
        <h4 className="font-bold text-[13px] text-on-surface uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-[18px]">map</span>
          Transit Geography Corridor Map
        </h4>
        <div className="w-full h-[180px] rounded-xl overflow-hidden border border-surface-variant/30">
          <InteractiveMap destination={destName} />
        </div>
      </div>

    </div>
  );
}
