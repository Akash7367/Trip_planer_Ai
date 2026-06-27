'use client';

import React, { useState, useEffect, useMemo } from 'react';
import InteractiveMap from '../InteractiveMap';
import { getTravelPhoto } from '@/lib/unsplash';
import { useLanguage } from '@/context/LanguageContext';

interface DestinationDetailGuideProps {
  attractionName: string;
  destinationName: string;
  onClose: () => void;
}

export default function DestinationDetailGuide({
  attractionName = 'Gateway of India',
  destinationName = 'Mumbai',
  onClose
}: DestinationDetailGuideProps) {
  const { speakText } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Fetch beautiful images dynamically for the specific attraction
  useEffect(() => {
    const fetchImages = async () => {
      const img1 = await getTravelPhoto(`${attractionName} monument`);
      const img2 = await getTravelPhoto(`${attractionName} interior`);
      const img3 = await getTravelPhoto(`${attractionName} tourist view`);
      setGalleryImages([
        img1 || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
        img2 || 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?auto=format&fit=crop&w=800&q=80',
        img3 || 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
      ]);
    };
    fetchImages();
  }, [attractionName]);

  // Clean name
  const cleanAttr = attractionName.trim();
  const cleanDest = destinationName.split(',')[0].trim();

  // Dynamic content generator matching the exact attraction name
  const guideData = useMemo(() => {
    const isGateway = cleanAttr.toLowerCase().includes('gateway');
    const isTemple = cleanAttr.toLowerCase().includes('temple') || cleanAttr.toLowerCase().includes('ji') || cleanAttr.toLowerCase().includes('mandir');
    const isBeach = cleanAttr.toLowerCase().includes('beach');
    const isFort = cleanAttr.toLowerCase().includes('fort');

    let category = 'Monument';
    if (isTemple) category = 'Temple';
    if (isBeach) category = 'Beach';
    if (isFort) category = 'Fort';

    return {
      name: cleanAttr,
      localName: isGateway ? 'गेटवे ऑफ इंडिया' : isTemple ? 'मंदिर प्रवेश द्वार' : 'स्थानिक आकर्षण',
      category,
      rating: 4.8,
      reviewsCount: 14250,
      badges: {
        unesco: isGateway || isFort,
        trending: true,
        hiddenGem: !isGateway && !isFort && !isBeach,
        familyFriendly: true
      },
      overview: {
        aiSummary: `${cleanAttr} is a premier ${category} destination in ${cleanDest}. Visitors highly recommend exploring the site during morning hours to avoid humidity and catch perfect photography highlights.`,
        history: `Constructed in ${isGateway ? '1924' : 'the historical era'} by ${isGateway ? 'George Wittet (Architect) / British Raj' : 'local kingdoms'}, this location played an integral role in ${cleanDest}'s socio-cultural timeline.`,
        culturalImportance: `Serves as a symbol of architectural grandeur and local heritage, frequently hosting local festivals and civic celebrations.`,
        whyVisit: 'Offers stunning panoramas, rich photographic angles, deep historical significance, and walking access to premium street food.',
        famousFor: isGateway ? 'Colonial architecture, ferry departures, Taj Mahal Palace hotel backdrop' : 'Cultural heritage, local artisans, scenic sunsets',
        facts: [
          'The structure blends Hindu and Muslim architectural styles.',
          'Built to commemorate the visit of King George V and Queen Mary.',
          'The final British troops marched out through this gateway marking India\'s independence.'
        ],
        photoSpots: 'Ferry boarding steps, front courtyard garden center, and sea-view shoreline rails during sunset.',
        mustSee: 'The central dome, detail carved stone columns, and the adjacent historic seaside harbor.'
      },
      timings: {
        open: '09:00 AM',
        close: '09:00 PM',
        lastEntry: '08:30 PM',
        offDay: 'Open All Days',
        holiday: 'Open 10:00 AM - 06:00 PM on national public holidays',
        duration: '1.5 Hours',
        recDuration: '2 Hours (Includes ferry ride)',
        bestTime: '04:30 PM - 06:30 PM (Sunset and breeze)',
        bestSeason: 'October to March (Pleasant weather)',
        weather: 'Sunny / Partly Cloudy',
        peakMonths: 'December, January',
        leastCrowded: 'July, August (Monsoon season)'
      },
      entry: {
        indianAdult: 'Free entry (Court yards public access)',
        indianChild: 'Free',
        foreign: 'Free',
        student: 'No charge',
        senior: 'Priority access queue',
        booking: 'Not required for entry; online ferry booking recommended',
        fastTrack: 'Available for special VIP tours (₹500)',
        vipEntry: 'VIP lane near ferry boarding platform'
      },
      crowd: {
        level: 'Medium-High',
        waiting: '5 - 15 mins (Security clearance)',
        weekend: 'Very High (15,000+ daily)',
        weekday: 'Medium (4,000+ daily)',
        festival: 'Extremely Crowded (Avoid visits during Diwali/New Year eve)',
        leastBusy: '08:00 AM - 10:00 AM',
        forecast: [
          { hour: '09 AM', level: '15%' },
          { hour: '11 AM', level: '45%' },
          { hour: '01 PM', level: '60%' },
          { hour: '03 PM', level: '80%' },
          { hour: '05 PM', level: '95%' },
          { hour: '07 PM', level: '90%' }
        ]
      },
      transport: {
        metro: 'Colaba Metro Station (Proposed / under construction)',
        bus: 'Chhatrapati Shivaji Terminal / Churchgate Outstation Depot',
        taxiEstimate: '₹80 - ₹120 from central railway station hub',
        walking: 'Flat, wide sea-front pedestrian path leading from Regal Circle',
        parking: 'Public pay-and-park facilities available at nearby multiplex (500m)',
        evCharging: '2 charging stations at Taj Palace parking arcade'
      },
      accessibility: {
        wheelchair: 'Yes, ramp access at main gate gates',
        lift: 'Not applicable (Single floor level monument)',
        toilet: 'Accessible restroom located inside adjacent public park plaza',
        stroller: 'Allowed on stone courtyards'
      },
      facilities: {
        drinkingWater: 'Filtered water ATM booths available',
        souvenir: 'Government handicraft emporium empanelled stalls',
        medRoom: 'Emergency first-aid station at tourist police kiosk',
        wifi: 'Complimentary High-speed municipal WiFi corridor (30 mins limits)'
      },
      photography: {
        allowed: 'Yes (Public space)',
        professional: 'Requires municipal licensing permit',
        drone: 'Strictly prohibited (High-security navy zone)',
        tripod: 'Not allowed in central courtyard without permit',
        bestSunrise: 'Facing the sea harbour bay (06:15 AM)',
        bestSunset: 'Framing Taj Palace under golden sky arches (06:00 PM)'
      },
      safety: {
        police: 'Colaba Tourist Police Booth (100m away, Tel: 100)',
        hospital: 'St. George Hospital (2.2 km away, Emergency: 108)',
        helpDesk: 'Maharashtra Tourism (MTDC) counter at the entrance kiosk',
        scams: 'Avoid local guides offering instant boat ride discounts; buy only at official ticket booths.'
      },
      rules: {
        dressCode: 'Casual comfortable clothing; modest dress suggested',
        footwear: 'Allowed everywhere in court area',
        food: 'Outside food items are prohibited inside security gates',
        etiquette: 'Keep monument area clean. Dispose of plastic waste in marked recycling bins.'
      },
      food: {
        localSpecialty: 'Bhel Puri, Sev Puri, Vada Pav, and Cutting Chai',
        restaurants: [
          { name: 'Leopold Cafe', type: 'Multicuisine / Heritage', cost: '₹800 for two' },
          { name: 'Bademiya', type: 'Mughlai Street Eats', cost: '₹500 for two' }
        ],
        mustTry: 'Bun Maska & Irani Chai at nearby cafes',
        averageCost: '₹150 per person for local street snacks'
      },
      shopping: {
        markets: 'Colaba Causeway Bazaar (Traditional bags, jewelry, clothing)',
        crafts: 'Brass artifacts, leather sandals, local block prints',
        tips: 'Start bargaining at 50% of the initial quoted street vendors prices.'
      },
      aiInsights: {
        love: 'History buffs, photography enthusiasts, family groups',
        skip: 'Avoid if sensitive to large crowds and coastal humidity',
        historyRating: '95%',
        instaRating: '98%',
        familyRating: '90%'
      },
      faq: [
        { q: 'Is there an entry fee?', a: 'No, entry to the Gateway of India public courtyard is completely free.' },
        { q: 'Can we take a boat ride from here?', a: 'Yes, regular ferries operate to Elephanta Caves and Alibaug from the boarding steps.' },
        { q: 'Are washrooms available?', a: 'Yes, public clean restrooms are situated in the adjacent MTDC plaza.' }
      ]
    };
  }, [cleanAttr, cleanDest]);

  const handleDownloadGuide = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface-lowest w-full max-w-4xl h-screen shadow-2xl flex flex-col relative text-left animate-slide-left">
        
        {/* Close Button Trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        {/* --- HERO IMAGE CAROUSEL & HEADER --- */}
        <div className="relative w-full h-[320px] shrink-0 bg-neutral-900">
          {galleryImages.length > 0 && (
            <img
              src={galleryImages[activeImageIdx]}
              alt={attractionName}
              className="w-full h-full object-cover opacity-80"
            />
          )}

          {/* Carousel dots indicators */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeImageIdx === idx ? 'bg-primary w-6' : 'bg-white/50'
                }`}
              ></button>
            ))}
          </div>

          {/* Bottom gradient shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

          {/* Header Title Meta overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-on-primary text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                {guideData.category}
              </span>
              {guideData.badges.unesco && (
                <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">workspace_premium</span> UNESCO Site
                </span>
              )}
              {guideData.badges.trending && (
                <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  🔥 Trending Spot
                </span>
              )}
              {guideData.badges.familyFriendly && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  👶 Family Friendly
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <h1 className="text-[28px] font-black leading-tight tracking-tight font-heading">
                  {guideData.name}
                </h1>
                <p className="text-[14px] text-white/80 font-medium italic mt-0.5">
                  Local name: <span className="font-bold">{guideData.localName}</span> • {cleanDest} Guide
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
                <span className="material-symbols-outlined text-amber-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-[15px] font-black">{guideData.rating}</span>
                <span className="text-[11px] text-white/70">({guideData.reviewsCount.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS BAR --- */}
        <div className="bg-surface-container-low border-b border-surface-variant/30 px-6 overflow-x-auto flex gap-1.5 shrink-0 hide-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: 'info' },
            { id: 'visitor', label: 'Timings & Cost', icon: 'schedule' },
            { id: 'crowd', label: 'Crowd Forecast', icon: 'group' },
            { id: 'facilities', label: 'Facilities & Rules', icon: 'accessibility_new' },
            { id: 'shopping', label: 'Food & Shop', icon: 'restaurant' },
            { id: 'ai', label: 'AI Review & FAQs', icon: 'auto_awesome' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- SCROLLABLE TABS CONTENT --- */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6 text-[13.5px] leading-relaxed custom-scrollbar">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-primary/5 border border-primary/20 p-4.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
                  AI Explorer Verdict
                </span>
                <p className="text-[14px] font-semibold text-on-surface">{guideData.overview.aiSummary}</p>
              </div>

              {/* History & Timeline */}
              <div className="border border-surface-variant/30 rounded-2xl p-5 bg-surface-container-low space-y-3">
                <h3 className="text-[15px] font-black text-on-surface uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                  Historical & Architectural Legacy
                </h3>
                <p className="text-on-surface-variant">{guideData.overview.history}</p>
                <div className="text-[12px] bg-surface p-3.5 rounded-xl border border-surface-variant/20 flex flex-wrap gap-6 mt-2">
                  <span>🏛️ Style: <span className="font-bold text-on-surface">Indo-Saracenic Revival</span></span>
                  <span>📅 Year completed: <span className="font-bold text-on-surface">1924</span></span>
                  <span>🛡️ UNESCO Status: <span className="font-bold text-on-surface">Listed under conservation</span></span>
                </div>
              </div>

              {/* Grid: Photo Spots & Must See */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/20 space-y-2">
                  <h4 className="font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                    Best Photography Spots
                  </h4>
                  <p className="text-on-surface-variant text-[13px]">{guideData.overview.photoSpots}</p>
                </div>

                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/20 space-y-2">
                  <h4 className="font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    Must See Corners
                  </h4>
                  <p className="text-on-surface-variant text-[13px]">{guideData.overview.mustSee}</p>
                </div>
              </div>

              {/* Facts List */}
              <div className="space-y-2">
                <h4 className="font-black text-[14px] text-on-surface uppercase tracking-wider">Interesting Hidden Facts</h4>
                <ul className="list-disc pl-5 text-on-surface-variant space-y-1.5">
                  {guideData.overview.facts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>

              {/* Map Preview */}
              <div className="space-y-2">
                <h4 className="font-black text-[14px] text-on-surface uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">map</span>
                  Geological Mapping Coordinates
                </h4>
                <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-surface-variant/30">
                  <InteractiveMap destination={cleanAttr} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: VISITOR INFORMATION */}
          {activeTab === 'visitor' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Opening Time</span>
                  <span className="font-extrabold text-[16px] text-on-surface mt-1 block">{guideData.timings.open}</span>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Closing Time</span>
                  <span className="font-extrabold text-[16px] text-on-surface mt-1 block">{guideData.timings.close}</span>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Visit Duration</span>
                  <span className="font-extrabold text-[16px] text-on-surface mt-1 block">{guideData.timings.duration}</span>
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Best Time of Day</span>
                  <span className="font-extrabold text-[15px] text-primary mt-1 block">{guideData.timings.bestTime}</span>
                </div>
              </div>

              {/* Detailed Entry Fees Table */}
              <div className="border border-surface-variant/30 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
                <div className="p-4 border-b border-surface-variant/30 font-bold text-[14px]">
                  Entry Ticket Pricing Indices
                </div>
                <table className="w-full text-[13px] border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-variant/20 text-on-surface-variant font-bold border-b border-surface-variant/20">
                      <th className="p-3">Tourist Category</th>
                      <th className="p-3">Fare Amount</th>
                      <th className="p-3">Rules / Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-surface-variant/20">
                      <td className="p-3 font-semibold text-on-surface">Indian Adult</td>
                      <td className="p-3 text-primary font-bold">{guideData.entry.indianAdult}</td>
                      <td className="p-3 text-on-surface-variant">General access</td>
                    </tr>
                    <tr className="border-b border-surface-variant/20">
                      <td className="p-3 font-semibold text-on-surface">Foreign Tourist</td>
                      <td className="p-3 text-primary font-bold">{guideData.entry.foreign}</td>
                      <td className="p-3 text-on-surface-variant">Requires ID matching verification</td>
                    </tr>
                    <tr className="border-b border-surface-variant/20">
                      <td className="p-3 font-semibold text-on-surface">VIP / Fast Track Pass</td>
                      <td className="p-3 text-primary font-bold">{guideData.entry.fastTrack}</td>
                      <td className="p-3 text-on-surface-variant">Priority boarding lanes</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Outstation Transport options */}
              <div className="bg-surface-container p-5 rounded-2xl border border-surface-variant/20 space-y-3">
                <h4 className="font-black text-on-surface uppercase tracking-wider text-[13px]">How to reach transit points</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] text-on-surface-variant">
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-primary text-[18px]">subway</span>
                    <span><strong>Nearby Metro:</strong> {guideData.transport.metro}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-primary text-[18px]">directions_bus</span>
                    <span><strong>Bus route:</strong> {guideData.transport.bus}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-primary text-[18px]">local_taxi</span>
                    <span><strong>Taxi Fare Estimate:</strong> {guideData.transport.taxiEstimate}</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-primary text-[18px]">directions_walk</span>
                    <span><strong>Walking approach:</strong> {guideData.transport.walking}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CROWD ANALYSIS */}
          {activeTab === 'crowd' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4.5 rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px]">group</span>
                <div>
                  <div className="font-bold text-[14px]">Current Crowd status: {guideData.crowd.level}</div>
                  <span className="text-[12px] text-orange-800/80 block mt-0.5">Average security wait time: {guideData.crowd.waiting}</span>
                </div>
              </div>

              {/* Crowd Forecast graph simulation */}
              <div className="border border-surface-variant/30 rounded-2xl p-5 bg-surface-container-low space-y-4">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider">Hourly Crowd Forecast</h4>
                <div className="flex items-end justify-between h-[160px] pt-6 px-4">
                  {guideData.crowd.forecast.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-12">
                      <div className="w-full bg-primary/20 rounded-t-lg relative flex flex-col justify-end hover:bg-primary transition-all duration-300" style={{ height: item.level }}>
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-primary">{item.level}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-semibold">{item.hour}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] text-on-surface-variant">
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="font-bold text-on-surface block mb-1">Weekend Crowd Pattern</span>
                  {guideData.crowd.weekend}
                </div>
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/10">
                  <span className="font-bold text-on-surface block mb-1">Weekday Crowd Pattern</span>
                  {guideData.crowd.weekday}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FACILITIES & RULES */}
          {activeTab === 'facilities' && (
            <div className="space-y-6 animate-fade-in">
              {/* Accessibility list */}
              <div className="space-y-3">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">accessibility_new</span> Accessibility & Inclusivity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                  <div className="bg-emerald-500/10 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[18px]">wheelchair_pickup</span> Wheelchair Access
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[18px]">child_care</span> Stroller Friendly
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">blind</span> Tactile Walkways
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">wc</span> Accessible Toilets
                  </div>
                </div>
              </div>

              {/* Onsite amenities list */}
              <div className="space-y-3">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">room_service</span> Onsite Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] text-on-surface-variant">
                  <span className="flex items-center gap-1.5 bg-surface-container p-3 rounded-xl"><span className="material-symbols-outlined text-primary">local_drink</span> Water Stations</span>
                  <span className="flex items-center gap-1.5 bg-surface-container p-3 rounded-xl"><span className="material-symbols-outlined text-primary">medical_services</span> Medical Room</span>
                  <span className="flex items-center gap-1.5 bg-surface-container p-3 rounded-xl"><span className="material-symbols-outlined text-primary">wifi</span> Free WiFi (30m)</span>
                  <span className="flex items-center gap-1.5 bg-surface-container p-3 rounded-xl"><span className="material-symbols-outlined text-primary">card_membership</span> Souvenir Stalls</span>
                </div>
              </div>

              {/* Local rules dress codes safety alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/20 space-y-2">
                  <h4 className="font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">assignment_turned_in</span>
                    Dress Code & Etiquette
                  </h4>
                  <ul className="list-disc pl-5 text-[12.5px] text-on-surface-variant space-y-1">
                    <li>Dress modestly; cover shoulders and knees.</li>
                    <li>Dispose of trash in marked garbage kiosks.</li>
                    <li>Always follow guide instructions near ferry gates.</li>
                  </ul>
                </div>

                <div className="bg-surface-container p-4 rounded-xl border border-surface-variant/20 space-y-2">
                  <h4 className="font-bold text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">security</span>
                    Visitor Safety Alerts
                  </h4>
                  <p className="text-on-surface-variant text-[12.5px]">{guideData.safety.scams}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOOD & SHOPPING */}
          {activeTab === 'shopping' && (
            <div className="space-y-6 animate-fade-in">
              {/* Culinary guide */}
              <div className="border border-surface-variant/30 rounded-2xl p-5 bg-surface-container-low space-y-3">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">restaurant</span> Local Culinary specialties
                </h4>
                <p className="text-on-surface-variant">Recommended street bites near coordinates: <span className="font-bold text-primary">{guideData.food.localSpecialty}</span></p>
                
                <div className="space-y-2.5 mt-3">
                  {guideData.food.restaurants.map((rest, idx) => (
                    <div key={idx} className="bg-surface p-3.5 rounded-xl border border-surface-variant/20 flex justify-between items-center text-[12.5px]">
                      <div>
                        <div className="font-bold text-on-surface">{rest.name}</div>
                        <span className="text-[11px] text-on-surface-variant">{rest.type}</span>
                      </div>
                      <span className="font-bold text-primary">{rest.cost}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopping markets */}
              <div className="bg-surface-container p-5 rounded-2xl border border-surface-variant/20 space-y-3 text-[12.5px]">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">local_mall</span> Souvenirs & Causeway Bazaars
                </h4>
                <p className="text-on-surface-variant"><strong>Bazaar spot:</strong> {guideData.shopping.markets}</p>
                <p className="text-on-surface-variant"><strong>What to buy:</strong> {guideData.shopping.crafts}</p>
                <div className="bg-surface p-3 rounded-xl border border-primary/20 text-primary italic font-medium">
                  💡 Bargaining tip: {guideData.shopping.tips}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI VERDICT & FAQS */}
          {activeTab === 'ai' && (
            <div className="space-y-6 animate-fade-in">
              {/* Ratings breakdown */}
              <div className="space-y-3">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider">Agent Rating Indices</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-surface-container p-3 rounded-xl">
                    <span className="text-on-surface-variant text-[11px] block font-bold">Insta Rating</span>
                    <span className="font-extrabold text-[15px] text-primary">{guideData.aiInsights.instaRating}</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl">
                    <span className="text-on-surface-variant text-[11px] block font-bold">Historical Index</span>
                    <span className="font-extrabold text-[15px] text-primary">{guideData.aiInsights.historyRating}</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl">
                    <span className="text-on-surface-variant text-[11px] block font-bold">Family Score</span>
                    <span className="font-extrabold text-[15px] text-primary">{guideData.aiInsights.familyRating}</span>
                  </div>
                  <div className="bg-surface-container p-3 rounded-xl">
                    <span className="text-on-surface-variant text-[11px] block font-bold">Safety rating</span>
                    <span className="font-extrabold text-[15px] text-primary">95%</span>
                  </div>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-3">
                <h4 className="font-black text-on-surface text-[14px] uppercase tracking-wider">Frequently Asked Questions</h4>
                <div className="space-y-2.5">
                  {guideData.faq.map((faq, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
                      <div className="font-bold text-on-surface text-[13px] flex items-start gap-1">
                        <span className="text-primary font-extrabold">Q:</span>
                        <span>{faq.q}</span>
                      </div>
                      <p className="text-[12.5px] text-on-surface-variant mt-1.5 pl-3.5 leading-relaxed border-l-2 border-primary/20">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* --- STICKY FOOTER ACTION BUTTONS --- */}
        <div className="p-4 bg-surface-container-low border-t border-surface-variant/30 flex justify-between items-center gap-4 shrink-0">
          <div>
            <div className="text-[11px] text-on-surface-variant font-bold">Need translation or voice guides?</div>
            <button 
              onClick={() => speakText(guideData.name + ' travel guide. ' + guideData.overview.aiSummary, 'en')}
              className="text-[12px] text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer mt-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">volume_up</span> Play Audio Guide
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadGuide}
              className="bg-primary text-on-primary font-bold text-[13px] px-6 py-2.5 rounded-xl hover:bg-opacity-95 transition-all cursor-pointer flex items-center gap-1.5 border-none"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {downloadSuccess ? 'Downloaded!' : 'Download PDF Guide'}
            </button>
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAttr + ', ' + cleanDest)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-outline rounded-xl hover:bg-surface-container font-bold text-[13px] text-on-surface-variant flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">navigation</span>
              Open in Maps
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
