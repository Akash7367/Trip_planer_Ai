'use client';

import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ReplanPanelProps {
  tripId: number | null;
  onSaveFirst: () => Promise<number | null>;
  onPlanUpdated: (updatedPlanData: any, newDestination?: string) => void;
}

export default function ReplanPanel({ tripId, onSaveFirst, onPlanUpdated }: ReplanPanelProps) {
  const [replanType, setReplanType] = useState<'budget' | 'weather' | 'itinerary'>('budget');
  const [overrideValue, setOverrideValue] = useState('');
  const [isReplanning, setIsReplanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReplan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReplanning(true);
    setError(null);
    setSuccess(false);

    try {
      let activeTripId = tripId;
      if (!activeTripId) {
        activeTripId = await onSaveFirst();
        if (!activeTripId) {
          setError("Save the trip first to enable selective replanning.");
          setIsReplanning(false);
          return;
        }
      }

      const payload: any = { replan_type: replanType };
      if (replanType === 'budget') {
        payload.budget_override = parseFloat(overrideValue);
        if (isNaN(payload.budget_override)) {
          setError("Please enter a valid budget amount.");
          setIsReplanning(false);
          return;
        }
      } else if (replanType === 'weather') {
        payload.destination_override = overrideValue;
        if (!overrideValue) {
          setError("Please specify the new destination.");
          setIsReplanning(false);
          return;
        }
      } else if (replanType === 'itinerary') {
        payload.closed_attraction = overrideValue;
        if (!overrideValue) {
          setError("Please specify the closed attraction.");
          setIsReplanning(false);
          return;
        }
      }

      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${activeTripId}/replan-selective`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onPlanUpdated(data.plan_data, payload.destination_override);
        setSuccess(true);
        setOverrideValue('');
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to selectively replan.");
      }
    } catch (err) {
      setError("Network error while replanning.");
    } finally {
      setIsReplanning(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left">
      <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-heading">Dynamic Replanning</h4>
      <p className="text-[12px] text-on-surface-variant/85 mb-4">
        Regenerate only affected sections of your trip schedule or budget when circumstances change.
      </p>
      
      <form onSubmit={handleReplan} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">What changed?</label>
            <select
              value={replanType}
              onChange={(e) => {
                setReplanType(e.target.value as any);
                setOverrideValue('');
              }}
              className="w-full bg-surface-container-low border border-surface-variant/20 rounded-xl px-4 py-2.5 text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="budget">Budget Changes</option>
              <option value="weather">Change Destination / Weather</option>
              <option value="itinerary">Attraction Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              {replanType === 'budget' && 'New Budget (₹)'}
              {replanType === 'weather' && 'New Destination City'}
              {replanType === 'itinerary' && 'Name of Closed Attraction'}
            </label>
            <input
              type="text"
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
              placeholder={
                replanType === 'budget' ? 'e.g. 50000' :
                replanType === 'weather' ? 'e.g. London' : 'e.g. Eiffel Tower'
              }
              required
              className="w-full bg-surface-container-low border border-surface-variant/20 rounded-xl px-4 py-2.5 text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isReplanning}
          className="w-full bg-primary text-on-primary py-2.5 rounded-xl text-[13px] font-bold hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">autorenew</span>
          {isReplanning ? 'Regenerating Affected Sections...' : 'Run Selective Replan'}
        </button>

        {success && (
          <p className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Trip updated successfully (regenerated affected components only)!
          </p>
        )}
        {error && (
          <p className="text-[12px] text-error font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
