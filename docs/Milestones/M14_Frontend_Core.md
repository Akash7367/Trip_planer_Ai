# M14 — Frontend Core

**Milestone:** 14 of 20 | **Duration:** 2 Weeks | **Depends On:** M12

---

## 1. Objective

Build the complete Next.js frontend application covering all core pages (Auth, Dashboard, Trip Planner, Trip Detail, Profile) with a premium, responsive UI design system, authentication flow, API integration, and real-time trip planning interface.

---

## 2. Scope

- Authentication pages: Login, Register.
- Dashboard: Trip history list with search and filter.
- Trip Planner: Main planning interface with natural language input.
- Trip Detail: Full plan display with tabbed sections.
- User Profile: Preferences and memory management.
- `AuthContext` for JWT management.
- API client with token refresh interceptor.
- Loading states, error states, and optimistic updates.

---

## 3. Page Architecture

```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx          # Dashboard shell with nav
│   ├── page.tsx            # Dashboard home (trip history)
│   ├── plan/page.tsx       # Trip planning interface
│   ├── trips/
│   │   └── [id]/page.tsx   # Trip detail view
│   └── profile/page.tsx    # User profile & preferences
├── layout.tsx              # Root layout
└── page.tsx                # Landing page
```

---

## 4. Design System

```css
/* src/app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap');

:root {
  --color-primary: 230 100% 60%;          /* Vibrant blue */
  --color-primary-dark: 230 100% 50%;
  --color-secondary: 280 80% 65%;         /* Purple accent */
  --color-accent: 45 100% 60%;            /* Gold for CTAs */
  --color-surface: 220 15% 8%;            /* Near-black bg */
  --color-surface-2: 220 15% 12%;         /* Card bg */
  --color-surface-3: 220 15% 18%;         /* Input bg */
  --color-text: 0 0% 95%;                 /* Near-white text */
  --color-text-muted: 0 0% 60%;           /* Muted text */
  --color-border: 220 15% 22%;            /* Subtle borders */
  --color-success: 142 76% 45%;
  --color-warning: 38 92% 50%;
  --color-error: 0 72% 51%;
  --radius: 0.75rem;
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;
}
```

---

## 5. AuthContext

```typescript
// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  travel_style: string;
  preferred_currency: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await apiClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setAccessToken(access_token);
    await fetchCurrentUser(access_token);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refresh_token: refreshToken });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, register: async () => {}, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

---

## 6. API Client

```typescript
// src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 90000, // 90s for AI planning requests
});

// Request interceptor: attach access token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token: newRefresh } = res.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefresh);
          original.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Key Components

### Trip Planner Component
```typescript
// src/components/planning/TripPlannerInput.tsx
'use client';

export function TripPlannerInput({ onPlanGenerated }: { onPlanGenerated: (plan: any) => void }) {
  const [query, setQuery] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [phase, setPhase] = useState('');

  const PLANNING_PHASES = [
    'Understanding your request...',
    'Researching destinations...',
    'Checking weather forecasts...',
    'Finding best hotels...',
    'Planning transportation...',
    'Optimizing your budget...',
    'Building your itinerary...',
    'Finalizing your perfect trip...'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlanning(true);
    
    // Animate through phases
    let phaseIndex = 0;
    const phaseInterval = setInterval(() => {
      setPhase(PLANNING_PHASES[phaseIndex % PLANNING_PHASES.length]);
      phaseIndex++;
    }, 4500);

    try {
      const response = await apiClient.post('/trips/plan', { request: query });
      clearInterval(phaseInterval);
      onPlanGenerated(response.data);
    } catch (error) {
      clearInterval(phaseInterval);
      // Handle error
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="trip-planner-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your dream trip... e.g. '7-day Japan trip for 2 in April, budget $4000, love food and temples'"
          disabled={isPlanning}
          className="plan-input"
        />
        <button type="submit" disabled={isPlanning || !query.trim()}>
          {isPlanning ? 'Planning...' : '✨ Plan My Trip'}
        </button>
      </form>
      
      {isPlanning && (
        <div className="planning-indicator">
          <div className="spinner" />
          <span>{phase}</span>
        </div>
      )}
    </div>
  );
}
```

### Trip Plan Display
```typescript
// src/components/dashboard/TripPlanResults.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TripPlanResults({ plan }: { plan: any }) {
  return (
    <div className="trip-results">
      {/* Hero Header */}
      <div className="trip-hero">
        <h1>{plan.title}</h1>
        <p>{plan.summary}</p>
        
        <div className="trip-badges">
          <span className="badge">📍 {plan.destination}</span>
          <span className="badge">📅 {plan.dates}</span>
          <span className="badge">👥 {plan.num_travelers} travelers</span>
          <span className="badge">💰 ${plan.total_budget_usd?.toLocaleString()}</span>
        </div>
      </div>

      {/* Signature Experiences */}
      <div className="signature-section">
        <h2>✨ Signature Experiences</h2>
        {plan.signature_experiences?.map((exp: string, i: number) => (
          <div key={i} className="signature-card">{exp}</div>
        ))}
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="itinerary">
        <TabsList>
          <TabsTrigger value="itinerary">📅 Itinerary</TabsTrigger>
          <TabsTrigger value="hotels">🏨 Hotels</TabsTrigger>
          <TabsTrigger value="transport">✈️ Transport</TabsTrigger>
          <TabsTrigger value="budget">💰 Budget</TabsTrigger>
          <TabsTrigger value="weather">🌤️ Weather</TabsTrigger>
          <TabsTrigger value="tips">💡 Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary">
          <ItineraryTimeline days={plan.itinerary} />
        </TabsContent>
        <TabsContent value="hotels">
          <HotelGrid hotels={plan.hotel_recommendations} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetBreakdown budget={plan.budget_breakdown} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 8. Routing & Navigation

```typescript
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
```

**Protected routes:** All `(dashboard)` routes check auth state and redirect to `/login` if unauthenticated.

---

## 9. Acceptance Criteria

- [ ] Login and Register pages functional with API integration.
- [ ] Dashboard displays list of user's past trips.
- [ ] Trip planner textarea accepts input and submits to backend.
- [ ] Planning phase animation displays while waiting.
- [ ] Trip plan renders in tabbed sections (itinerary, hotels, budget, weather, transport, tips).
- [ ] Trip detail page (`/trips/{id}`) loads from API.
- [ ] Profile page displays user info and allows preference updates.
- [ ] Token refresh interceptor works transparently.
- [ ] All pages responsive on mobile (375px), tablet (768px), desktop (1440px).
- [ ] No `any` TypeScript types without justification comment.
- [ ] Lighthouse performance score ≥ 85.

---

## 10. Definition of Done

- All pages render without errors.
- End-to-end flow tested: register → login → plan trip → view plan.
- Mobile responsive verified manually.
- No console errors in production build.
- ESLint + Prettier passing.

---

*M14 — Frontend Core | Duration: 2 Weeks*
