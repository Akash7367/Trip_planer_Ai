'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PlanTripContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [budget, setBudget] = useState('Moderate');

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setDestination(promptParam);
    }
  }, [searchParams]);

  const vibesList = [
    'Culture & History',
    'Food & Dining',
    'Nature & Outdoors',
    'Relaxation',
    'Adventure',
    'Nightlife',
    'Shopping',
    'Art & Museums'
  ];

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      // Step 4: Generating Magic
      setStep(4);
      // Simulate loading and redirect to itinerary page after 3 seconds
      setTimeout(() => {
        router.push('/itinerary/kyoto-trip-123');
      }, 3500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getProgressWidth = () => {
    return `${(step - 1) * 33.33}%`;
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* Header (Simplified for Onboarding Flow) */}
      <header className="w-full bg-surface/85 backdrop-blur-xl border-b border-surface-variant sticky top-0 z-50 py-4">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
            AeroGuide
          </Link>
          <button 
            onClick={() => router.push('/')} 
            className="text-on-surface-variant hover:text-primary transition-colors text-body-sm font-body-sm"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto relative overflow-hidden">
        {/* Progress Indicator */}
        <div className="w-full max-w-2xl mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container -z-10 rounded-full transform -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-out" 
            style={{ width: getProgressWidth() }}
          ></div>
          
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md transition-colors duration-300 ${step >= 1 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}>1</div>
            <span className={`font-label-md text-label-md ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Destination</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md transition-colors duration-300 ${step >= 2 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}>2</div>
            <span className={`font-label-md text-label-md ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Dates</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md transition-colors duration-300 ${step >= 3 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}>3</div>
            <span className={`font-label-md text-label-md ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>Vibe</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md transition-colors duration-300 ${step >= 4 ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-variant text-on-surface-variant'}`}>4</div>
            <span className={`font-label-md text-label-md ${step >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>Magic</span>
          </div>
        </div>

        <div className="w-full max-w-2xl relative min-h-[400px]">
          {/* Step 1: Destination */}
          {step === 1 && (
            <div className="w-full bg-surface rounded-xl shadow-sm p-8 md:p-12 border border-surface-container">
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">Where to?</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 font-normal">Tell us your dream destination, or let our AI suggest one.</p>
              
              <div className="relative w-full mb-8">
                <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">search</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface placeholder-outline-variant shadow-sm outline-none" 
                  placeholder="e.g. Kyoto, Japan or 'Somewhere warm'" 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <button 
                  onClick={() => setDestination("Kyoto, Japan")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["Tokyo", "Paris", "Bali", "New York"].map((city) => (
                  <button 
                    key={city}
                    onClick={() => setDestination(city)}
                    className={`py-2 px-4 rounded-full font-label-md text-label-md border transition-colors ${destination === city ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-surface-variant'}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!destination.trim()}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 2 && (
            <div className="w-full bg-surface rounded-xl shadow-sm p-8 md:p-12 border border-surface-container">
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">When are you going?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 font-normal">Select your travel dates, or choose a rough timeline.</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">calendar_month</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface placeholder-outline-variant shadow-sm outline-none" 
                    placeholder="Start Date" 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">event</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface placeholder-outline-variant shadow-sm outline-none" 
                    placeholder="End Date" 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-surface-variant flex-grow"></div>
                <span className="font-label-md text-label-md text-outline">OR</span>
                <div className="h-px bg-surface-variant flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { name: 'Summer', icon: 'wb_sunny' },
                  { name: 'Winter', icon: 'ac_unit' },
                  { name: 'Any Weekend', icon: 'event_upcoming' },
                  { name: 'Decide for me', icon: 'magic_button' }
                ].map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => {
                      setStartDate('2026-07-01');
                      setEndDate('2026-07-07');
                    }}
                    className="py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md border border-surface-variant transition-colors flex flex-col items-center gap-2"
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={handleBack}
                  className="bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Vibe */}
          {step === 3 && (
            <div className="w-full bg-surface rounded-xl shadow-sm p-8 md:p-12 border border-surface-container">
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">What's the vibe?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 font-normal">Select interests to help our AI craft your perfect itinerary.</p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {vibesList.map((vibe) => {
                  const isActive = selectedVibes.includes(vibe);
                  return (
                    <button 
                      key={vibe}
                      onClick={() => toggleVibe(vibe)}
                      className={`py-2 px-4 rounded-full border font-label-md text-label-md transition-all ${isActive ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-low text-on-surface-variant border-surface-variant hover:bg-surface-container'}`}
                    >
                      {vibe}
                    </button>
                  );
                })}
              </div>
              
              <div className="mb-8">
                <label className="font-headline-sm text-headline-sm text-on-surface block mb-4">Budget Level</label>
                <div className="flex gap-4">
                  {['Budget', 'Moderate', 'Luxury'].map((level) => (
                    <label key={level} className="flex-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="budget" 
                        checked={budget === level}
                        onChange={() => setBudget(level)}
                        className="peer sr-only"
                      />
                      <div className="py-3 px-4 rounded-xl bg-surface-container-low border border-surface-variant text-center font-label-md text-on-surface-variant peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={handleBack}
                  className="bg-surface-container hover:bg-surface-variant text-on-surface font-label-md text-label-md py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Generating Magic */}
          {step === 4 && (
            <div className="w-full bg-surface rounded-xl shadow-sm p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px] border border-surface-container">
              <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
                <span className="material-symbols-outlined text-primary text-5xl animate-pulse">auto_awesome</span>
              </div>
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">Crafting Your Journey...</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-2">Our AI is analyzing flight patterns, hotel availability, and local secrets.</p>
              
              <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="font-body-md text-body-md text-left">Filtering optimal dates</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  <span className="font-body-md text-body-md text-left">Curating local experiences</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-primary">hourglass_empty</span>
                  <span className="font-body-md text-body-md text-left">Finding boutique stays</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PlanTripPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading planner...</div>}>
      <PlanTripContent />
    </Suspense>
  );
}
