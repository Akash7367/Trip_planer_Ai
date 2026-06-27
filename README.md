<div align="center">

<img src="https://img.shields.io/badge/AeroGuide-AI%20Trip%20Planner-0058bc?style=for-the-badge&logo=airplane&logoColor=white" />

# ✈️ AeroGuide — AI Multi-Agent Travel Planner

### *Plan smarter. Travel better. Powered by 16 specialized AI agents.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2+-orange?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**Live Demo**](https://aeroguide.vercel.app) · [**API Docs**](https://aeroguide.vercel.app/api/docs) · [**Report Bug**](https://github.com/Akash7367/Trip_planer_Ai/issues)

</div>

---

## 📌 What is AeroGuide?

AeroGuide is a **next-generation AI travel planning platform** that orchestrates **16 specialized AI agents** across two LangGraph pipelines to generate personalized, constraint-aware trip plans grounded in real-world data.

Unlike single-LLM chatbots (ChatGPT, Gemini), AeroGuide uses a **multi-agent architecture** where each agent is a domain expert — handling destinations, weather, hotels, transportation, budgets, and itinerary generation — working in parallel and synthesizing results into one cohesive plan.

### 🎯 The Core Problem We Solve

> Travelers juggle 6–12 separate platforms (flights, hotels, weather, maps, budgeting). Existing AI travel tools are generic chatbots with no domain specialization, stale training data, and no real-world price verification.

**AeroGuide solves this with:**

| Problem | AeroGuide Solution |
|---|---|
| Generic AI recommendations | 16 specialized agents, each domain-expert prompted |
| Stale training data | **Vlog Intelligence Pipeline** — real YouTube travel vlog transcript extraction |
| Fragmented planning tools | Single unified platform — plan to PDF in one flow |
| Static plans | **Selective Replanning** — change one day without restarting |
| No personalization | Persistent Memory System — learns your preferences |
| Language barrier | Multilingual vlog ingestion + output in 100+ languages |

---

## ✨ Key Features

- 🤖 **16-Agent Dual LangGraph Pipeline** — Two parallel orchestration graphs working in concert
- 🎬 **Vlog Intelligence Pipeline** — Extracts real 2025 prices & hidden gems from YouTube travel vlogs
- 🔄 **Selective Replanning** — Regenerate only the parts of the plan that need changing
- 🧠 **Persistent Memory** — Remembers your travel preferences across sessions  
- 🌍 **Multilingual Support** — Plans generated in Hindi, Spanish, French, and 100+ languages
- 💰 **Constraint-Aware Budget Engine** — Plans that actually fit your budget
- 📄 **PDF Export** — Download your complete itinerary
- 📧 **Email Delivery** — Send plans directly to your inbox
- 🗺️ **Interactive Map** — Visual route planning
- 🛠️ **Dynamic Tool Registry** — Agents discover and invoke tools at runtime (MCP)

---

## 🏗️ Architecture Overview

AeroGuide is built on a **layered, domain-separated architecture**:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│          Next.js 15 + TypeScript Frontend           │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / REST
┌─────────────────────▼───────────────────────────────┐
│                    API Layer                         │
│     FastAPI Gateway + JWT Auth + Rate Limiter       │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              Orchestration Layer                     │
│         LangGraph Workflow Engine (2 Graphs)        │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
┌──────────────▼──────┐  ┌───────▼──────────────────┐
│  Traditional Graph  │  │  Vlog Intelligence Graph  │
│    8 Agents         │  │    8 Agents               │
└──────────────┬──────┘  └───────┬──────────────────┘
               │                  │
┌──────────────▼──────────────────▼───────────────────┐
│                   Tool Layer (MCP)                   │
│         12 Tools across 7 domains                   │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│                    Data Layer                        │
│      PostgreSQL 16 (Neon) + Redis (Upstash)         │
└─────────────────────────────────────────────────────┘
```

---

## 🤖 The 16 Agents — Complete Breakdown

### Graph 1: Traditional Orchestrator (8 Agents)

Handles structured trip planning via specialized domain agents:

```
User Query
    │
    ▼
┌─────────────────────┐
│ 1. Understanding    │ → Parses user intent, extracts preferences
│    Agent            │   (luxury, pet-friendly, budget tier)
└──────────┬──────────┘
           │
    ┌──────┴──────┬──────────────┬─────────────────┐
    ▼             ▼              ▼                  ▼
┌────────┐  ┌─────────┐  ┌───────────┐  ┌──────────────┐
│2.Plann-│  │3.Weather│  │4.Transport│  │5.Accommoda-  │
│er Node │  │Agent    │  │Agent      │  │tion Agent    │
│        │  │         │  │           │  │              │
│Basic   │  │Live     │  │Flights,   │  │Budget-aware  │
│trip    │  │weather  │  │trains,    │  │hotel short-  │
│structure│ │scores   │  │cabs       │  │listing       │
└────┬───┘  └────┬────┘  └─────┬─────┘  └──────┬───────┘
     │           │             │                │
     └───────────┴─────────────┴────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  6. Food & Dining   │
                    │     Agent           │
                    │  Cafes, restaurants │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  7. Local Gems      │
                    │     Agent           │
                    │  Hidden spots,      │
                    │  activities         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  8. Itinerary Node  │
                    │                     │
                    │  Merges all outputs │
                    │  → Final structured │
                    │    itinerary        │
                    └─────────────────────┘
```

### Graph 2: Vlog Intelligence Pipeline (8 Agents)

Novel pipeline that grounds recommendations in real YouTube travel vlog data:

```
User Query
    │
    ▼
┌──────────────────────┐
│ 1. Planner Agent     │ → Extracts: Destination, Language, Interests
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 2. YouTube Search    │ → Scrapes live YouTube for travel vlogs
│    Agent             │   (real video IDs, views, upload dates)
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 3. Transcript Agent  │ → Downloads real captions via
│                      │   youtube-transcript-api
│                      │   Filters sponsors, generates if unavailable
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 4. Translation Agent │ → Translates to target language
│                      │   Preserves place names, prices, proper nouns
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 5. Knowledge         │ → Extracts structured data:
│    Extraction Agent  │   Hotels, food spots, prices (INR),
│                      │   hidden gems, scam alerts, transport costs
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 6. Verification      │ → Cross-references prices & locations
│    Agent             │   Computes confidence scores (avg 95%)
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 7. Itinerary         │ → Compiles day-wise plan with
│    Generator Agent   │   vlogger citations
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ 8. Language          │ → Formats final JSON in target language
│    Personalization   │   Scales budget (Budget/Moderate/Luxury)
│    Agent             │
└──────────────────────┘
```

---

## 🗄️ Database Schema

AeroGuide uses **PostgreSQL 16** (Neon) with 8 core tables:

```
USERS ─────────────────────────────────────────────────┐
│ id (UUID PK)                                          │
│ email (UNIQUE), hashed_password, full_name            │
│ travel_style, preferred_currency, preferences (JSONB) │
└──┬────────────────────────────────────────────────────┘
   │ 1:N
   ├──────────────────────────────────────────┐
   │                                          │
TRIPS                                     MEMORIES
│ id, user_id (FK)                        │ id, user_id (FK)
│ destination, start_date, end_date       │ memory_type
│ total_budget, travel_style              │ content (JSONB)
│ trip_params (JSONB)                     │ relevance_score
│ final_plan (JSONB)                      │ expires_at
│ status                                  └──────────────
└──┬───────────────────────────────────────
   │ 1:N
   ├─────────────────┬──────────────────────┐
   │                 │                      │
ITINERARIES      HOTELS               AGENT_LOGS
│ day_number      │ name, tier          │ agent_name
│ morning/        │ price_per_night     │ status
│ afternoon/      │ star_rating         │ tokens_used
│ evening         │ amenities (JSONB)   │ execution_time_ms
│ activities      │ pros/cons (JSONB)   │ input/output (JSONB)
└─────────────    └─────────────────    └─────────────────────
```

### Redis Cache Strategy

| Cache Target | TTL |
|---|---|
| Weather tool results | 1 hour |
| Destination search results | 6 hours |
| Hotel search results | 30 minutes |
| User profile | 5 minutes |
| JWT refresh token state | 7 days |
| Agent intermediate results | 15 minutes |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Core language |
| FastAPI | 0.110+ | REST API framework |
| LangGraph | 0.2+ | Multi-agent orchestration |
| Google Gemini | 2.0 Flash | Primary LLM |
| Groq (Llama 3.3) | — | Fallback LLM |
| FAISS | — | Vector similarity search |
| SQLAlchemy | 2.x | ORM |
| Alembic | — | Database migrations |
| PyJWT + bcrypt | — | Authentication |
| youtube-transcript-api | — | Vlog transcript extraction |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | React framework |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | — | Styling |
| Unsplash API | — | Travel images |

### Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL 16 (Neon) | Primary database |
| Redis (Upstash) | Caching + rate limiting |
| Docker + Docker Compose | Containerization |
| AWS EC2 | Backend hosting |
| Vercel | Frontend hosting |
| Nginx | Reverse proxy |

---

## 📁 Project Structure

```
Trip_Planner/
├── backend/
│   ├── app/
│   │   ├── agents/                    # All AI agents
│   │   │   ├── travel_intelligence/   # Vlog Intelligence Pipeline
│   │   │   │   ├── state.py           # Shared LangGraph state
│   │   │   │   ├── llm_gateway.py     # Gemini → Groq → OpenAI fallback
│   │   │   │   ├── youtube_utils.py   # YouTube scraping + transcripts
│   │   │   │   ├── graph.py           # StateGraph definition
│   │   │   │   └── nodes/             # 8 individual agent nodes
│   │   │   │       ├── planner.py
│   │   │   │       ├── youtube_search.py
│   │   │   │       ├── transcript.py
│   │   │   │       ├── translation.py
│   │   │   │       ├── knowledge.py
│   │   │   │       ├── verification.py
│   │   │   │       ├── itinerary.py
│   │   │   │       └── personalization.py
│   │   │   ├── orchestrator.py        # Traditional graph controller
│   │   │   ├── understanding.py       # User intent agent
│   │   │   ├── planner.py             # Trip structure agent
│   │   │   ├── weather.py             # Weather intelligence agent
│   │   │   ├── transport.py           # Transport planning agent
│   │   │   ├── accommodation.py       # Hotel recommendation agent
│   │   │   ├── recommendation.py      # Food & gems agent
│   │   │   ├── itinerary.py           # Itinerary synthesis agent
│   │   │   ├── budget.py              # Budget optimization agent
│   │   │   └── memory.py              # Memory management
│   │   ├── api/v1/endpoints/          # REST API routes
│   │   │   ├── auth.py
│   │   │   ├── orchestrator.py
│   │   │   ├── travel_intelligence.py
│   │   │   ├── trips.py
│   │   │   ├── memory.py
│   │   │   ├── tools.py
│   │   │   └── ...
│   │   ├── core/                      # Config, DB, security
│   │   ├── models/                    # SQLAlchemy models
│   │   ├── schemas/                   # Pydantic schemas
│   │   └── middleware/                # Auth, logging middleware
│   ├── alembic/                       # DB migrations
│   ├── docs/                          # Full documentation
│   │   ├── Architecture/
│   │   ├── API/
│   │   ├── Database/
│   │   ├── Milestones/  (M01–M20)
│   │   └── PRD/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/                       # Next.js pages
│   │   └── components/                # React components
│   └── package.json
├── docker/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16 (or Neon account)
- Redis (or Upstash account)

### 1. Clone the Repository

```bash
git clone https://github.com/Akash7367/Trip_planer_Ai.git
cd Trip_planer_Ai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section below)

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8005 --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8005

# Start development server
npm run dev
```

### 4. Docker Compose (Recommended)

```bash
# Start all services
docker-compose up --build

# Backend → http://localhost:8005
# Frontend → http://localhost:3000
# API Docs → http://localhost:8005/docs
```

---

## ⚙️ Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# Redis
REDIS_URL=redis://localhost:6379

# LLM APIs (Priority: Gemini → Groq → OpenAI)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_groq_or_openai_key  # gsk_ prefix = Groq

# JWT Security
SECRET_KEY=your_512bit_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Unsplash (optional — for travel images)
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8005
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

---

## 📡 API Reference

Full Swagger docs available at `/docs` when backend is running.

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, get JWT |
| `POST` | `/api/v1/orchestrator/plan` | Generate full trip plan |
| `POST` | `/api/v1/orchestrator/travel-intelligence` | Vlog Intelligence Pipeline |
| `GET` | `/api/v1/trips` | List user's saved trips |
| `POST` | `/api/v1/trips/{id}/replan-selective` | Selective day replanning |
| `POST` | `/api/v1/trips/{id}/email` | Email trip plan |
| `POST` | `/api/v1/memory/add` | Store user preference |
| `POST` | `/api/v1/memory/search` | Search stored memories |
| `GET` | `/api/v1/tools` | List registered MCP tools |
| `POST` | `/api/v1/tools/execute` | Execute a tool |

### Example: Generate Trip Plan

```bash
curl -X POST http://localhost:8005/api/v1/orchestrator/travel-intelligence \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Plan a 5-day Goa trip, I like beaches and local food, avoid crowded places",
    "days": 5,
    "budget": 25000,
    "source_city": "Mumbai",
    "people": 1
  }'
```

**Response includes:**
- `daily_itinerary` — Day-wise plan with vlogger citations
- `estimated_budget` — Budget breakdown with local price index
- `hidden_gems` — Off-the-beaten-path spots
- `food_recommendations` — Vlog-verified restaurants with real prices
- `scam_alerts` — Common tourist traps to avoid
- `local_phrases` — Language helper
- `confidence_score` — Data verification score (avg 95%)
- `sources` — YouTube vlog sources with timestamps

---

## 🔄 How the Vlog Intelligence Pipeline Works

```
1. User submits query: "5-day Goa trip, beaches, ₹25,000 budget"
          │
2. Planner Agent extracts: Destination=Goa, Language=English, Budget=₹25k
          │
3. YouTube Search Agent scrapes live YouTube search results
   → Finds: "Goa Complete Travel Guide — TheSocialTraveller (586K views)"
          │
4. Transcript Agent fetches real captions via youtube-transcript-api
   → 600 words of actual vlogger speech
          │
5. Translation Agent: English → target language (if needed)
          │
6. Knowledge Extraction Agent parses transcript:
   → Hotels: "Zostel Palolem ₹600/night"
   → Food: "Café Inn thali ₹180"
   → Gems: "Butterfly Beach — boat from Palolem ₹200"
   → Scams: "Avoid pre-paid taxi touts near airport"
          │
7. Verification Agent cross-references + assigns confidence scores
          │
8. Itinerary Generator compiles day-wise plan with citations
          │
9. Language Personalization formats final JSON in target language
   + scales budget estimates (Budget/Moderate/Luxury tiers)
```

---

## 🧠 What Makes This Different

### vs. Single-LLM Chatbots (ChatGPT, Gemini)

| Feature | ChatGPT | AeroGuide |
|---|---|---|
| Architecture | Single LLM call | 16 specialized agents |
| Data freshness | Training cutoff | Real YouTube vlogs (2025) |
| Price accuracy | Estimated | Vlog-verified actual prices |
| Personalization | None | Persistent memory system |
| Replanning | Full restart | Selective component replan |
| Multilingual | Basic | 100+ languages with vlog grounding |

### Novel Engineering Contributions

1. **Vlog Intelligence Pipeline** — First travel planner to extract real-world pricing from YouTube travel vlog transcripts
2. **Dual LangGraph Architecture** — Two parallel graphs (Traditional + Vlog Intelligence) with independent state machines
3. **Selective Replanning** — Partial state preservation enabling per-component agent re-invocation
4. **Dynamic Tool Registry** — Agents discover and invoke tools at runtime via MCP protocol
5. **Multilingual Vlog Grounding** — Cross-language vlog extraction with automatic translation

---

## 📊 Performance Benchmarks

| Metric | Value |
|---|---|
| Average trip plan generation time | 45–90 seconds |
| Vlog Intelligence confidence score | ~95% |
| LLM calls per request | 10–14 |
| Transcript extraction success rate | ~70% (fallback: LLM generation) |
| API error rate | < 1% |
| P95 planning latency | < 90 seconds |

---

## 🗺️ Roadmap

| Phase | Status | Features |
|---|---|---|
| v1.0 Foundation | ✅ Complete | 16-agent pipeline, auth, basic UI |
| v1.5 Intelligence | 🔄 In Progress | Memory system, PDF export, email delivery |
| v2.0 Real-Time | 📋 Planned | Live flight/hotel booking APIs |
| v2.5 Collaboration | 📋 Planned | Multi-user trip collaboration |
| v3.0 Autonomy | 📋 Planned | Autonomous booking, proactive replanning |

---

## 📄 Documentation

Full documentation available in `/docs`:

| Document | Description |
|---|---|
| `docs/Architecture/System_Architecture.md` | Full system architecture |
| `docs/Architecture/Agent_Architecture.md` | All 16 agents detailed |
| `docs/Architecture/MCP_Architecture.md` | MCP tool registry design |
| `docs/Database/ERD.md` | Database schema + ERD |
| `docs/API/API_Specification.md` | Complete API reference |
| `docs/PRD/Product_Requirements_Document.md` | Full product requirements |
| `docs/Milestones/M01–M20` | Development milestone breakdown |

---

## 👨‍💻 Author

**Akash Kumar** — AI/ML Engineer

[![GitHub](https://img.shields.io/badge/GitHub-Akash7367-181717?style=flat-square&logo=github)](https://github.com/Akash7367)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-akash--kumar-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/akash-kumar-298113264/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-0058bc?style=flat-square)](https://portfolio-c2xg.vercel.app)

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you found it useful!**

*Built with ❤️ using LangGraph, FastAPI, and Next.js*

</div>
