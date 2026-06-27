'use client';

import React, { useState, useMemo } from 'react';
import RestaurantCard, { Restaurant } from './RestaurantCard';
import FoodComparisonModal from './FoodComparisonModal';
import LocalFoodCulture from './LocalFoodCulture';

interface FoodSectionProps {
  destination?: string;
}

export default function FoodSection({ destination = 'Goa' }: FoodSectionProps) {
  const [filterVeg, setFilterVeg] = useState<boolean | null>(null); // null = all, true = veg, false = non-veg
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [bookingConfirmedMsg, setBookingConfirmedMsg] = useState<string | null>(null);

  const destName = destination.split(',')[0].trim();

  // Dynamic restaurant catalog customized for the destination
  const restaurants: Restaurant[] = useMemo(() => {
    const isJapan = destName.toLowerCase().includes('kyoto') || destName.toLowerCase().includes('tokyo');
    const isGoa = destName.toLowerCase().includes('goa');

    return [
      {
        id: 'rest-fine',
        name: isJapan ? 'Gion Karyo Kaiseki' : isGoa ? 'The Fisherman\'s Wharf' : 'The Glasshouse Bistro',
        category: 'Fine Dining',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
        cuisines: isJapan ? ['Kyoto Traditional', 'Kaiseki'] : isGoa ? ['Goan Seafood', 'Continental'] : ['North Indian', 'Continental'],
        rating: 4.8,
        reviewsCount: 1820,
        averageCostForTwo: isJapan ? 15000 : isGoa ? 1800 : 1600,
        distance: '2.1 km',
        travelTime: '8 mins drive',
        openTime: '12:30 PM',
        closeTime: '11:00 PM',
        status: 'Open',
        popularityBadge: 'AI Choice',
        mustTryDishes: isJapan ? ['Sashimi Platter', 'Sea Bream Rice'] : ['Goan Fish Thali', 'Butter Garlic Prawns'],
        hygieneScore: 98,
        waitingTime: 'Reservation Recommended',
        address: isJapan ? 'Gionmachi, Kyoto' : 'Salcete, Goa',
        dietaryIcons: ['Veg Options', 'Halal Available'],
        aiInsight: 'Best romantic coastal ambience and highly verified hygiene protocols.'
      },
      {
        id: 'rest-cafe',
        name: isJapan ? 'Arabica Coffee Arashiyama' : isGoa ? 'Curlies Beach Shack' : 'Regal Cafe & Bakery',
        category: 'Cafés',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
        cuisines: isJapan ? ['Specialty Coffee', 'Bakery'] : isGoa ? ['Continental', 'Goan Snacks'] : ['Continental', 'Local Snacks'],
        rating: 4.6,
        reviewsCount: 3420,
        averageCostForTwo: isJapan ? 1800 : isGoa ? 900 : 600,
        distance: '0.8 km',
        travelTime: '10 mins walk',
        openTime: '08:30 AM',
        closeTime: '08:00 PM',
        status: 'Open',
        popularityBadge: 'Tourist Favorite',
        mustTryDishes: isJapan ? ['Uji Matcha Latte', 'Baguette'] : ['Cheese Garlic Naan', 'Kokum Soda'],
        hygieneScore: 94,
        waitingTime: '10 mins wait',
        address: isJapan ? 'Arashiyama, Kyoto' : 'Anjuna Beach, Goa',
        dietaryIcons: ['Pure Veg Available', 'Gluten Free'],
        aiInsight: 'Consistently popular for quick breakfast snacks and beautiful photography views.'
      },
      {
        id: 'rest-street',
        name: isJapan ? 'Nishiki Market Stall #4' : isGoa ? 'Fat Fish Local Tavern' : 'Bombay Vada Pav Center',
        category: 'Local Food Stalls',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
        cuisines: isJapan ? ['Skewers', 'Local Street Food'] : isGoa ? ['Traditional Goan', 'Konkani'] : ['Local Street Food'],
        rating: 4.5,
        reviewsCount: 890,
        averageCostForTwo: isJapan ? 1200 : isGoa ? 550 : 150,
        distance: '1.5 km',
        travelTime: '6 mins walk',
        openTime: '11:00 AM',
        closeTime: '09:30 PM',
        status: 'Closed',
        popularityBadge: 'Local Legend',
        mustTryDishes: isJapan ? ['Tako Tamago', 'Soy Dango'] : ['Chicken Cafreal', 'Prawn Rawa Fry'],
        hygieneScore: 89,
        waitingTime: '5 mins wait',
        address: isJapan ? 'Nakagyo Ward, Kyoto' : 'Baga Road, Goa',
        dietaryIcons: ['Non-Veg Specialty'],
        aiInsight: 'Unmatched authentic taste at 40% cheaper price than standard diners.'
      }
    ];
  }, [destName]);

  // Apply search/filter constraints
  const processedRestaurants = useMemo(() => {
    let list = [...restaurants];

    if (filterVeg !== null) {
      if (filterVeg) {
        list = list.filter(r => r.dietaryIcons.some(i => i.includes('Veg')));
      } else {
        list = list.filter(r => r.dietaryIcons.some(i => i.includes('Non-Veg') || i.includes('Options')));
      }
    }

    if (sortBy === 'lowestPrice') {
      list.sort((a, b) => a.averageCostForTwo - b.averageCostForTwo);
    } else if (sortBy === 'highestRating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [restaurants, filterVeg, sortBy]);

  const handleBookTable = (name: string) => {
    setBookingConfirmedMsg(`Reservation request sent to ${name}! Check SMS for details.`);
    setTimeout(() => setBookingConfirmedMsg(null), 3000);
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-[17px] font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">restaurant</span>
            Culinary Food & Restaurant Hub
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            Verified local food stalls, hygiene ratings, and menu recommendations in <span className="font-bold text-primary">{destName}</span>.
          </p>
        </div>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="bg-primary/10 hover:bg-primary/15 text-primary text-[12.5px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[18px]">compare_arrows</span> Compare Diners
        </button>
      </div>

      {bookingConfirmedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-[12.5px] font-bold animate-fade-in">
          {bookingConfirmedMsg}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-surface-container-low p-4 rounded-xl border border-surface-variant/20">
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterVeg(null)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${filterVeg === null ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            All Foods
          </button>
          <button
            onClick={() => setFilterVeg(true)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${filterVeg === true ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Veg Friendly
          </button>
          <button
            onClick={() => setFilterVeg(false)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${filterVeg === false ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            Non-Veg / Sea Food
          </button>
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-on-surface-variant font-bold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-surface-variant/40 rounded-lg px-2.5 py-1.5 font-bold outline-none text-on-surface cursor-pointer"
          >
            <option value="recommended">AI Matches</option>
            <option value="lowestPrice">Lowest Cost</option>
            <option value="highestRating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Restaurants grid list */}
      <div className="space-y-4">
        {processedRestaurants.map(r => (
          <RestaurantCard key={r.id} restaurant={r} onBookTable={handleBookTable} />
        ))}
      </div>

      {/* Local culinary culture helper */}
      <LocalFoodCulture destination={destination} />

      {/* Comparison Modal Portal */}
      {isCompareOpen && (
        <FoodComparisonModal
          restaurants={restaurants}
          onClose={() => setIsCompareOpen(false)}
          onSelectBook={handleBookTable}
        />
      )}

    </div>
  );
}
