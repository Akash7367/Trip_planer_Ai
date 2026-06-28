'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VoicePlannerProps {
  user_id: string | number;
  onPlanResult: (plan: any) => void;
  onPlanningError: (err: string | null) => void;
  onLoadingStatus: (loading: boolean) => void;
  onSaveTripTrigger?: () => Promise<any>;
}

export default function VoicePlanner({
  user_id,
  onPlanResult,
  onPlanningError,
  onLoadingStatus,
  onSaveTripTrigger
}: VoicePlannerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [spokenFeedback, setSpokenFeedback] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpokenFeedback('');
      };

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setSpokenFeedback(text);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleProcessVoiceCommand = async (command: string) => {
    const cleaned = command.toLowerCase().trim();
    if (!cleaned) return;

    speak("Processing voice command...");
    onLoadingStatus(true);
    onPlanningError(null);

    // 1. Check utility commands
    if (cleaned.includes("download pdf") || cleaned.includes("export pdf")) {
      const downloadBtn = document.querySelector('[onClick*="handlePdfDownload"]') as HTMLButtonElement;
      if (downloadBtn) {
        downloadBtn.click();
        speak("Downloading your PDF trip plan.");
      } else {
        speak("No active plan to download yet.");
      }
      onLoadingStatus(false);
      return;
    }

    if (cleaned.includes("save trip") || cleaned.includes("save this trip")) {
      if (onSaveTripTrigger) {
        const savedId = await onSaveTripTrigger();
        if (savedId) {
          speak("Trip saved successfully to history.");
        } else {
          speak("Could not save the trip.");
        }
      } else {
        speak("Save action is currently unavailable.");
      }
      onLoadingStatus(false);
      return;
    }

    // 2. Default: Submit natural language planning prompt
    try {
      const token = localStorage.getItem('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/v1/orchestrator/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: command,
          source_city: 'Mumbai',
          user_id: user_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.plan) {
          onPlanResult(data.plan);
          const feedback = `Successfully planned trip to ${data.plan.destination} for ${data.plan.days} days. Estimated total budget is ${data.plan.budget_summary?.total} dollars.`;
          speak(feedback);
        } else {
          const errMsg = data.error || "Plan generation completed with errors.";
          onPlanningError(errMsg);
          speak("Failed to compile trip plan. Please try again.");
        }
      } else {
        onPlanningError("API error response.");
        speak("Error communicating with orchestrator agent.");
      }
    } catch (err) {
      onPlanningError("Connection error.");
      speak("Connection error while calling travel orchestrator.");
    } finally {
      onLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (transcript && !isListening) {
      handleProcessVoiceCommand(transcript);
    }
  }, [isListening, transcript]);

  return (
    <div className="bg-gradient-to-br from-[#001a41] to-[#003c88] rounded-2xl p-6 text-white shadow-xl flex items-center justify-between gap-6 mb-6">
      <div className="flex-grow space-y-2">
        <h4 className="text-[15px] font-bold uppercase tracking-wider text-[#fd9d06] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[20px] animate-pulse">mic</span>
          Voice-Based Trip Planner
        </h4>
        <p className="text-[12px] text-blue-100">
          Try saying: <span className="italic font-semibold text-[#fd9d06]">"Plan a Goa trip for next month."</span> or <span className="italic font-semibold text-[#fd9d06]">"Download PDF"</span>
        </p>
        
        {transcript && (
          <div className="bg-white/10 rounded-xl p-3 border border-white/15">
            <span className="text-[11px] uppercase tracking-wider block text-blue-200 mb-1">You said:</span>
            <p className="text-[14px] font-medium italic text-slate-100">"{transcript}"</p>
          </div>
        )}

        {spokenFeedback && (
          <div className="bg-[#fd9d06]/10 rounded-xl p-3 border border-[#fd9d06]/20">
            <span className="text-[11px] uppercase tracking-wider block text-[#fd9d06] mb-1">Response:</span>
            <p className="text-[13px] font-medium text-[#fd9d06]">{spokenFeedback}</p>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            isListening 
              ? 'bg-[#ba1a1a] hover:bg-red-700 animate-pulse' 
              : 'bg-[#fd9d06] hover:bg-[#e08900]'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]">
            {isListening ? 'graphic_eq' : 'mic'}
          </span>
        </button>
      </div>
    </div>
  );
}
