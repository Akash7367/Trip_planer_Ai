'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
}

export default function VoiceControls({ onTranscript }: VoiceControlsProps) {
  const { currentLanguage } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  const startVoiceCapture = () => {
    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecObj) {
      alert('Speech recognition is not supported on this browser version.');
      return;
    }

    const recognition = new SpeechRecObj();
    recognition.continuous = false;
    recognition.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        onTranscript(resultText);
      }
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startVoiceCapture}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border-none shrink-0 ${
        isListening
          ? 'bg-red-600 text-white animate-pulse'
          : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
      }`}
      title={isListening ? 'Listening...' : 'Speak to Assistant'}
    >
      <span className="material-symbols-outlined text-[20px]">
        {isListening ? 'mic' : 'keyboard_voice'}
      </span>
    </button>
  );
}
