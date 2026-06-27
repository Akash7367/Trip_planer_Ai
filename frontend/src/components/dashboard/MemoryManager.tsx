'use client';

import React, { useState, useEffect } from 'react';
import LanguageSelector from '@/components/LanguageSelector';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface MemoryManagerProps {
  user_id: number;
}

export default function MemoryManager({ user_id }: MemoryManagerProps) {
  const [memories, setMemories] = useState<any[]>([]);
  const [memoryCategory, setMemoryCategory] = useState('favorite_destinations');
  const [memoryContent, setMemoryContent] = useState('');
  const [memorySearchQuery, setMemorySearchQuery] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [isSearchingMemory, setIsSearchingMemory] = useState(false);
  const [memoryError, setMemoryError] = useState<string | null>(null);

  useEffect(() => {
    loadMemories();
  }, [user_id]);

  const loadMemories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/memory/search?user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: '', category: null })
      });
      if (res.ok) {
        const data = await res.json();
        setMemories(data.map((item: any) => item.memory));
      }
    } catch (err) {
      console.error("Failed to load user memories:", err);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryContent.trim()) return;
    setIsAddingMemory(true);
    setMemoryError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/memory/add?user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: memoryCategory,
          content: memoryContent
        })
      });
      if (res.ok) {
        setMemoryContent('');
        loadMemories();
      } else {
        const errData = await res.json();
        setMemoryError(errData.detail || "Failed to add memory preference.");
      }
    } catch (err) {
      setMemoryError("Connection failure.");
    } finally {
      setIsAddingMemory(false);
    }
  };

  const handleSearchMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingMemory(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/memory/search?user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: memorySearchQuery,
          category: null
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMemories(data.map((item: any) => ({
          ...item.memory,
          score: item.score
        })));
      }
    } catch (err) {
      console.error("Semantic search failed:", err);
    } finally {
      setIsSearchingMemory(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 text-left">
      {/* Left panel: Preferences & Languages */}
      <div className="space-y-6">
        {/* Add memory form */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-[18px] font-bold text-on-surface mb-6 flex items-center gap-2 font-heading">
            <span className="material-symbols-outlined text-primary">temp_preferences_custom</span> Add Preference Memory
          </h3>
          
          <form onSubmit={handleAddMemory} className="space-y-5">
            <div>
              <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">Category Type</label>
              <select 
                className="w-full bg-surface-container-low border border-surface-variant/20 rounded-xl p-3 text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                value={memoryCategory}
                onChange={(e) => setMemoryCategory(e.target.value)}
              >
                <option value="favorite_destinations">Favorite Destinations</option>
                <option value="travel_style">Travel Style</option>
                <option value="budget_preferences">Budget Preferences</option>
                <option value="trip_history">Trip History</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">Details Context</label>
              <textarea 
                className="w-full bg-surface-container-low border border-surface-variant/20 rounded-xl p-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:border-primary h-32 resize-none"
                placeholder="Enter preferences (e.g. Loves taking trains, prefers boutique hotels with pool access)..."
                value={memoryContent}
                onChange={(e) => setMemoryContent(e.target.value)}
                required
                disabled={isAddingMemory}
              />
            </div>

            {memoryError && (
              <div className="bg-error-container text-on-error-container text-[12px] p-3 rounded-lg border border-error">
                {memoryError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isAddingMemory}
              className="w-full bg-primary hover:bg-opacity-90 text-on-primary rounded-xl py-3.5 text-[14px] font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {isAddingMemory ? "Persisting Memory..." : "Save Preference Memory"}
            </button>
          </form>
        </div>

        {/* Global Language Settings Card */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm">
          <h3 className="text-[18px] font-bold text-on-surface mb-3 flex items-center gap-2 font-heading">
            <span className="material-symbols-outlined text-primary">language</span> Global Language Settings
          </h3>
          <p className="text-[12px] text-on-surface-variant mb-4 leading-relaxed">
            Configure your preferred reading, guide translation, signs, and local helper languages.
          </p>
          <LanguageSelector embeddedOnly={true} />
        </div>
      </div>

      {/* List memories & search */}
      <div className="lg:col-span-2 space-y-6">
        {/* Semantic search memory bar */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-4 font-heading">Semantic Search User Memories</h4>
          <form onSubmit={handleSearchMemory} className="flex gap-3">
            <input 
              type="text"
              className="flex-grow bg-surface-container-low border border-surface-variant/20 rounded-xl p-3.5 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Semantic search (e.g. peaceful traditional temples, resort amenities, luxury budgets)..."
              value={memorySearchQuery}
              onChange={(e) => setMemorySearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-opacity-90 text-on-primary px-6 rounded-xl text-[14px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSearchingMemory ? "Searching..." : "Search"}
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>
          {memorySearchQuery && (
            <div className="mt-3 flex justify-between items-center text-[11px]">
              <span className="text-on-surface-variant">Showing semantic scores based on cosine vector matching</span>
              <button onClick={() => { setMemorySearchQuery(''); loadMemories(); }} className="text-primary underline cursor-pointer">Clear Search</button>
            </div>
          )}
        </div>

        {/* Memory list */}
        <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-6 font-heading">User Memory List</h4>
          {memories.length > 0 ? (
            <div className="space-y-4">
              {memories.map((mem) => (
                <div key={mem.id} className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/20 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                      {mem.category.replace("_", " ")}
                    </span>
                    {mem.score !== undefined && (
                      <span className="text-[11px] text-primary font-bold bg-surface-container-lowest border border-surface-variant/20 px-2 py-0.5 rounded">
                        Relevance: {mem.score.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-medium text-on-surface">{mem.content}</p>
                  <div className="text-[10px] text-on-surface-variant mt-3">
                    Persisted: {new Date(mem.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-outline mb-3">database</span>
              <p className="text-[14px] text-on-surface-variant">No personalization preference records saved yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
