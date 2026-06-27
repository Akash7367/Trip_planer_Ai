'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TripHistoryProps {
  user_id: number;
  onLoadPlanResult: (planResult: any) => void;
  onSwitchTab: (tab: string) => void;
}

export default function TripHistory({ user_id, onLoadPlanResult, onSwitchTab }: TripHistoryProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, [user_id, page, filterFavorites]);

  const loadTrips = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('access_token');
      let url = `${API_URL}/api/v1/trips?user_id=${user_id}&page=${page}&limit=${limit}`;
      if (searchQuery.trim()) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }
      if (filterFavorites) {
        url += `&favorite_only=true`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips);
        setTotal(data.total);
      } else {
        setActionError("Failed to fetch saved trip history.");
      }
    } catch (err) {
      setActionError("Connection error while loading trips.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTrips();
  };

  const handleToggleFavorite = async (id: number, currentFav: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: !currentFav })
      });

      if (res.ok) {
        // Optimistically update
        setTrips(prev => prev.map(t => t.id === id ? { ...t, is_favorite: !currentFav } : t));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip from history?")) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        loadTrips();
      } else {
        setActionError("Failed to delete trip.");
      }
    } catch (err) {
      setActionError("Failed to connect to delete endpoint.");
    }
  };

  const handleReplan = async (id: number) => {
    setIsLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${id}/replan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        // Load plan and switch to Plan tab
        onLoadPlanResult(data.plan_data);
        onSwitchTab('plan');
      } else {
        const errData = await res.json();
        setActionError(errData.detail || "Replan orchestrator execution failed.");
      }
    } catch (err) {
      setActionError("Connection timeout.");
    } finally {
      setIsLoading(false);
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 text-left">
      
      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-grow flex gap-3">
          <input 
            type="text"
            className="flex-grow bg-surface-container-low border border-surface-variant/20 rounded-xl p-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search by destination (e.g. Goa, Kyoto)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-primary text-on-primary px-5 rounded-xl text-[14px] font-bold hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-on-surface-variant">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-primary border-surface-variant/30 focus:ring-0"
              checked={filterFavorites}
              onChange={(e) => { setPage(1); setFilterFavorites(e.target.checked); }}
            />
            Show Favorites Only
          </label>
        </div>
      </div>

      {actionError && (
        <div className="bg-error-container border border-error text-on-error-container p-4 rounded-xl text-[14px]">
          {actionError}
        </div>
      )}

      {/* Trips list */}
      <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider font-heading">Trip History ({total} total)</h4>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-primary font-semibold">
            Loading saved history...
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip.id} className="p-5 rounded-xl bg-surface-container-low border border-surface-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="text-[16px] font-bold text-on-surface">{trip.destination}</h5>
                    <button 
                      onClick={() => handleToggleFavorite(trip.id, trip.is_favorite)}
                      className="text-secondary-container hover:scale-110 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: trip.is_favorite ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  </div>
                  <div className="text-[13px] text-on-surface-variant space-x-4">
                    <span>Duration: {trip.days} Days</span>
                    <span>•</span>
                    <span>Travelers: {trip.travelers}</span>
                    <span>•</span>
                    <span>Saved: {new Date(trip.created_at).toLocaleDateString()}</span>
                  </div>
                  {trip.plan_data?.budget_summary && (
                    <div className="text-[12px] text-primary font-semibold mt-2">
                      Total Cost: ₹{trip.plan_data.budget_summary.total}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {trip.plan_data && (
                    <button 
                      onClick={() => { onLoadPlanResult(trip.plan_data); onSwitchTab('plan'); }}
                      className="flex-grow md:flex-grow-0 px-4 py-2 rounded-xl bg-surface-container-lowest border border-surface-variant/20 text-on-surface hover:bg-surface-container text-[13px] font-bold transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  )}
                  <button 
                    onClick={() => handleReplan(trip.id)}
                    className="flex-grow md:flex-grow-0 px-4 py-2 rounded-xl bg-primary-fixed text-on-primary-fixed text-[13px] font-bold hover:bg-opacity-80 transition-all cursor-pointer"
                  >
                    Replan
                  </button>
                  <button 
                    onClick={() => handleDelete(trip.id)}
                    className="px-3 py-2 rounded-xl bg-error-container text-on-error-container hover:bg-opacity-80 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="pt-6 border-t border-surface-variant/30 flex justify-between items-center text-[14px] text-on-surface-variant">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-xl border border-surface-variant/20 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-semibold">Page {page} of {pages}</span>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                  className="px-4 py-2 rounded-xl border border-surface-variant/20 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[36px] text-outline mb-3">history</span>
            <p className="text-[14px] text-on-surface-variant">No trips recorded in history matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
