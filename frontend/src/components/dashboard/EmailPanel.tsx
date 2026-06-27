'use client';

import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface EmailPanelProps {
  tripId: number | null;
  onSaveFirst: () => Promise<number | null>;
}

export default function EmailPanel({ tripId, onSaveFirst }: EmailPanelProps) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      let activeTripId = tripId;
      if (!activeTripId) {
        activeTripId = await onSaveFirst();
        if (!activeTripId) {
          setError("Save the trip first to enable email delivery.");
          setIsSending(false);
          return;
        }
      }

      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips/${activeTripId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSuccess(true);
        setEmail('');
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to send email.");
      }
    } catch (err) {
      setError("Network error while sending email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-surface-variant/30 rounded-2xl p-6 shadow-sm text-left">
      <h4 className="text-[14px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 font-heading">Email Delivery</h4>
      <p className="text-[12px] text-on-surface-variant/85 mb-4">
        Deliver trip HTML/PDF confirmation and full budget/itinerary breakdown directly to your inbox.
      </p>
      <form onSubmit={handleSend} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient email..."
            required
            className="flex-grow bg-surface-container-low border border-surface-variant/20 rounded-xl px-4 py-2.5 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isSending}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
        {success && (
          <p className="text-[12px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Trip plan successfully delivered via email!
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
