'use client';

import React from 'react';

interface ChatActionsProps {
  onSelectSuggestion: (text: string) => void;
}

export default function ChatActions({ onSelectSuggestion }: ChatActionsProps) {
  const chips = [
    { text: 'I am tired (Reduce walking today)', label: '🥱 Tired' },
    { text: 'Nearest ATM & Metro', label: '🚇 Transit/Cash' },
    { text: 'Can I bargain at markets here?', label: '🛍️ Bargain' },
    { text: 'Is this area safe after 10 PM?', label: '🛡️ Safety' }
  ];

  return (
    <div className="px-4 py-2 border-t border-surface-variant/20 bg-surface flex flex-wrap gap-1.5 justify-start">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          onClick={() => onSelectSuggestion(chip.text)}
          className="bg-surface-container-low hover:bg-primary/10 text-on-surface-variant hover:text-primary text-[10.5px] font-bold py-1.5 px-3 rounded-full border border-surface-variant/25 transition-all cursor-pointer"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
