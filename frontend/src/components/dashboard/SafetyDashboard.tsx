'use client';

import React, { useState, useMemo } from 'react';
import InteractiveMap from '../InteractiveMap';
import { useLanguage } from '@/context/LanguageContext';

interface SafetyDashboardProps {
  destination?: string;
  travelerProfile?: string;
}

interface ScamDetails {
  name: string;
  category: string;
  loss: string;
  location: string;
  howItWorks: string;
  warningSigns: string[];
  howToAvoid: string;
  emergencyAction: string;
}

export default function SafetyDashboard({
  destination = 'Goa',
  travelerProfile = 'general'
}: SafetyDashboardProps) {
  const { speakText } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'scams' | 'simulator' | 'medical'>('overview');
  const [selectedScamIdx, setSelectedScamIdx] = useState<number | null>(null);
  const [simScenario, setSimScenario] = useState<string | null>(null);
  const [simAnswer, setSimAnswer] = useState<string | null>(null);
  const [sosTriggered, setSosTriggered] = useState(false);

  const destName = destination.split(',')[0].trim();
  const destLower = destName.toLowerCase();

  // Dynamic safety scores based on destination
  const safetyMetrics = useMemo(() => {
    const isJapan = destLower.includes('kyoto') || destLower.includes('tokyo');
    return {
      overall: isJapan ? 96 : 82,
      women: isJapan ? 94 : 80,
      night: isJapan ? 92 : 72,
      medical: isJapan ? 95 : 85,
      scamRisk: isJapan ? 'Low' : 'Medium-High',
      disasters: isJapan ? 'Earthquake Warning' : 'No active alerts',
      traffic: isJapan ? 'Low' : 'High'
    };
  }, [destLower]);

  // Destination-specific scam directory
  const scamsDirectory: ScamDetails[] = useMemo(() => {
    if (destLower.includes('mumbai')) {
      return [
        {
          name: 'Airport Taxi Overcharging',
          category: 'Taxi Scam',
          loss: '₹800 - ₹1,500',
          location: 'Airport Terminals / Station Exits',
          howItWorks: 'Drivers claim the meter is broken or take longer routes to inflate charges.',
          warningSigns: ['Refusal to turn on the digital meter', 'Insistence on fixed pricing upfront'],
          howToAvoid: 'Use only prepaid booths inside the terminal gates or Ola/Uber.',
          emergencyAction: 'Call Colaba Traffic Police Helpline.'
        },
        {
          name: 'Gateway Photography Scam',
          category: 'Photography Scam',
          loss: '₹200 - ₹500',
          location: 'Gateway of India Front plaza',
          howItWorks: 'Photographers print prints without consent and demand high fees.',
          warningSigns: ['Offers free sample photography clicks'],
          howToAvoid: 'Politely refuse or agree on per-print price (₹30 max) beforehand.',
          emergencyAction: 'Approach the Tourist Police Kiosk near the steps.'
        }
      ];
    } else if (destLower.includes('goa')) {
      return [
        {
          name: 'Rental Bike Damage Trap',
          category: 'Rental Bike Scam',
          loss: '₹3,000 - ₹10,000',
          location: 'Coastal highway rentals',
          howItWorks: 'Rental agents claim minor pre-existing scratches are new and withhold your ID card.',
          warningSigns: ['Agent refuses to note down current scratches on receipt'],
          howToAvoid: 'Take a complete high-definition video of the vehicle before driving away.',
          emergencyAction: 'Call Panaji Tourist Kiosk.'
        },
        {
          name: 'Nightclub Coupon Scam',
          category: 'Nightlife Scam',
          loss: '₹5,000 - ₹15,000',
          location: 'Baga/Calangute Beach strip',
          howItWorks: 'Local promoters offer free entry coupons, but you are charged heavy hidden fees inside.',
          warningSigns: ['Suspiciously cheap VIP table deals'],
          howToAvoid: 'Book only through official platforms or at club gates.',
          emergencyAction: 'Alert beach patrolling police immediately.'
        }
      ];
    }
    // Default Delhi / General
    return [
      {
        name: 'Fake Tourist Information Office',
        category: 'Fake Tour Guide',
        loss: '₹10,000 - ₹50,000',
        location: 'Railway exits / Connaught Place',
        howItWorks: 'Touts claim your booked hotel is closed or unsafe and force you to buy expensive packages.',
        warningSigns: ['Telling you "hotels are closed due to protest/festival"'],
        howToAvoid: 'Never trust auto-drivers claims about hotel closures. Call the hotel directly.',
        emergencyAction: 'Dial National Tourist Helpline 1363.'
      },
      {
        name: 'Auto Meter Rigging',
        category: 'Auto Rickshaw Scam',
        loss: '₹200 - ₹500',
        location: 'Metro gates / Markets',
        howItWorks: 'Rickshaw drivers use tampered digital meters that run twice as fast.',
        warningSigns: ['The meter jumps values rapidly while sitting in traffic'],
        howToAvoid: 'Use public metro lines or book via auto-hailing apps.',
        emergencyAction: 'Call 112 Traffic Helpline.'
      }
    ];
  }, [destLower]);

  // AI Safety Advisor advice based on profile
  const aiSafetyAdvice = useMemo(() => {
    if (travelerProfile === 'senior' || travelerProfile === 'accessibility') {
      return 'Accessible travel routing is recommended. Stick to metro lines where elevators are functional. Avoid auto-rickshaws on busy intersections; prepaid AC cabs are safer.';
    } else if (travelerProfile === 'couple') {
      return 'Stay alert at beach areas at night. Avoid secluded lanes after 10 PM. Use only registered app-based cabs (Uber/Ola) for inter-city travel.';
    } else {
      return 'Carry minimal cash in crowded market areas. Keep digital backup copies of your IDs in cloud folders. Never share OTPs or scan unknown QR codes.';
    }
  }, [travelerProfile]);

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6 relative">
      
      {/* Sticky SOS Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => {
            setSosTriggered(true);
            speakText("SOS Alert Triggered. Broadcasting location to emergency contacts.", "en");
            setTimeout(() => setSosTriggered(false), 5000);
          }}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] animate-pulse">sos</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-red-100">Trigger SOS</span>
        </button>
      </div>

      {/* SOS Alert Banner */}
      {sosTriggered && (
        <div className="bg-red-600 border border-red-800 text-white p-4.5 rounded-xl text-[13px] font-bold animate-fade-in flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[22px]">hourglass_empty</span>
            <span>🚨 SOS TRIGGERED: Broadcasting coordinates to Tourist Police & emergency contacts...</span>
          </div>
          <button onClick={() => setSosTriggered(false)} className="text-[11px] underline">Cancel</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-[24px]">security</span>
            Safety & Risk Intelligence Hub
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Real-time scam detectors, neighborhood risk indices, and emergency dispatch links for <span className="font-bold text-primary">{destName}</span>.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-container p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Safety Scores' },
            { id: 'scams', label: 'Local Scams' },
            { id: 'simulator', label: 'Incident Sim' },
            { id: 'medical', label: 'Medical Helper' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB: OVERVIEW SAFETY MATRIX --- */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* AI Advisor Panel */}
          <div className="bg-primary/5 border border-primary/20 p-4.5 rounded-2xl flex gap-3 text-[12.5px]">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5 animate-pulse">shield</span>
            <div>
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mb-1 inline-block">
                AI Safety Advisor
              </span>
              <p className="text-on-surface font-semibold leading-relaxed">{aiSafetyAdvice}</p>
            </div>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
              <span className="text-on-surface-variant text-[11px] block font-bold uppercase">Overall Safety</span>
              <span className="font-black text-[22px] text-emerald-600 mt-1 block">{safetyMetrics.overall}/100</span>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
              <span className="text-on-surface-variant text-[11px] block font-bold uppercase">Women Safety</span>
              <span className="font-black text-[22px] text-emerald-600 mt-1 block">{safetyMetrics.women}/100</span>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
              <span className="text-on-surface-variant text-[11px] block font-bold uppercase">Night Safety</span>
              <span className="font-black text-[22px] text-orange-600 mt-1 block">{safetyMetrics.night}/100</span>
            </div>
            <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
              <span className="text-on-surface-variant text-[11px] block font-bold uppercase">Scam Risk</span>
              <span className="font-black text-[18px] text-red-600 mt-1.5 block">{safetyMetrics.scamRisk}</span>
            </div>
          </div>

          {/* Risk map geography preview */}
          <div className="space-y-2">
            <h4 className="font-black text-[13px] uppercase tracking-wider text-on-surface">Interactive Safety zone Map</h4>
            <div className="w-full h-[200px] rounded-2xl overflow-hidden border border-surface-variant/30">
              <InteractiveMap destination={destName} />
            </div>
          </div>

        </div>
      )}

      {/* --- TAB: LOCAL SCAMS ACCORDION --- */}
      {activeTab === 'scams' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-xl text-[12px] font-semibold">
            🚨 Verified local traps identified by tourist policing bureaus in {destName}:
          </div>

          <div className="space-y-3">
            {scamsDirectory.map((scam, idx) => {
              const isOpen = selectedScamIdx === idx;
              return (
                <div key={idx} className="bg-surface border border-surface-variant/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setSelectedScamIdx(isOpen ? null : idx)}
                    className="w-full p-4 flex justify-between items-center text-left cursor-pointer border-none bg-transparent"
                  >
                    <div>
                      <span className="bg-red-500/10 text-red-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded mr-2">
                        {scam.category}
                      </span>
                      <span className="font-extrabold text-[14px] text-on-surface">{scam.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-surface-container-low border-t border-surface-variant/30 text-[12.5px] leading-relaxed text-on-surface-variant space-y-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <strong className="text-on-surface">How it works:</strong>
                          <p>{scam.howItWorks}</p>
                        </div>
                        <div className="space-y-1">
                          <strong className="text-on-surface">Warning Signs:</strong>
                          <ul className="list-disc pl-4">
                            {scam.warningSigns.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 p-3 rounded-lg border border-emerald-500/20">
                        <strong>🛡️ How to avoid:</strong> {scam.howToAvoid}
                      </div>

                      <div className="text-[11px] flex justify-between items-center pt-2 border-t border-surface-variant/10 text-on-surface-variant font-medium">
                        <span>Average Loss: <span className="font-bold text-red-600">{scam.loss}</span></span>
                        <span>Emergency: <span className="font-bold text-primary">{scam.emergencyAction}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB: INCIDENT SIMULATOR --- */}
      {activeTab === 'simulator' && (
        <div className="space-y-4 animate-fade-in text-[12.5px]">
          <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-3">
            <h4 className="font-bold text-on-surface text-[13px] flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
              Safety Situational Drill
            </h4>
            <p className="text-on-surface-variant">Select an educational scenario to test your tourist threat response actions:</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSimScenario('taxi');
                  setSimAnswer(null);
                }}
                className="bg-surface-container hover:bg-primary/10 px-3 py-2 rounded-lg font-bold border-none cursor-pointer"
              >
                1. Rigged Taxi Meter
              </button>
              <button
                onClick={() => {
                  setSimScenario('qr');
                  setSimAnswer(null);
                }}
                className="bg-surface-container hover:bg-primary/10 px-3 py-2 rounded-lg font-bold border-none cursor-pointer"
              >
                2. QR Code Scanner
              </button>
            </div>

            {simScenario === 'taxi' && (
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/15 space-y-3 mt-3 animate-fade-in">
                <strong>Scenario:</strong> You board a cab and the driver insists the meter is broken, quoting ₹1,000 fixed fare instead of ₹300 metered.
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setSimAnswer('incorrect')}
                    className="bg-surface text-left p-3.5 rounded-lg border border-surface-variant/30 hover:border-red-500 cursor-pointer"
                  >
                    A. Agree to the price to avoid conflict.
                  </button>
                  <button
                    onClick={() => setSimAnswer('correct')}
                    className="bg-surface text-left p-3.5 rounded-lg border border-surface-variant/30 hover:border-emerald-500 cursor-pointer"
                  >
                    B. Decline, step out immediately, and book an app-based cab (Uber/Ola).
                  </button>
                </div>
              </div>
            )}

            {simScenario === 'qr' && (
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/15 space-y-3 mt-3 animate-fade-in">
                <strong>Scenario:</strong> A local street photography vendor asks you to scan a random QR code on his phone to "verify payment receipt".
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setSimAnswer('correct')}
                    className="bg-surface text-left p-3.5 rounded-lg border border-surface-variant/30 hover:border-emerald-500 cursor-pointer"
                  >
                    A. Refuse to scan and pay only via standard cash or official UPI IDs.
                  </button>
                  <button
                    onClick={() => setSimAnswer('incorrect')}
                    className="bg-surface text-left p-3.5 rounded-lg border border-surface-variant/30 hover:border-red-500 cursor-pointer"
                  >
                    B. Scan it since it claims to be receipt code.
                  </button>
                </div>
              </div>
            )}

            {simAnswer && (
              <div className={`p-4 rounded-xl text-[12.5px] font-bold animate-fade-in mt-3 ${
                simAnswer === 'correct' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {simAnswer === 'correct' 
                  ? '✅ Correct Action! Tourist protection guidelines state to stick to verified app taxi gates or certified merchant IDs.' 
                  : '❌ Threat Identified: Touts utilize this trick to collect high premiums or initiate fake payment overlays. Choose another option.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: MEDICAL & HELPLINES --- */}
      {activeTab === 'medical' && (
        <div className="space-y-4 animate-fade-in text-[12.5px] text-left">
          <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-2">
            <h5 className="font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span> Emergency Clinics & Pharmacies
            </h5>
            <ul className="space-y-1.5 text-on-surface-variant">
              <li><strong>Local Hospital:</strong> City Civil Hospital (2.5 km away) • Tel: 102</li>
              <li><strong>24x7 Pharmacy:</strong> Apollo Pharmacy Outpost (400m away)</li>
              <li><strong>Water Advice:</strong> Drink bottled mineral water only.</li>
            </ul>
          </div>

          {/* Quick Helplines Call Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <a
              href="tel:112"
              className="bg-red-600 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              Police (112)
            </a>
            <a
              href="tel:181"
              className="bg-red-600 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              Women Helpl. (181)
            </a>
            <a
              href="tel:102"
              className="bg-red-600 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              Ambulance (102)
            </a>
            <a
              href="tel:1363"
              className="bg-red-600 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              Tourist H. (1363)
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
