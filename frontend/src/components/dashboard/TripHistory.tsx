'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TripHistoryProps {
  user_id: number;
  onLoadPlanResult: (plan: any) => void;
  onSwitchTab: (tab: 'plan' | 'preferences' | 'history') => void;
}

export default function TripHistory({ user_id, onLoadPlanResult, onSwitchTab }: TripHistoryProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [user_id, page, filterFavorites]);

  const fetchTrips = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('access_token');
      let url = `${API_URL}/api/v1/trips?user_id=${user_id}&page=${page}&limit=${limit}`;
      if (searchQuery) {
        url += `&query=${encodeURIComponent(searchQuery)}`;
      }
      if (filterFavorites) {
        url += `&is_favorite=true`;
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
        setPages(data.pages);
      } else {
        setActionError("Failed to fetch trip history.");
      }
    } catch (err) {
      setActionError("Connection failure. Check if server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTrips();
  };

  const handleToggleFavorite = async (id: number, currentStatus: boolean) => {
    setActionError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_favorite: !currentStatus })
      });
      if (res.ok) {
        fetchTrips();
      } else {
        setActionError("Failed to update favorite status.");
      }
    } catch (err) {
      setActionError("Connection failure.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip from history?")) return;
    setActionError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchTrips();
      } else {
        setActionError("Failed to delete trip.");
      }
    } catch (err) {
      setActionError("Connection failure.");
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
        const updatedTrip = await res.json();
        if (updatedTrip.plan_data) {
          onLoadPlanResult(updatedTrip.plan_data);
          onSwitchTab('plan'); // switch to planner view to inspect
        } else {
          setActionError("Replan did not return plan data.");
        }
      } else {
        setActionError("Replan orchestrator execution failed.");
      }
    } catch (err) {
      setActionError("Connection timeout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-grow flex gap-3">
          <input 
            type="text"
            className="flex-grow bg-[#f4f3f8] border border-[#eeedf3] rounded-xl p-3 text-[14px] focus:outline-none"
            placeholder="Search by destination (e.g. Goa, Kyoto)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-[#0058bc] text-white px-5 rounded-xl text-[14px] font-bold hover:bg-opacity-90 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-[#414755]">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-[#0058bc] border-[#eeedf3] focus:ring-0"
              checked={filterFavorites}
              onChange={(e) => { setPage(1); setFilterFavorites(e.target.checked); }}
            />
            Show Favorites Only
          </label>
        </div>
      </div>

      {actionError && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] p-4 rounded-xl text-[14px]">
          {actionError}
        </div>
      )}

      {/* Trips list */}
      <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider">Trip History ({total} total)</h4>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[#0058bc] font-semibold">
            Loading saved history...
          </div>
        ) : trips.length > 0 ? (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip.id} className="p-5 rounded-xl bg-[#f4f3f8] border border-[#eeedf3] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="text-[16px] font-bold text-[#001a41]">{trip.destination}</h5>
                    <button 
                      onClick={() => handleToggleFavorite(trip.id, trip.is_favorite)}
                      className="text-[#fd9d06] hover:scale-110 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: trip.is_favorite ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    </button>
                  </div>
                  <div className="text-[13px] text-[#414755] space-x-4">
                    <span>Duration: {trip.days} Days</span>
                    <span>•</span>
                    <span>Travelers: {trip.travelers}</span>
                    <span>•</span>
                    <span>Saved: {new Date(trip.created_at).toLocaleDateString()}</span>
                  </div>
                  {trip.plan_data?.budget_summary && (
                    <div className="text-[12px] text-[#0058bc] font-semibold mt-2">
                      Total Cost: ${trip.plan_data.budget_summary.total}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {trip.plan_data && (
                    <button 
                      onClick={() => { onLoadPlanResult(trip.plan_data); onSwitchTab('plan'); }}
                      className="flex-grow md:flex-grow-0 px-4 py-2 rounded-xl bg-white border border-[#eeedf3] hover:bg-[#faf9fe] text-[13px] font-bold transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  )}
                  <button 
                    onClick={() => handleReplan(trip.id)}
                    className="flex-grow md:flex-grow-0 px-4 py-2 rounded-xl bg-[#d8e2ff] text-[#001a41] text-[13px] font-bold hover:bg-opacity-80 transition-all cursor-pointer"
                  >
                    Replan
                  </button>
                  <button 
                    onClick={() => handleDelete(trip.id)}
                    className="px-3 py-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-opacity-80 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="pt-6 border-t border-[#eeedf3] flex justify-between items-center text-[14px]">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-xl border border-[#eeedf3] disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="font-semibold">Page {page} of {pages}</span>
                <button 
                  disabled={page === pages}
                  onClick={() => setPage(prev => Math.min(prev + 1, pages))}
                  className="px-4 py-2 rounded-xl border border-[#eeedf3] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[36px] text-[#717786] mb-3">history</span>
            <p className="text-[14px] text-[#414755]">No trips recorded in history matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
