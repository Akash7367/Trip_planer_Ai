'use client';

import React from 'react';

interface WorkspaceSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasIntelligence: boolean;
}

export default function WorkspaceSidebar({ activeTab, onTabChange, hasIntelligence }: WorkspaceSidebarProps) {
  const items = [
    { id: 'itinerary', label: 'Day Timeline', icon: 'calendar_month' },
    { id: 'hotels', label: 'Lodging Stays', icon: 'hotel' },
    { id: 'transit', label: 'Transit Guides', icon: 'commute' },
    { id: 'food', label: 'Food & Dining', icon: 'restaurant' },
    { id: 'budget', label: 'Budget Indexes', icon: 'payments' },
    { id: 'safety', label: 'Safety Advisories', icon: 'shield' },
    { id: 'gems', label: 'Hidden Gems', icon: 'explore' },
    ...(hasIntelligence ? [{ id: 'intelligence', label: 'Vlog Intelligence', icon: 'smart_toy' }] : [])
  ];

  return (
    <aside className="w-full md:w-56 shrink-0 flex flex-row md:flex-col bg-surface-container-low border-r border-surface-variant/20 p-2 md:p-4 gap-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
      {items.map(item => {
        const isSelected = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-bold tracking-wide transition-all border-none cursor-pointer whitespace-nowrap md:w-full ${
              isSelected
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}
