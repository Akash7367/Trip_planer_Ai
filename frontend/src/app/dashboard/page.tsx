'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import sub-components
import TripPlannerForm from '@/components/dashboard/TripPlannerForm';
import TripPlanResults from '@/components/dashboard/TripPlanResults';
import MemoryManager from '@/components/dashboard/MemoryManager';
import TripHistory from '@/components/dashboard/TripHistory';
import VoicePlanner from '@/components/dashboard/VoicePlanner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function DashboardContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  
  // Tab control: 'plan' | 'preferences' | 'history'
  const [activeTab, setActiveTab] = useState<'plan' | 'preferences' | 'history'>('plan');
  
  // Trip generation state
  const [query, setQuery] = useState('');
  const [sourceCity, setSourceCity] = useState('Mumbai');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [isPlanning, setIsPlanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [planResult, setPlanResult] = useState<any>(null);
  const [planningError, setPlanningError] = useState<string | null>(null);

  const handleSaveTripExternal = async (): Promise<number | null> => {
    if (!planResult || !user) return null;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/trips?user_id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: planResult.destination,
          days: planResult.days,
          travelers: planResult.travelers,
          plan_data: planResult
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.id;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setQuery(promptParam);
    }
  }, [searchParams]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !user) return;
    setIsPlanning(true);
    setPlanningError(null);
    setLogs(["Initializing Orchestrator graph connection..."]);
    setPlanResult(null);

    const logStages = [
      "Running Trip Understanding Agent to extract requirements...",
      "Matching interests against Destination Recommendation database...",
      "Querying Weather Intelligence forecasts & scoring suitability...",
      "Transport Agent compiling transit options...",
      "Accommodation Agent sorting hotels & matching amenity filters...",
      "Budget Agent aggregating costs and applying emergency buffer...",
      "Itinerary Agent compiling day-by-day schedule blocks...",
      "Final Planner Agent summarizing total compiled trip plan..."
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < logStages.length) {
        setLogs(prev => [...prev, logStages[currentStage]]);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 900);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_URL}/api/v1/orchestrator/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `${query} for ${days} days and ${travelers} people`,
          source_city: sourceCity,
          user_id: user.id
        })
      });

      clearInterval(interval);

      if (res.ok) {
        const data = await res.json();
        setPlanResult(data.plan);
        setLogs(prev => [...prev, ...data.logs, "SUCCESS: Complete trip plan compiled successfully!"]);
      } else {
        const errData = await res.json();
        setPlanningError(errData.detail || "Multi-agent workflow failed to execute.");
        setLogs(prev => [...prev, "ERROR: Graph execution terminated prematurely."]);
      }
    } catch (err) {
      clearInterval(interval);
      setPlanningError("Connection to orchestrator backend failed. Check if server is running.");
      setLogs(prev => [...prev, "ERROR: Connection timeout."]);
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fe] text-[#1a1b1f] flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-[#eeedf3] bg-white/85 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1280px] mx-auto px-[64px] h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-[22px] text-[#0058bc] tracking-tight">AeroGuide</span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab('plan')}
              className={`text-[15px] font-semibold transition-colors ${activeTab === 'plan' ? 'text-[#0058bc]' : 'text-[#414755] hover:text-[#0058bc]'}`}
            >
              Console Planner
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`text-[15px] font-semibold transition-colors ${activeTab === 'history' ? 'text-[#0058bc]' : 'text-[#414755] hover:text-[#0058bc]'}`}
            >
              My Trips
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`text-[15px] font-semibold transition-colors ${activeTab === 'preferences' ? 'text-[#0058bc]' : 'text-[#414755] hover:text-[#0058bc]'}`}
            >
              My Memories
            </button>
            
            <div className="h-4 w-[1px] bg-[#eeedf3]"></div>
            
            <div className="flex items-center space-x-3">
              <span className="text-[14px] font-medium text-[#414755]">{user?.name}</span>
              <button 
                onClick={logout}
                className="px-4 py-1.5 rounded-full border border-[#eeedf3] hover:bg-[#f4f3f8] text-[#414755] text-[12px] font-semibold transition-all active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-[20px] md:px-[64px] py-10 flex-grow w-full relative z-10">
        {activeTab === 'plan' && user && (
          <div className="grid lg:grid-cols-3 gap-8">
            <TripPlannerForm 
              query={query}
              setQuery={setQuery}
              sourceCity={sourceCity}
              setSourceCity={setSourceCity}
              days={days}
              setDays={setDays}
              travelers={travelers}
              setTravelers={setTravelers}
              isPlanning={isPlanning}
              logs={logs}
              onSubmit={handleCreatePlan}
            />
            <div className="lg:col-span-2 space-y-6">
              <VoicePlanner
                user_id={user.id}
                onPlanResult={(plan) => setPlanResult(plan)}
                onPlanningError={(err) => setPlanningError(err)}
                onLoadingStatus={(loading) => setIsPlanning(loading)}
                onSaveTripTrigger={handleSaveTripExternal}
              />
              <TripPlanResults 
                user_id={user.id}
                planResult={planResult}
                planningError={planningError}
              />
            </div>
          </div>
        )}

        {activeTab === 'preferences' && user && (
          <MemoryManager user_id={user.id} />
        )}

        {activeTab === 'history' && user && (
          <TripHistory 
            user_id={user.id} 
            onLoadPlanResult={(plan) => setPlanResult(plan)}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen bg-[#faf9fe] flex items-center justify-center text-[16px] font-semibold text-[#0058bc]">
          Loading Dashboard Planner Console...
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
