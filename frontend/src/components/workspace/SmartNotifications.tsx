'use client';

import React, { useEffect, useState } from 'react';

interface SmartNotificationsProps {
  weatherScore: number;
  rainProbability: number;
  hotelCost?: number;
  totalBudget?: number;
}

interface NotificationAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  icon: string;
}

export default function SmartNotifications({
  weatherScore,
  rainProbability,
  hotelCost,
  totalBudget
}: SmartNotificationsProps) {
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);

  useEffect(() => {
    const list: NotificationAlert[] = [];

    if (weatherScore < 80) {
      list.push({
        id: 'weather',
        type: 'warning',
        message: 'Weather Suitability score is relatively low. Plan outdoor events with care.',
        icon: 'umbrella'
      });
    }

    if (rainProbability > 40) {
      list.push({
        id: 'rain',
        type: 'warning',
        message: `High rain probability (${rainProbability}%). Heavy downpour alerts are active.`,
        icon: 'rainy'
      });
    }

    if (hotelCost && totalBudget && hotelCost > totalBudget * 0.5) {
      list.push({
        id: 'budget',
        type: 'warning',
        message: 'Hotel selection accounts for over 50% of your total budget limits.',
        icon: 'savings'
      });
    }

    // Standard local tip
    list.push({
      id: 'scam',
      type: 'info',
      message: 'Keep QR code payment scans active but verify retail names on validation.',
      icon: 'qr_code_scanner'
    });

    setAlerts(list);
  }, [weatherScore, rainProbability, hotelCost, totalBudget]);

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 text-left">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`flex items-start justify-between p-3.5 rounded-xl border animate-fade-in text-[12.5px] font-semibold ${
            alert.type === 'warning'
              ? 'bg-[#ffebe8] text-[#ba1a1a] border-[#ffdad6]'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">{alert.icon}</span>
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0 ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
