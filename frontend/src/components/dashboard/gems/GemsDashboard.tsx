'use client';

import React, { useMemo, useState } from 'react';
import GemsList, { HiddenGem } from './GemsList';
import LocalExperiences, { Experience } from './LocalExperiences';
import PhotographyGuide from './PhotographyGuide';

interface GemsDashboardProps {
  destination?: string;
}

export default function GemsDashboard({ destination = 'Goa' }: GemsDashboardProps) {
  const [downloadActive, setDownloadActive] = useState(false);
  const destName = destination.split(',')[0].trim();
  const destLower = destName.toLowerCase();

  // Dynamic Hidden Gems lists
  const gemsList: HiddenGem[] = useMemo(() => {
    const isJapan = destLower.includes('kyoto') || destLower.includes('tokyo');
    const isGoa = destLower.includes('goa');

    if (isGoa) {
      return [
        {
          id: 'gem-1',
          name: 'Cola Beach Lagoon',
          category: 'Secret Beach',
          description: 'A stunning fresh-water lagoon meeting the Arabian Sea, hidden behind coconut groves.',
          location: 'South Goa',
          crowdLevel: 'Low',
          whySpecial: 'Rent a kayak and paddle in the calm sweet-water lagoon rather than the sea.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
          cost: 'Free entry',
          timeNeeded: '2 - 3 Hours',
          badge: 'Underrated'
        },
        {
          id: 'gem-2',
          name: 'Harvalem Waterfall Caves',
          category: 'Heritage Cave',
          description: '6th-century rock-cut Buddhist caverns surrounded by lush valleys and freshwater cascades.',
          location: 'Sanquelim',
          crowdLevel: 'Low',
          whySpecial: 'Visit right after sunrise for complete silence and beautiful light filters.',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80',
          cost: 'Free entry',
          timeNeeded: '1.5 Hours',
          badge: 'Local Favorite'
        }
      ];
    } else if (isJapan) {
      return [
        {
          id: 'gem-1',
          name: 'Gio-ji Temple moss Garden',
          category: 'Hidden Temple',
          description: 'A tiny, quiet temple famous for its deep green moss carpets and tall maple groves.',
          location: 'Arashiyama, Kyoto',
          crowdLevel: 'Low',
          whySpecial: 'Skip the main bamboo path crowd and walk 15 mins further north to find this sanctuary.',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
          cost: '¥300',
          timeNeeded: '1 Hour',
          badge: 'Underrated'
        }
      ];
    }
    // Default Mumbai / General
    return [
      {
        id: 'gem-1',
        name: 'Gilbert Hill Monolith',
        category: 'Geological Site',
        description: 'A 66-million-year-old basalt rock columns structure rising abruptly in the suburbs.',
        location: 'Andheri West',
        crowdLevel: 'Low',
        whySpecial: 'Climb the steps to the top temple for a 360-degree panorama of the Mumbai skyline.',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80',
        cost: 'Free entry',
        timeNeeded: '1 Hour',
        badge: 'Local Favorite'
      }
    ];
  }, [destLower]);

  // Local workshops & events list
  const experiencesList: Experience[] = useMemo(() => {
    const isGoa = destLower.includes('goa');
    if (isGoa) {
      return [
        { name: 'Traditional Feni Distilling Masterclass', type: 'Workshop', duration: '2 Hours', cost: '1,200', whyLocal: 'Conducted inside family spice farms using earthen cashew pots.' },
        { name: 'Konkani Clay Pottery Making', type: 'Crafts Class', duration: '1.5 Hours', cost: '750', whyLocal: 'Learn direct clay throwing from third-generation village potters.' }
      ];
    }
    return [
      { name: 'Authentic Local Culinary Cooking Class', type: 'Workshop', duration: '3 Hours', cost: '1,500', whyLocal: 'Prepares traditional recipes using locally sourced organic ingredients.' }
    ];
  }, [destLower]);

  // Photography locations list
  const photoSpots = useMemo(() => {
    const isGoa = destLower.includes('goa');
    if (isGoa) {
      return [
        { name: 'Cabo de Rama Fort Bastion', bestTime: '05:30 PM - 06:15 PM', difficulty: 'Easy' as const, lensTip: 'Wide-angle lens (16-35mm) to capture fort walls framing ocean sunset.' },
        { name: 'Dona Paula Jetty shoreline', bestTime: '06:00 AM - 07:00 AM', difficulty: 'Medium' as const, lensTip: 'ND Filter for long exposures of water waves.' }
      ];
    }
    return [
      { name: 'Scenic Hill Overlook Point', bestTime: 'Sunrise', difficulty: 'Medium' as const, lensTip: 'Telephoto zoom lens (70-200mm) to frame mountains.' }
    ];
  }, [destLower]);

  const handleDownload = () => {
    setDownloadActive(true);
    setTimeout(() => setDownloadActive(false), 2000);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">explore</span>
            Hidden Gems & Local Experiences
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Lesser-known viewpoints, heritage workshops, and sunset scouting coordinates in <span className="font-bold text-primary">{destName}</span>.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="bg-primary/10 hover:bg-primary/15 text-primary text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {downloadActive ? 'Downloading...' : 'Download Offline Gems Guide'}
        </button>
      </div>

      {/* Gems Score Notice */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-2.5 text-[12.5px] text-on-surface-variant leading-relaxed">
        <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">verified</span>
        <div>
          <strong>AI Exploration Index (92%):</strong> This itinerary includes 3 hidden places which are 80% less crowded than main tourist spots. Perfect for a quiet, authentic vacation experience.
        </div>
      </div>

      {/* Hidden Places List */}
      <div className="space-y-3">
        <span className="text-[12px] font-bold text-on-surface-variant block uppercase tracking-wider">Secret Landmarks & Viewpoints</span>
        <GemsList gems={gemsList} />
      </div>

      {/* Experiences & Photography scouting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocalExperiences experiences={experiencesList} />
        <PhotographyGuide spots={photoSpots} />
      </div>

    </div>
  );
}
