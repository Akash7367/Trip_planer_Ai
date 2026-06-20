'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ItineraryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-16 min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-sm transition-all duration-300 ease-in-out">
        <div className="max-w-container-max mx-auto px-margin-desktop md:px-margin-mobile flex justify-between items-center h-16">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">AeroGuide</Link>
          <div className="hidden md:flex gap-gutter items-center">
            <Link href="/discover" className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">Discover</Link>
            <Link href="/dashboard" className="text-primary border-b-2 border-primary font-bold pb-1">My Trips</Link>
            <Link href="/profile" className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80">Profile</Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 border border-outline rounded-full hover:bg-surface-container font-label-md text-label-md flex items-center gap-1 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">share</span> Share
            </button>
            <button 
              onClick={() => router.push('/booking-confirmation')}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-80 transition-opacity"
            >
              Book Itinerary
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-container-max mx-auto px-margin-desktop py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 relative flex-grow w-full">
        {/* Left Column: Itinerary */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="font-display-lg text-display-lg text-on-surface">Kyoto Exploration</h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_today</span> Oct 12 - Oct 18</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">group</span> 2 Travelers</span>
            </div>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 bg-surface-container rounded-full font-label-md text-label-md text-on-surface-variant">Culture</span>
              <span className="px-3 py-1 bg-surface-container rounded-full font-label-md text-label-md text-on-surface-variant">Food</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full font-label-md text-label-md text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Optimized
              </span>
            </div>
          </div>
          
          {/* Day Selector */}
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            <button 
              onClick={() => setActiveDay(1)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-label-md text-label-md transition-all ${activeDay === 1 ? 'bg-primary text-on-primary shadow-[0_4px_20px_rgba(0,88,188,0.15)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
            >
              Day 1<br/><span className="font-normal opacity-80">Oct 12</span>
            </button>
            <button 
              onClick={() => setActiveDay(2)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-label-md text-label-md transition-all ${activeDay === 2 ? 'bg-primary text-on-primary shadow-[0_4px_20px_rgba(0,88,188,0.15)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
            >
              Day 2<br/><span className="font-normal opacity-80">Oct 13</span>
            </button>
            <button 
              onClick={() => setActiveDay(3)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-label-md text-label-md transition-all ${activeDay === 3 ? 'bg-primary text-on-primary shadow-[0_4px_20px_rgba(0,88,188,0.15)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
            >
              Day 3<br/><span className="font-normal opacity-80">Oct 14</span>
            </button>
          </div>

          {/* Timeline */}
          {activeDay === 1 && (
            <div className="relative pl-6 border-l-2 border-surface-container space-y-12 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-[-2px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-transparent before:h-1/3">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface shadow-sm"></div>
                <div className="text-primary font-label-md text-label-md mb-2">09:00 AM</div>
                <div className="bg-surface-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-variant/50 hover:border-primary/10 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Fushimi Inari Shrine</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Iconic Shinto shrine with thousands of vermilion torii gates.</p>
                    </div>
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                  <div className="h-48 rounded-xl overflow-hidden mb-4 relative">
                    <img 
                      alt="Fushimi Inari" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbFQzTbdSt5HSE58EwUWG9JKeSXv7iVwiESKfufyTbUemOXiP83EHx1pfGUSwuAIdqZe4g4ObuR_Kc0nHmKaay-3C7ukiEXz9jomZgfqZqZrcSwPOVvZnaqFjuaiYEOqZATP1kRYDvRSs_Fa5h9SsrNRoQKyTP1UQJ-aS-mNGoK-CGwrHdjosExPikpw2yRxp5sGyXhd_cLFqgBzxuMxkp301gxqi7kXPX1CcfrSBFUb97Yf02N-aSkojcRLocEOw0EfC-m1a9vfXu"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low p-3 rounded-lg">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">directions_walk</span> 2.5 hours</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">train</span> 15m from hotel</span>
                  </div>
                </div>
              </div>
              
              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-surface-container border-4 border-surface shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-container"></div>
                </div>
                <div className="text-on-surface-variant font-label-md text-label-md mb-2 flex items-center gap-2">
                  12:30 PM 
                  <span className="ai-sparkle flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Suggestion
                  </span>
                </div>
                <div className="bg-surface-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Lunch at Nishiki Market</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Based on your preference for local street food.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-error/10 hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors"><span className="material-symbols-outlined text-[18px]">check</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDay !== 1 && (
            <div className="p-8 text-center text-on-surface-variant bg-surface-lowest rounded-2xl border border-surface-variant/50">
              <span className="material-symbols-outlined text-4xl mb-4 text-outline">calendar_today</span>
              <p>Itinerary for Day {activeDay} will load shortly. Explore cultural spots and local transport options.</p>
            </div>
          )}
        </div>

        {/* Right Column: Map & Context */}
        <div className="lg:col-span-4 space-y-6">
          {/* Map Card */}
          <div className="bg-surface-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-surface-variant/50 sticky top-24">
            <div className="h-64 relative">
              <img 
                alt="Map of Kyoto" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPYFQsLy3dHAygycDYWbDMIkA3os7Bs3r0nIknHeCjkdmjUpEX4wCB_rEW3P8qzFHtiH2Di0W5fP0CqsbsIa5RDTmz16kuLjw2_ANAigtt0eRU5AaPOtYW84V80eASEy2Fu1PcSSoJf7QzLhZZKnXnCKRb6Vhmbs9VJb-o7P1Uc_pKaFFF3VLZs3GPQXyP2kfTqmN0frRblurzaZckOPnD_M6CiILPDXwx69WvcLah1rLcUuQaYUqlMLDkXT7yStXKH8dbNE4OG5J5"
              />
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-xl flex justify-between items-center shadow-sm">
                <span className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">location_on</span> Kyoto City
                </span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-surface text-on-surface shadow-sm flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">add</span></button>
                  <button className="w-8 h-8 rounded-lg bg-surface text-on-surface shadow-sm flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                </div>
              </div>
            </div>
            {/* Weather Context */}
            <div className="p-6 border-t border-surface-variant/30">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Today's Context</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
                  </div>
                  <div>
                    <div className="font-headline-sm text-headline-sm text-on-surface">24°C</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Sunny & Clear</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Light jacket recommended</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container mt-20">
        <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div>
            <div className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">AeroGuide</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 AeroGuide AI. Your intuitive travel companion.</p>
          </div>
          <div className="col-span-1 md:col-span-3 flex flex-wrap gap-6 justify-end items-center text-body-sm font-body-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors duration-200" href="#">About Us</Link>
            <Link className="hover:text-primary transition-colors duration-200" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors duration-200" href="#">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors duration-200" href="#">Help Center</Link>
            <Link className="hover:text-primary transition-colors duration-200" href="#">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Share Modal Dialog Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm">
          <div className="bg-surface-lowest w-full max-w-md mx-4 rounded-2xl shadow-xl overflow-hidden relative border border-surface-variant">
            {/* Modal Header */}
            <div className="p-6 border-b border-surface-variant/30 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Share your trip</h2>
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant" 
                onClick={() => setShowShareModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Copy Link Section */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Copy Link</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-surface-container-low border border-surface-variant/50 rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none" 
                    readOnly 
                    type="text" 
                    value="aeroguide.ai/t/kyoto-2026"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("aeroguide.ai/t/kyoto-2026");
                      alert("Link copied to clipboard!");
                    }}
                    className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-80 transition-opacity"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {/* Social Sharing */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Share via</label>
                <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-primary">
                    <span className="material-symbols-outlined">chat</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-primary">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-primary">
                    <span className="material-symbols-outlined">public</span>
                  </button>
                </div>
              </div>
              
              {/* Permissions */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Permissions</label>
                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <select className="w-full bg-surface-container-low border border-surface-variant/50 rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface outline-none appearance-none focus:border-primary">
                      <option value="view">Can view</option>
                      <option value="comment">Can comment</option>
                      <option value="edit">Can edit</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant opacity-80">Decide what your travel companions can do.</p>
                </div>
              </div>
              
              {/* Invite by Email */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Invite by Email</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-surface-lowest border border-surface-variant/50 rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary outline-none" 
                    placeholder="Enter email address" 
                    type="email"
                  />
                  <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-80 transition-opacity">Invite</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
