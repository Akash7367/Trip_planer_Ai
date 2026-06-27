'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering the toggle after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-variant/20 flex items-center justify-center opacity-50"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-surface-container-low border border-surface-variant hover:bg-surface-container hover:border-primary/20 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer group shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-hover:rotate-45 transition-all duration-500 text-[20px]">
          dark_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-primary group-hover:text-secondary group-hover:scale-110 transition-all duration-500 text-[20px]">
          light_mode
        </span>
      )}
    </button>
  );
}
