'use client';

import React from 'react';

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  agentName?: string; // e.g. "Safety Agent", "Translation Agent"
  timestamp: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] custom-scrollbar text-[12.5px]">
      {messages.map((msg, idx) => {
        const isAi = msg.sender === 'ai';
        return (
          <div
            key={idx}
            className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1`}
          >
            {/* Agent tag if applicable */}
            {isAi && msg.agentName && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">
                🤖 {msg.agentName}
              </span>
            )}
            
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                isAi
                  ? 'bg-surface-container-high text-on-surface rounded-tl-none border border-surface-variant/20'
                  : 'bg-primary text-on-primary rounded-tr-none'
              }`}
            >
              <p className="whitespace-pre-line font-medium">{msg.text}</p>
            </div>
            
            <span className="text-[9px] text-on-surface-variant px-1 font-semibold">
              {msg.timestamp}
            </span>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-surface-container-high w-16 rounded-tl-none animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      )}
    </div>
  );
}
