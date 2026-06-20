'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin" />
        <span className="text-slate-400 font-medium text-sm animate-pulse">Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevents flashing content before redirect
  }

  return <>{children}</>;
}
