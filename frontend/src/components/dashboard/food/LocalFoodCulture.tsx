'use client';

import React from 'react';

interface Specialty {
  name: string;
  taste: string;
  spice: string;
  veg: boolean;
  price: string;
}

interface LocalFoodCultureProps {
  destination: string;
}

export default function LocalFoodCulture({ destination = 'Goa' }: LocalFoodCultureProps) {
  const destName = destination.split(',')[0].trim();
  const isGoa = destName.toLowerCase().includes('goa');
  const isJapan = destName.toLowerCase().includes('kyoto') || destName.toLowerCase().includes('tokyo');

  // Dynamic specialties list based on destination
  const specialties: Specialty[] = React.useMemo(() => {
    if (isGoa) {
      return [
        { name: 'Fish Curry Rice', taste: 'Tangy, coconut-based sour-spicy gravy', spice: 'Medium-High', veg: false, price: '₹220' },
        { name: 'Bebinca', taste: 'Multi-layered traditional sweet cake dessert', spice: 'None (Sweet)', veg: true, price: '₹180' },
        { name: 'Feni Cocktail', taste: 'Fermented cashew apple local brew', spice: 'Vibrant punch', veg: true, price: '₹150' }
      ];
    } else if (isJapan) {
      return [
        { name: 'Kyoto Kaiseki Dinner', taste: 'Multi-course seasonal delicate traditional dining', spice: 'Very Low', veg: false, price: '¥8,000' },
        { name: 'Matcha Uji Soba', taste: 'Savoury buckwheat noodles infused with green tea', spice: 'Low', veg: true, price: '¥1,200' },
        { name: 'Yudofu', taste: 'Hot tofu simmered with kelp broth & dipping sauces', spice: 'Mild', veg: true, price: '¥1,500' }
      ];
    }
    // Default Mumbai / General
    return [
      { name: 'Vada Pav', taste: 'Spiced potato fritter in bread slider bun', spice: 'High', veg: true, price: '₹20' },
      { name: 'Misal Pav', taste: 'Sprouts curry with spicy lentil gravy & crunchy toppings', spice: 'Very High', veg: true, price: '₹90' },
      { name: 'Bombay Sandwich', taste: 'Mint chutney, beetroot, cucumber toasted bread slices', spice: 'Medium', veg: true, price: '₹80' }
    ];
  }, [isGoa, isJapan]);

  return (
    <div className="bg-surface-container-low border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left">
      <h4 className="text-[14px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">restaurant_menu</span>
        Culinary Culture Guide ({destName})
      </h4>

      {/* Specialties list */}
      <div className="space-y-3">
        <span className="text-[12px] font-bold text-on-surface-variant block uppercase tracking-wider">Must-Try Local Specialties</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {specialties.map((spec, i) => (
            <div key={i} className="bg-surface p-3.5 rounded-xl border border-surface-variant/20 space-y-1.5 text-[12px]">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-on-surface">{spec.name}</span>
                <span className="font-bold text-primary">{spec.price}</span>
              </div>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">{spec.taste}</p>
              <div className="flex gap-1.5 text-[9px] font-extrabold uppercase mt-1">
                <span className="bg-surface-variant/20 px-1.5 py-0.5 rounded text-on-surface-variant">Spice: {spec.spice}</span>
                <span className={`px-1.5 py-0.5 rounded ${spec.veg ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {spec.veg ? 'Veg' : 'Non-Veg'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Etiquette & safety tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
        <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-1.5">
          <span className="font-bold text-on-surface block">Dining Etiquette</span>
          <ul className="list-disc pl-4 text-on-surface-variant space-y-1 text-[11.5px]">
            {isJapan ? (
              <>
                <li>Do not pass food directly chopstick-to-chopstick.</li>
                <li>Slurping noodles is considered polite and shows appreciation.</li>
                <li>Tipping is not practiced and can be seen as rude.</li>
              </>
            ) : (
              <>
                <li>Eating with clean hands is common for traditional bread (Pav/Roti).</li>
                <li>Tipping of 5-10% is customary at sit-down dining spots.</li>
                <li>Request "Medium spicy" if you are not used to rich local chili levels.</li>
              </>
            )}
          </ul>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-surface-variant/20 space-y-1.5">
          <span className="font-bold text-on-surface block">Street Food Safety Guide</span>
          <ul className="list-disc pl-4 text-on-surface-variant space-y-1 text-[11.5px]">
            <li>Drink only bottled mineral water. Avoid ice in local beverages.</li>
            <li>Eat at stalls that have a heavy crowd of local families (shows fresh turnover).</li>
            <li>Ensure food is cooked fresh and served piping hot in front of you.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
