'use client';

import React, { useState } from 'react';
import InteractiveMap from '../../InteractiveMap';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  image: string;
  cuisines: string[];
  rating: number;
  reviewsCount: number;
  averageCostForTwo: number;
  distance: string;
  travelTime: string;
  openTime: string;
  closeTime: string;
  status: 'Open' | 'Closed' | 'Closing Soon';
  popularityBadge: string;
  mustTryDishes: string[];
  hygieneScore: number;
  waitingTime: string;
  address: string;
  dietaryIcons: string[];
  aiInsight: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookTable?: (name: string) => void;
}

export default function RestaurantCard({ restaurant, onBookTable }: RestaurantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all text-left">
      <div className="flex flex-col sm:flex-row items-stretch min-h-[160px]">
        {/* Restaurant Hero Image */}
        <div className="sm:w-1/3 relative bg-neutral-900 shrink-0 min-h-[140px] sm:min-h-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-primary text-on-primary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
            {restaurant.popularityBadge}
          </span>
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
            {restaurant.distance} ({restaurant.travelTime})
          </span>
        </div>

        {/* Card Body */}
        <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-extrabold text-[15px] text-on-surface leading-snug">
                {restaurant.name}
              </h4>
              <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">
                {restaurant.cuisines.join(' • ')} • {restaurant.category}
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-0.5 rounded-lg border border-surface-variant/10 shrink-0">
              <span className="text-[13px] font-black text-on-surface">{restaurant.rating}★</span>
            </div>
          </div>

          {/* Highlights & Cost details */}
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-on-surface-variant">
            <span>💰 Cost for two: <span className="font-bold text-primary">₹{restaurant.averageCostForTwo}</span></span>
            <span>🕒 Hours: {restaurant.openTime} - {restaurant.closeTime}</span>
            <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
              restaurant.status === 'Open' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
            }`}>{restaurant.status}</span>
          </div>

          <div className="flex gap-2">
            {restaurant.dietaryIcons.map((icon, idx) => (
              <span key={idx} className="text-[11px] font-bold uppercase tracking-wider bg-surface-container-low px-2 py-0.5 rounded-full border border-surface-variant/10 text-on-surface-variant">
                {icon}
              </span>
            ))}
          </div>

          {/* Action trigger row */}
          <div className="flex justify-between items-center gap-2 pt-2 border-t border-surface-variant/10">
            <span className="text-[11px] text-primary italic font-medium truncate max-w-[200px]">
              💡 {restaurant.aiInsight}
            </span>
            
            <div className="flex gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1.5 border border-outline rounded-lg text-on-surface-variant font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
              >
                {isExpanded ? 'Hide' : 'Details'}
                <span className="material-symbols-outlined text-[14px]">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {onBookTable && (
                <button
                  onClick={() => onBookTable(restaurant.name)}
                  className="bg-primary text-on-primary font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-opacity-95 transition-all cursor-pointer border-none"
                >
                  Book Table
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded specifications section */}
      {isExpanded && (
        <div className="border-t border-surface-variant/30 p-5 bg-surface-container-low space-y-4 text-[12px] text-on-surface-variant">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-surface p-3.5 rounded-xl border border-surface-variant/20 space-y-1.5">
              <h5 className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span> Must-Try Dishes
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                {restaurant.mustTryDishes.map((dish, i) => <li key={i}>{dish}</li>)}
              </ul>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-surface-variant/20 space-y-1.5">
              <h5 className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">health_and_safety</span> Hygiene & Safety
              </h5>
              <ul className="space-y-1 text-on-surface-variant">
                <li><strong>FSSAI Safety:</strong> Verified compliant</li>
                <li><strong>Kitchen Cleanliness:</strong> {restaurant.hygieneScore}% score</li>
                <li><strong>Water Source:</strong> UV Filtered Purified</li>
              </ul>
            </div>

            <div className="bg-surface p-3.5 rounded-xl border border-surface-variant/20 space-y-1.5">
              <h5 className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">hourglass_empty</span> Queue & Wait time
              </h5>
              <ul className="space-y-1 text-on-surface-variant">
                <li><strong>Average Waiting:</strong> {restaurant.waitingTime}</li>
                <li><strong>Peak Hours:</strong> 01:00 PM - 03:00 PM</li>
                <li><strong>Reservations:</strong> Allowed via app</li>
              </ul>
            </div>

          </div>

          {/* Interactive Map */}
          <div className="space-y-1.5 pt-2">
            <h5 className="font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[16px]">location_on</span> Destination Geography coordinates
            </h5>
            <p className="text-[11.5px] italic text-on-surface-variant">Address: {restaurant.address}</p>
            <div className="w-full h-[150px] rounded-xl overflow-hidden border border-surface-variant/30 mt-2">
              <InteractiveMap destination={restaurant.name + ', ' + restaurant.address} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
