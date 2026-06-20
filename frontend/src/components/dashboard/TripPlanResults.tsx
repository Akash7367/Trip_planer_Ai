'use client';

import React, { useState, useEffect } from 'react';
import PdfTemplate from '../PdfTemplate';
import { exportHtmlToPdf } from '../../lib/pdf';
import EmailPanel from './EmailPanel';
import ReplanPanel from './ReplanPanel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TripPlanResultsProps {
  user_id: number;
  planResult: any;
  planningError: string | null;
}

export default function TripPlanResults({ user_id, planResult, planningError }: TripPlanResultsProps) {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedTripId, setSavedTripId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState(false);

  useEffect(() => {
    setCurrentPlan(planResult);
    setSavedTripId(null);
    setSaveSuccess(false);
    setSaveError(null);
  }, [planResult]);

  const handleSaveTrip = async (): Promise<number | null> => {
    if (!currentPlan || !user_id) return null;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips?user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: currentPlan.destination,
          days: currentPlan.days,
          travelers: currentPlan.travelers,
          plan_data: currentPlan
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSavedTripId(data.id);
        setSaveSuccess(true);
        return data.id;
      } else {
        const errData = await res.json();
        setSaveError(errData.detail || "Failed to save trip to history.");
        return null;
      }
    } catch (err) {
      setSaveError("Connection error while saving trip.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePdfDownload = async () => {
    setIsPdfExporting(true);
    try {
      await exportHtmlToPdf('pdf-export-container', `trip-${currentPlan?.destination || 'plan'}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPdfExporting(false);
    }
  };

  if (planningError) {
    return (
      <div className="bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] p-4 rounded-xl text-[14px]">
        {planningError}
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="bg-white border border-[#eeedf3] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-[48px] text-[#717786] mb-4">map</span>
        <h4 className="text-[18px] font-bold text-[#001a41] mb-2">No active itinerary plan loaded</h4>
        <p className="text-[#414755] text-[14px] max-w-md">
          Input your desired destination, traveler configuration, and duration guidelines in the form to coordinate agent planning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Executive summary block */}
      <div className="bg-[#d8e2ff] border border-[#adc6ff] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-grow">
          <h4 className="text-[14px] font-bold text-[#001a41] uppercase tracking-wider mb-2">Executive Summary</h4>
          <p className="text-[16px] text-[#001a41] font-medium leading-relaxed">
            {currentPlan.executive_summary}
          </p>
        </div>
        <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
          {saveSuccess ? (
            <span className="bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[18px]">check_circle</span> Saved
            </span>
          ) : (
            <button 
              onClick={handleSaveTrip}
              disabled={isSaving}
              className="w-full bg-[#0058bc] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">bookmark</span> {isSaving ? "Saving..." : "Save Trip"}
            </button>
          )}
          
          <button
            onClick={handlePdfDownload}
            disabled={isPdfExporting}
            className="w-full bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            {isPdfExporting ? 'Generating PDF...' : 'Download PDF'}
          </button>
          
          {saveError && <div className="text-[11px] text-[#ba1a1a] mt-1 text-center">{saveError}</div>}
        </div>
      </div>

      {/* Advanced actions row: Email and Selective Replan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmailPanel tripId={savedTripId} onSaveFirst={handleSaveTrip} />
        <ReplanPanel 
          tripId={savedTripId} 
          onSaveFirst={handleSaveTrip} 
          onPlanUpdated={(newPlan) => {
            setCurrentPlan(newPlan);
          }} 
        />
      </div>

      {/* Weather and details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather card */}
        <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider">Weather Overview</h4>
            <span className="bg-[#f4f3f8] px-3 py-1 rounded-full text-[12px] font-bold text-[#0058bc]">
              Suitability: {currentPlan.weather_analysis?.suitability_score}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[40px] text-[#fd9d06]">wb_sunny</span>
            <div>
              <div className="text-[28px] font-bold">{currentPlan.weather_analysis?.temperature}</div>
              <div className="text-[13px] text-[#414755]">Rain Probability: {currentPlan.weather_analysis?.rain_probability}</div>
            </div>
          </div>
        </div>

        {/* Bookings summary */}
        <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider">Lodging & Transit</h4>
          
          {currentPlan.hotel_recommendation && (
            <div className="flex justify-between items-center bg-[#f4f3f8] p-3 rounded-xl border border-[#eeedf3]">
              <div>
                <div className="text-[14px] font-bold">{currentPlan.hotel_recommendation.hotel}</div>
                <div className="text-[12px] text-[#414755]">Rating: ★ {currentPlan.hotel_recommendation.rating}</div>
              </div>
              <div className="text-[14px] font-bold text-[#0058bc]">${currentPlan.hotel_recommendation.price}/nt</div>
            </div>
          )}

          {currentPlan.transport_recommendation && (
            <div className="flex justify-between items-center bg-[#f4f3f8] p-3 rounded-xl border border-[#eeedf3]">
              <div>
                <div className="text-[14px] font-bold">{currentPlan.transport_recommendation.mode} Transit</div>
                <div className="text-[12px] text-[#414755]">Duration: {currentPlan.transport_recommendation.duration}</div>
              </div>
              <div className="text-[14px] font-bold text-[#0058bc]">${currentPlan.transport_recommendation.cost}</div>
            </div>
          )}
        </div>
      </div>

      {/* Day-wise itinerary display */}
      <div className="bg-white border border-[#eeedf3] rounded-2xl p-6 shadow-sm">
        <h4 className="text-[14px] font-bold text-[#414755] uppercase tracking-wider mb-6">Day-Wise Itinerary Plan</h4>
        <div className="space-y-6">
          {currentPlan.day_wise_itinerary?.itinerary?.map((day: any, i: number) => (
            <div key={i} className="relative pl-8 border-l border-[#eeedf3] last:border-l-0">
              <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-[#0058bc] text-white flex items-center justify-center font-bold text-[11px]">
                {day.day}
              </div>
              <div className="mb-4">
                <h5 className="text-[15px] font-bold text-[#001a41]">Day {day.day} Schedule</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#f4f3f8] p-3 rounded-xl border border-[#eeedf3]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0058bc] mb-1">Morning</div>
                  <p className="text-[13px] leading-relaxed">{day.morning}</p>
                </div>
                <div className="bg-[#f4f3f8] p-3 rounded-xl border border-[#eeedf3]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0058bc] mb-1">Afternoon</div>
                  <p className="text-[13px] leading-relaxed">{day.afternoon}</p>
                </div>
                <div className="bg-[#f4f3f8] p-3 rounded-xl border border-[#eeedf3]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#0058bc] mb-1">Evening</div>
                  <p className="text-[13px] leading-relaxed">{day.evening}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Export Markup Template for rendering/exporting */}
      <PdfTemplate 
        planResult={currentPlan}
        destination={currentPlan.destination}
        days={currentPlan.days}
        travelers={currentPlan.travelers}
      />
    </div>
  );
}
