'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Add memory form */}
      <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm h-fit">
        <h3 className="text-[18px] font-bold text-[#001a41] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0058bc]">temp_preferences_custom</span> Add Preference Memory
        </h3>
        
        <form onSubmit={handleAddMemory} className="space-y-5">
          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Category Type</label>
            <select 
              className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none"
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
            <label className="text-[12px] font-bold uppercase tracking-wider text-[#414755] block mb-2">Details Context</label>
            <textarea 
              className="w-full bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] text-[#1a1b1f] focus:outline-none focus:border-[#0058bc] h-32 resize-none"
              placeholder="Enter preferences (e.g. Loves taking trains, prefers boutique hotels with pool access)..."
              value={memoryContent}
              onChange={(e) => setMemoryContent(e.target.value)}
              required
              disabled={isAddingMemory}
            />
          </div>

          {memoryError && (
            <div className="bg-[#ffdad6] text-[#93000a] text-[12px] p-3 rounded-lg border border-[#ba1a1a]">
              {memoryError}
            </div>
          )}

          <button 
            type="submit"
            disabled={isAddingMemory}
            className="w-full bg-[#0058bc] hover:bg-opacity-90 text-white rounded-xl py-3.5 text-[14px] font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {isAddingMemory ? "Persisting Memory..." : "Save Preference Memory"}
          </button>
        </form>
      </div>

      {/* List memories & search */}
      <div className="lg:col-span-2 space-y-6">
        {/* Semantic search memory bar */}
        <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
          <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider mb-4">Semantic Search User Memories</h4>
          <form onSubmit={handleSearchMemory} className="flex gap-3">
            <input 
              type="text"
              className="flex-grow bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3.5 text-[14px] focus:outline-none"
              placeholder="Semantic search (e.g. peaceful traditional temples, resort amenities, luxury budgets)..."
              value={memorySearchQuery}
              onChange={(e) => setMemorySearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[#0058bc] hover:bg-opacity-90 text-white px-6 rounded-xl text-[14px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSearchingMemory ? "Searching..." : "Search"}
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>
          {memorySearchQuery && (
            <div className="mt-3 flex justify-between">
              <span className="text-[11px] text-[#414755]">Showing semantic scores based on cosine vector matching</span>
              <button onClick={() => { setMemorySearchQuery(''); loadMemories(); }} className="text-[11px] text-[#0058bc] underline">Clear Search</button>
            </div>
          )}
        </div>

        {/* Memory list */}
        <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
          <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider mb-6">User Memory List</h4>
          {memories.length > 0 ? (
            <div className="space-y-4">
              {memories.map((mem) => (
                <div key={mem.id} className="p-4 rounded-xl bg-[#f4f3f8] border border-[#eeedf3] relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-[#d8e2ff] text-[#001a41] text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                      {mem.category.replace("_", " ")}
                    </span>
                    {mem.score !== undefined && (
                      <span className="text-[11px] text-[#0058bc] font-bold bg-white border border-[#eeedf3] px-2 py-0.5 rounded">
                        Relevance: {mem.score.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-medium text-[#1a1b1f]">{mem.content}</p>
                  <div className="text-[10px] text-[#414755] mt-3">
                    Persisted: {new Date(mem.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-[#717786] mb-3">database</span>
              <p className="text-[14px] text-[#414755]">No personalization preference records saved yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
