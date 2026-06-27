'use client';

import React, { useState, useMemo } from 'react';
import InteractiveMap from '../InteractiveMap';
import { useLanguage } from '@/context/LanguageContext';

export interface HotelsSectionProps {
  destination?: string;
  budgetTier?: string;
  travelerProfile?: 'family' | 'couple' | 'backpacker' | 'business' | 'senior' | 'accessibility' | 'pet' | 'general';
}

interface Hotel {
  id: string;
  name: string;
  category: string;
  image: string;
  starRating: number;
  userRating: number;
  reviewsCount: number;
  pricePerNight: number;
  taxes: string;
  distanceCenter: string;
  distanceAttraction: string;
  distanceAirport: string;
  distanceStation: string;
  roomsLeft: number;
  popular: boolean;
  whyRecommended: string;
  recBadge: string;
  rooms: {
    type: string;
    size: string;
    occupancy: number;
    bed: string;
    view: string;
    wifiSpeed: string;
    balcony: boolean;
  }[];
  amenities: { icon: string; label: string }[];
  checkIn: { in: string; out: string; early: string; reception24h: boolean };
  cancellation: { type: string; deadline: string; timeline: string };
  payment: string[];
  safety: { security24h: boolean; cctv: boolean; womenFriendly: boolean; neighborhoodScore: number };
  food: { breakfastIncluded: boolean; buffet: boolean; vegOption: boolean; jainOption: boolean };
  priceAnalysis: { avgPrice: number; trend: string; savings: number };
  reviews: { pros: string[]; cons: string[]; cleanliness: number; service: number; comfort: number };
  nearby: { name: string; dist: string }[];
  specialtyTag?: string; // e.g. "Kids' Play Zone", "Private Sea-view Balcony"
}

export default function HotelsSection({
  destination = 'Goa',
  budgetTier = 'moderate',
  travelerProfile = 'general'
}: HotelsSectionProps) {
  const { currentLanguage } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [expandedHotelId, setExpandedHotelId] = useState<string | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [bookingConfirmedId, setBookingConfirmedId] = useState<string | null>(null);

  const destName = destination.split(',')[0].trim();

  // Dynamic Hotel dataset personalized by travelerProfile
  const hotelsData: Hotel[] = useMemo(() => {
    const isJapan = destName.toLowerCase().includes('kyoto') || destName.toLowerCase().includes('tokyo');
    const isGoa = destName.toLowerCase().includes('goa');

    const list: Hotel[] = [
      // 1. BUDGET OPTION
      {
        id: 'hotel-budget',
        name: isJapan ? 'Kyoto Central Backpackers' : isGoa ? 'Zostel Calangute Beach' : 'Central Backpacker Inn',
        category: 'Hostels',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=80',
        starRating: 2,
        userRating: 4.6,
        reviewsCount: 1420,
        pricePerNight: isJapan ? 3500 : isGoa ? 950 : 850,
        taxes: 'Taxes excluded (+12%)',
        distanceCenter: '1.2 km',
        distanceAttraction: '0.4 km',
        distanceAirport: '28 km',
        distanceStation: '1.5 km',
        roomsLeft: 4,
        popular: travelerProfile === 'backpacker',
        whyRecommended: travelerProfile === 'backpacker'
          ? 'Recommended for you: Highly social common lounges, free walking tours, and budget dorm layouts.'
          : 'Excellent pocket-friendly choice for solo travelers and budget backpackers.',
        recBadge: 'Best for Backpackers',
        rooms: [
          { type: 'Mixed Dormitory (6 Bed)', size: '24 sq.m', occupancy: 1, bed: 'Single Bunk Bed', view: 'Street view', wifiSpeed: '50 Mbps', balcony: false },
          { type: 'Private Dorm Room', size: '14 sq.m', occupancy: 2, bed: 'Double Bed', view: 'Garden view', wifiSpeed: '50 Mbps', balcony: true }
        ],
        amenities: [
          { icon: 'wifi', label: 'Free High-speed WiFi' },
          { icon: 'dry_cleaning', label: 'Self Service Laundry' },
          { icon: 'group', label: 'Social Common Lounge' },
          { icon: 'kitchen', label: 'Shared Kitchenette' }
        ],
        checkIn: { in: '02:00 PM', out: '11:00 AM', early: 'Available upon request', reception24h: true },
        cancellation: { type: 'Free Cancellation', deadline: '24 hours prior', timeline: 'Instant refund' },
        payment: ['Credit Card', 'UPI', 'Cash accepted'],
        safety: { security24h: true, cctv: true, womenFriendly: true, neighborhoodScore: 88 },
        food: { breakfastIncluded: false, buffet: false, vegOption: true, jainOption: false },
        priceAnalysis: { avgPrice: 950, trend: 'Prices stable this week.', savings: 120 },
        reviews: {
          pros: ['Very clean bathrooms', 'Super social atmosphere', 'Right next to beach line'],
          cons: ['Shared rooms can be slightly noisy at night', 'No pool on premises'],
          cleanliness: 92, service: 88, comfort: 80
        },
        nearby: [
          { name: 'Local beach market', dist: '300m' },
          { name: 'Subway Station Entrance', dist: '500m' }
        ],
        specialtyTag: '🎒 Bunk Beds & Common Lounge'
      },

      // 2. MID-RANGE OPTION
      {
        id: 'hotel-moderate',
        name: isJapan ? 'Miyako Traditional Ryokan' : isGoa ? 'Bloom Suites Villa Resort' : 'Magnolia Boutique Residency',
        category: 'Boutique Hotels',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
        starRating: 4,
        userRating: 4.8,
        reviewsCount: 3280,
        pricePerNight: isJapan ? 14000 : isGoa ? 4800 : 3800,
        taxes: 'Taxes included',
        distanceCenter: '2.5 km',
        distanceAttraction: '1.1 km',
        distanceAirport: '24 km',
        distanceStation: '3.2 km',
        roomsLeft: 7,
        popular: travelerProfile === 'business' || travelerProfile === 'couple',
        whyRecommended: travelerProfile === 'business'
          ? 'Recommended for you: Executive desk setups, high-speed WiFi, and quiet business center access.'
          : travelerProfile === 'couple'
          ? 'Recommended for you: Romantic courtyard designs, candlelit terrace dining, and couple spa packages.'
          : 'Top boutique score. Balances premium rooms and high comfort.',
        recBadge: travelerProfile === 'business' ? 'Best for Business' : travelerProfile === 'couple' ? 'Best for Couples' : 'Best Value for Money',
        rooms: [
          { type: 'Deluxe Courtyard Room', size: '32 sq.m', occupancy: 2, bed: 'King Size Bed', view: 'Pool & Garden', wifiSpeed: '120 Mbps (Verified)', balcony: true },
          { type: 'Executive Suite', size: '48 sq.m', occupancy: 3, bed: 'Super King Bed', view: 'Mountain view', wifiSpeed: '120 Mbps (Verified)', balcony: true }
        ],
        amenities: [
          { icon: 'pool', label: 'Outdoor Swimming Pool' },
          { icon: 'restaurant', label: 'In-house Restaurant & Cafe' },
          { icon: 'business_center', label: '24/7 Business Lounge' },
          { icon: 'spa', label: 'Spa Wellness Center' }
        ],
        checkIn: { in: '12:00 PM', out: '10:00 AM', early: 'Complimentary early check-in (subject to availability)', reception24h: true },
        cancellation: { type: 'Free Cancellation', deadline: '48 hours prior', timeline: 'Refund within 3 days' },
        payment: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
        safety: { security24h: true, cctv: true, womenFriendly: true, neighborhoodScore: 95 },
        food: { breakfastIncluded: true, buffet: true, vegOption: true, jainOption: true },
        priceAnalysis: { avgPrice: 4800, trend: 'Prices rising due to weekend demand.', savings: 850 },
        reviews: {
          pros: ['Beautiful gardens', 'Extremely cooperative staff', 'Excellent buffet breakfast spreads'],
          cons: ['Room service closes at 11:30 PM', 'Limited outstation parking spaces'],
          cleanliness: 96, service: 94, comfort: 92
        },
        nearby: [
          { name: 'City Center Mall', dist: '1.2km' },
          { name: 'Historic Fort Gate', dist: '800m' }
        ],
        specialtyTag: travelerProfile === 'business' ? '💻 Verified 120 Mbps WiFi' : '❤️ Couple Spa & Scenic Balcony'
      },

      // 3. LUXURY RESORT
      {
        id: 'hotel-luxury',
        name: isJapan ? 'The Kyoto Ritz-Carlton Palace' : isGoa ? 'Taj Exotica Beach Resort & Spa' : 'The Royal Grand Palace & Spa',
        category: 'Resorts',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80',
        starRating: 5,
        userRating: 4.9,
        reviewsCount: 8900,
        pricePerNight: isJapan ? 42000 : isGoa ? 18500 : 12500,
        taxes: 'Taxes included',
        distanceCenter: '6.0 km',
        distanceAttraction: '2.5 km',
        distanceAirport: '35 km',
        distanceStation: '8.0 km',
        roomsLeft: 2,
        popular: travelerProfile === 'family' || travelerProfile === 'senior' || travelerProfile === 'accessibility' || travelerProfile === 'pet',
        whyRecommended: travelerProfile === 'family'
          ? 'Recommended for you: Large interconnecting rooms, dedicated kids\' play park, and children dining menus.'
          : travelerProfile === 'senior'
          ? 'Recommended for you: Wheelchair friendly ramps, lifts to all floors, ground level rooms, and doctor on call.'
          : travelerProfile === 'accessibility'
          ? 'Recommended for you: Roll-in showers, visual alert systems, grab bars, and ramp pathways.'
          : travelerProfile === 'pet'
          ? 'Recommended for you: Dedicated leash-free lawns, pet toys, and custom dog food menus.'
          : 'A five-star luxury experience right on the beach front.',
        recBadge: travelerProfile === 'family' ? 'Best for Families' : travelerProfile === 'senior' ? 'Best for Seniors' : travelerProfile === 'accessibility' ? 'Accessible Pick' : travelerProfile === 'pet' ? 'Pet Friendly Pick' : 'Best Luxury Option',
        rooms: [
          { type: 'Luxury Sea View Room', size: '54 sq.m', occupancy: 3, bed: 'Super King Plume Bed', view: 'Endless Ocean', wifiSpeed: '250 Mbps', balcony: true },
          { type: 'Presidential Plunge Pool Villa', size: '120 sq.m', occupancy: 4, bed: '2 Ultra King Beds', view: 'Beach Shore Front', wifiSpeed: '250 Mbps', balcony: true }
        ],
        amenities: [
          { icon: 'pool', label: 'Infinity Beachside Pool' },
          { icon: 'child_care', label: "Dedicated Kids' Play Area" },
          { icon: 'pets', label: 'Pet Friendly Lawns' },
          { icon: 'accessible', label: 'Wheelchair Ramp Slopes & Lift' }
        ],
        checkIn: { in: '02:00 PM', out: '12:00 PM', early: 'Guaranteed early check-in for members', reception24h: true },
        cancellation: { type: 'Partial Refund (90%)', deadline: '7 days prior', timeline: 'Refund within 5-7 working days' },
        payment: ['Credit Card', 'Debit Card', 'International Cards', 'UPI'],
        safety: { security24h: true, cctv: true, womenFriendly: true, neighborhoodScore: 98 },
        food: { breakfastIncluded: true, buffet: true, vegOption: true, jainOption: true },
        priceAnalysis: { avgPrice: 18500, trend: 'Peak season bookings active. Reserve immediately.', savings: 2400 },
        reviews: {
          pros: ['World-class private beach access', 'Exceptional hospitality levels', 'Delicious fine dining options'],
          cons: ['Premium dining is relatively expensive', 'Bargain transportation stands are far away'],
          cleanliness: 99, service: 98, comfort: 98
        },
        nearby: [
          { name: 'Private Sunset Cove', dist: '50m' },
          { name: 'Heritage Lighthouse Ruins', dist: '2.0km' }
        ],
        specialtyTag: travelerProfile === 'family' ? "🧒 Kids' Play Zone & Babysitting" : travelerProfile === 'senior' ? '🏥 Doctor-on-Call & Lifts' : travelerProfile === 'accessibility' ? '♿ Roll-in Shower & Ramps' : travelerProfile === 'pet' ? '🐕 Pet Garden & Bowls' : '🌟 Private Beach Access'
      }
    ];

    // Personalization Sorting: Sort the most relevant hotel to the very top based on the profile
    if (travelerProfile === 'backpacker') {
      return [list[0], list[1], list[2]];
    } else if (travelerProfile === 'business' || travelerProfile === 'couple') {
      return [list[1], list[2], list[0]];
    } else if (travelerProfile === 'family' || travelerProfile === 'senior' || travelerProfile === 'accessibility' || travelerProfile === 'pet') {
      return [list[2], list[1], list[0]];
    }

    return list;
  }, [destName, travelerProfile]);

  // Apply secondary filters and sorting selection
  const processedHotels = useMemo(() => {
    let list = [...hotelsData];

    if (filterType !== 'all') {
      list = list.filter(h => h.id.includes(filterType) || h.category.toLowerCase().includes(filterType.toLowerCase()));
    }

    if (sortBy === 'lowestPrice') {
      list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'highestRating') {
      list.sort((a, b) => b.userRating - a.userRating);
    }

    return list;
  }, [hotelsData, filterType, sortBy]);

  const handleBookHotel = (id: string) => {
    setBookingConfirmedId(id);
    setTimeout(() => setBookingConfirmedId(null), 3000);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">hotel</span>
            AI-Personalized Accommodation Hub
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Personalized for <span className="font-extrabold text-primary capitalize">{travelerProfile}</span> travelers. Match results sorted by convenience.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-primary/10 hover:bg-primary/15 text-primary text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span> Compare Accommodations
          </button>
        </div>
      </div>

      {/* Profile Notice */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-2.5 text-[12.5px] text-on-surface-variant leading-relaxed">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">psychology</span>
        <div>
          <strong>AI Personalization active:</strong> We detected a <span className="font-bold text-primary capitalize">{travelerProfile}</span> style. Ramps, play zones, desks, and layouts are highlighted dynamically.
        </div>
      </div>

      {/* --- FILTERS & SORT ROW --- */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Places' },
            { id: 'budget', label: 'Hostels & Budget' },
            { id: 'moderate', label: 'Boutique Hotels' },
            { id: 'luxury', label: 'Resorts & Villas' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterType(cat.id);
                setExpandedHotelId(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterType === cat.id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-on-surface-variant font-bold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-surface-variant/40 rounded-lg px-2.5 py-1.5 font-bold outline-none text-on-surface cursor-pointer"
          >
            <option value="recommended">AI Recommended</option>
            <option value="lowestPrice">Lowest Price</option>
            <option value="highestRating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* --- HOTELS LIST --- */}
      <div className="space-y-4">
        {processedHotels.map(hotel => {
          const isExpanded = expandedHotelId === hotel.id;
          return (
            <div
              key={hotel.id}
              className="bg-surface border border-surface-variant/30 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row items-stretch min-h-[180px]">
                
                {/* Hero Image */}
                <div className="md:w-1/4 relative bg-neutral-900 shrink-0 min-h-[160px] md:min-h-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  {hotel.specialtyTag && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded shadow-sm">
                      {hotel.specialtyTag}
                    </span>
                  )}
                  {hotel.roomsLeft <= 3 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                      Only {hotel.roomsLeft} Left!
                    </span>
                  )}
                </div>

                {/* Hotel Card Body Details */}
                <div className="flex-1 p-5 flex flex-col justify-between text-left space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-[16px] text-on-surface leading-snug">
                          {hotel.name}
                        </h4>
                        
                        <div className="flex text-amber-400">
                          {Array.from({ length: hotel.starRating }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                      </div>
                      
                      <span className="text-[11px] font-bold text-on-surface-variant block mt-0.5">
                        Category: {hotel.category} • Center: {hotel.distanceCenter} • Airport: {hotel.distanceAirport}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-xl border border-surface-variant/10">
                      <span className="text-[14px] font-black text-on-surface">{hotel.userRating}★</span>
                      <span className="text-[11px] text-on-surface-variant">({hotel.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  {/* AI Recommendation corner */}
                  <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl flex items-start gap-2 text-[12px]">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">auto_awesome</span>
                    <div>
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        {hotel.recBadge}
                      </span>
                      <p className="text-on-surface font-medium leading-snug">{hotel.whyRecommended}</p>
                    </div>
                  </div>

                  {/* Pricing / CTA row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[20px] font-black text-primary">₹{hotel.pricePerNight.toLocaleString('en-IN')}</span>
                        <span className="text-on-surface-variant text-[11px] font-bold">/ night</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant block font-medium italic">{hotel.taxes}</span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setExpandedHotelId(isExpanded ? null : hotel.id)}
                        className="flex-1 sm:flex-initial px-4 py-2 border border-outline rounded-xl hover:bg-surface-container text-on-surface-variant font-bold text-[12.5px] flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        {isExpanded ? 'Hide Specs' : 'View Room Types & Details'}
                        <span className="material-symbols-outlined text-[16px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleBookHotel(hotel.id)}
                        className="flex-grow sm:flex-initial bg-primary text-on-primary font-bold text-[12.5px] px-6 py-2 rounded-xl hover:bg-opacity-95 transition-all text-center cursor-pointer border-none"
                      >
                        {bookingConfirmedId === hotel.id ? 'Booking Confirmed! ✅' : 'Instant Book'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* --- EXPANDED DETAILS --- */}
              {isExpanded && (
                <div className="border-t border-surface-variant/30 p-5 bg-surface-container-low space-y-6 text-[12.5px] leading-relaxed text-on-surface-variant animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-2">
                      <h5 className="font-bold text-on-surface flex items-center gap-1 text-[13px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">vpn_key</span> Check-In & Policies
                      </h5>
                      <ul className="space-y-1 text-on-surface-variant">
                        <li><strong>Check-In:</strong> {hotel.checkIn.in}</li>
                        <li><strong>Check-Out:</strong> {hotel.checkIn.out}</li>
                        <li><strong>Early Arrival:</strong> {hotel.checkIn.early}</li>
                      </ul>
                    </div>

                    <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-2">
                      <h5 className="font-bold text-on-surface flex items-center gap-1 text-[13px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span> Cancellation Rules
                      </h5>
                      <ul className="space-y-1 text-on-surface-variant">
                        <li><strong>Policy:</strong> {hotel.cancellation.type}</li>
                        <li><strong>Deadline:</strong> {hotel.cancellation.deadline}</li>
                        <li><strong>Refund timeline:</strong> {hotel.cancellation.timeline}</li>
                      </ul>
                    </div>

                    <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-2">
                      <h5 className="font-bold text-on-surface flex items-center gap-1 text-[13px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">credit_card</span> Accepted Payments
                      </h5>
                      <p className="text-on-surface-variant">{hotel.payment.join(' • ')}</p>
                    </div>
                  </div>

                  {/* Room Inventory Specs */}
                  <div className="border border-surface-variant/30 rounded-xl overflow-hidden bg-surface shadow-sm">
                    <div className="p-3 bg-surface-variant/10 border-b border-surface-variant/30 font-bold text-on-surface text-[13px]">
                      Room Inventory Specifications
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[12px]">
                        <thead>
                          <tr className="bg-surface-variant/5 text-on-surface-variant font-bold border-b border-surface-variant/20">
                            <th className="p-3">Room Type</th>
                            <th className="p-3">Dimensions</th>
                            <th className="p-3">Beds</th>
                            <th className="p-3">WiFi Speed</th>
                            <th className="p-3">Balcony</th>
                            <th className="p-3">Max Occupancy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hotel.rooms.map((room, idx) => (
                            <tr key={idx} className="border-b border-surface-variant/20 hover:bg-surface-container last:border-b-0">
                              <td className="p-3 font-semibold text-on-surface">{room.type}</td>
                              <td className="p-3">{room.size}</td>
                              <td className="p-3">{room.bed}</td>
                              <td className="p-3 font-bold text-primary">{room.wifiSpeed}</td>
                              <td className="p-3">{room.balcony ? 'Yes' : 'No'}</td>
                              <td className="p-3 font-bold">{room.occupancy} Adults</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Safety & Satisfaction Indices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-bold text-on-surface flex items-center gap-1 text-[13px]">
                        <span className="material-symbols-outlined text-primary text-[18px]">security</span> Safety & neighborhood
                      </h5>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-surface p-2.5 rounded-lg border border-surface-variant/10 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span> Women Friendly
                        </div>
                        <div className="bg-surface p-2.5 rounded-lg border border-surface-variant/10 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span> 24x7 Security
                        </div>
                        <div className="bg-surface p-2.5 rounded-lg border border-surface-variant/10 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span> CCTV Cameras
                        </div>
                        <div className="bg-surface p-2.5 rounded-lg border border-surface-variant/10 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-primary text-[16px]">pin_drop</span> Safe Rating: {hotel.safety.neighborhoodScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h5 className="font-bold text-on-surface text-[13px]">User Satisfaction Indices</h5>
                      <div className="space-y-2">
                        {[
                          { label: 'Cleanliness', score: hotel.reviews.cleanliness },
                          { label: 'Staff Hospitality', score: hotel.reviews.service },
                          { label: 'Room Comfort', score: hotel.reviews.comfort }
                        ].map((s, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between font-bold text-[11px] text-on-surface-variant">
                              <span>{s.label}</span>
                              <span>{s.score}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-variant/30 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${s.score}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Maps */}
                  <div className="space-y-2 pt-2">
                    <h5 className="font-bold text-on-surface text-[13px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[18px]">location_on</span> Destination Geography coordinates
                    </h5>
                    <div className="w-full h-[180px] rounded-xl overflow-hidden border border-surface-variant/30">
                      <InteractiveMap destination={hotel.name + ', ' + destName} />
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- HOTEL COMPARISON DIALOG MODAL --- */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-surface-lowest w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden relative border border-surface-variant flex flex-col max-h-[85vh] animate-scale-up text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-surface-variant/30 flex justify-between items-center">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-black flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[24px]">compare_arrows</span>
                  Accommodation Comparison Matrix
                </h3>
                <p className="text-[12px] text-on-surface-variant mt-0.5">Compare pricing, reviews, check-ins, and safety criteria side-by-side.</p>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant cursor-pointer border-none bg-transparent"
                onClick={() => setIsCompareOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-auto p-5">
              <table className="w-full text-[13px] border-collapse text-left min-w-[700px]">
                <thead>
                  <tr className="bg-surface-variant/20 border-b border-surface-variant/30">
                    <th className="p-3 font-bold text-on-surface-variant">Feature Matrix</th>
                    {hotelsData.map(h => (
                      <th key={h.id} className="p-3 font-black text-on-surface">
                        <div>{h.name}</div>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary mt-1 inline-block">
                          {h.recBadge}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">Price Per Night</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3 font-black text-primary">₹{h.pricePerNight.toLocaleString('en-IN')}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">User Star Rating</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3 font-bold">{h.userRating} ★ ({h.starRating} Star)</td>
                    ))}
                  </tr>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">Distance from center</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3">{h.distanceCenter}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">Breakfast Included</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3">{h.food.breakfastIncluded ? 'Yes (Buffet Included)' : 'Paid / Excluded'}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">Cleanliness index</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3 font-bold text-emerald-600">{h.reviews.cleanliness}%</td>
                    ))}
                  </tr>
                  <tr className="border-b border-surface-variant/10">
                    <td className="p-3 font-bold text-on-surface-variant">Cancellation Policy</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3 text-[12px]">{h.cancellation.type} ({h.cancellation.deadline})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-on-surface-variant">Booking Action</td>
                    {hotelsData.map(h => (
                      <td key={h.id} className="p-3">
                        <button
                          onClick={() => {
                            handleBookHotel(h.id);
                            setIsCompareOpen(false);
                          }}
                          className="bg-primary text-on-primary font-bold text-[11px] px-4 py-2 rounded-lg hover:opacity-95 cursor-pointer border-none"
                        >
                          Book Instantly
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
