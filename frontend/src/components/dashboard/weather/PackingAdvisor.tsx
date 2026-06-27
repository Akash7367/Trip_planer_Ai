'use client';

import React, { useState } from 'react';

interface Item {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}

interface PackingAdvisorProps {
  temperature: number;
  rainProb: number;
}

export default function PackingAdvisor({ temperature, rainProb }: PackingAdvisorProps) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', label: 'Light Cotton T-Shirts', category: 'Clothing', checked: false },
    { id: '2', label: 'Modest walking shorts', category: 'Clothing', checked: false },
    { id: '3', label: 'Waterproof sandals / Sneakers', category: 'Footwear', checked: false },
    { id: '4', label: 'Compact travel umbrella', category: 'Rain Protection', checked: false },
    { id: '5', label: 'SPF 50+ Sunscreen block lotion', category: 'Skin Care', checked: false },
    { id: '6', label: 'High UV protection sunglasses', category: 'Gear', checked: false },
    { id: '7', label: 'Mosquito repellent cream / spray', category: 'Skin Care', checked: false },
    { id: '8', label: 'Power bank (20,000 mAh)', category: 'Gear', checked: false }
  ]);

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Weather-specific recommendations text
  const weatherTips = React.useMemo(() => {
    if (rainProb > 60) {
      return '⚠️ High Rain Alert: Keep a raincoat and waterproof sleeves for camera gear handy. Wear quick-drying shoes.';
    } else if (temperature > 32) {
      return '☀️ High Heat Notice: Wear light, loose-fitting cotton clothing. Carry sunglasses, sunscreen, and a water bottle.';
    } else if (temperature < 15) {
      return '❄️ Cold weather: Pack a light jacket or thermal layers for cool evening walks.';
    }
    return '🍃 Mild weather: Perfect for outdoor walking tours. Standard sportswear is suitable.';
  }, [temperature, rainProb]);

  return (
    <div className="bg-surface border border-surface-variant/30 rounded-2xl p-5 space-y-4 text-left shadow-sm">
      <h4 className="text-[14.5px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-heading">
        <span className="material-symbols-outlined text-primary text-[20px]">backpack</span>
        Smart Packing Advisor & Checklist
      </h4>

      <div className="bg-primary/5 border border-primary/20 p-3.5 rounded-xl text-[12px] font-semibold text-primary">
        {weatherTips}
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar text-[12px]">
        {items.map(item => (
          <label
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl border border-surface-variant/15 hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id)}
                className="w-4 h-4 text-primary bg-surface-container border-surface-variant rounded focus:ring-primary cursor-pointer"
              />
              <span className={`font-semibold ${item.checked ? 'line-through text-on-surface-variant/50' : 'text-on-surface'}`}>
                {item.label}
              </span>
            </div>
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
              {item.category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
