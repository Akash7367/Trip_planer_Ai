'use client';

import React, { useState, useMemo } from 'react';
import ChatMessages, { Message } from './ChatMessages';
import ChatActions from './ChatActions';
import VoiceControls from './VoiceControls';
import { useLanguage } from '@/context/LanguageContext';

export interface TravelAssistantProps {
  planContext?: any;
}

export default function TravelAssistant({ planContext }: TravelAssistantProps) {
  const { currentLanguage, speakText } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Local Travel Companion. Ask me anything about routes, safety warnings, budget tracking, or translate signs on the go!',
      agentName: 'Local Guide Agent',
      timestamp: 'Just Now'
    }
  ]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append User Message
    const userMsg: Message = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        text: msg.text
      }));

      const res = await fetch(`${API_URL}/api/v1/ai/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          plan_context: planContext || null,
          conversation_history: history
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          sender: 'ai',
          text: data.reply,
          agentName: data.agent_name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        speakText(data.reply, currentLanguage.code);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        sender: 'ai',
        text: 'Sorry, I am facing connectivity issues connecting to the travel agent networks. Please check your internet connection.',
        agentName: 'System Error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Mock Menu/Sign OCR upload simulator
  const handleOcrUpload = () => {
    handleSendMessage('Analyze and translate this restaurant menu / street sign image [OCR Upload]');
  };

  return (
    <div className="fixed bottom-24 right-6 z-[110] text-left">
      
      {/* Chat Bubble Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-opacity-95 text-on-primary rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer border-none"
          title="Open AI Travel Assistant"
        >
          <span className="material-symbols-outlined text-[26px]">chat</span>
        </button>
      )}

      {/* Interactive Chat Console Panel */}
      {isOpen && (
        <div className="bg-surface-lowest w-[340px] h-[450px] rounded-2xl shadow-2xl border border-surface-variant flex flex-col overflow-hidden animate-scale-up">
          
          {/* Header */}
          <div className="p-4 border-b border-surface-variant/30 bg-primary text-on-primary flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              <div>
                <h4 className="font-extrabold text-[13.5px]">Local Travel Companion</h4>
                <span className="text-[9px] text-primary-container font-bold uppercase tracking-wider block">Multi-Agent System</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-primary hover:text-primary-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Messages Stream */}
          <ChatMessages messages={messages} isTyping={isTyping} />

          {/* Quick Context Suggestion Chips */}
          <ChatActions onSelectSuggestion={handleSendMessage} />

          {/* Input Controls Bar */}
          <div className="p-3 border-t border-surface-variant/20 bg-surface-container flex items-center gap-2">
            
            {/* Mock Image Upload for OCR translation */}
            <button
              onClick={handleOcrUpload}
              className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-all cursor-pointer border-none"
              title="Upload Menu/Sign for OCR translation"
            >
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask safety, translate signs, ATMs..."
              className="flex-grow bg-surface p-2.5 rounded-xl text-[12px] outline-none border border-surface-variant/30 text-on-surface"
            />

            {/* Voice Capture */}
            <VoiceControls onTranscript={handleSendMessage} />
          </div>

        </div>
      )}

    </div>
  );
}
