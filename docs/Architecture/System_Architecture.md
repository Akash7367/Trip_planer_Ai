# System Architecture — Aegis Multi-Agent Trip Planner

**Version:** 1.0.0 | **Status:** Active | **Last Updated:** 2026-06-20

---

## 1. Overview

Aegis is built on a **layered, domain-separated architecture** where each layer has a single, well-defined responsibility. The system orchestrates a network of specialized AI agents using LangGraph and the Model Context Protocol (MCP), backed by a FastAPI REST API and a Next.js frontend.

---

## 2. Architectural Principles

| Principle | Description |
|---|---|
| **Separation of Concerns** | Each layer and module has exactly one responsibility |
| **Agent Autonomy** | Each AI agent is independently prompt-engineered and tested |
| **Tool Composability** | MCP tools are reusable across multiple agents |
| **Stateless API** | JWT-authenticated stateless REST API — no server sessions |
| **Fail-Safe Defaults** | Every agent has defined fallback behavior on failure |
| **Observable by Design** | Structured logging and metrics emitted at every layer |

---

## 3. Layer Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        FE[Next.js Frontend]
        VOICE_UI[Voice Interface]
    end

    subgraph "API Layer"
        GW[FastAPI Gateway]
        AUTH_MW[Auth Middleware]
        RATE_MW[Rate Limiter]
        LOG_MW[Request Logger]
    end

    subgraph "Orchestration Layer"
        LGRAPH[LangGraph Workflow Engine]
        STATE_MGR[State Manager]
        RETRY[Retry Handler]
    end

    subgraph "Agent Layer"
        AGENTS[9 Specialized Agents]
    end

    subgraph "Tool Layer"
        MCP_SRV[MCP Server]
        TOOL_REG[Tool Registry]
    end

    subgraph "Integration Layer"
        LLM_POOL[LLM Pool - Gemini / GPT-4o]
        EXT_API[External APIs]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL)]
        REDIS[(Redis)]
    end

    FE & VOICE_UI --> GW
    GW --> AUTH_MW --> RATE_MW --> LOG_MW --> LGRAPH
    LGRAPH --> STATE_MGR --> AGENTS
    AGENTS --> MCP_SRV --> TOOL_REG
    AGENTS --> LLM_POOL
    TOOL_REG --> EXT_API
    TOOL_REG --> PG & REDIS
    LGRAPH --> PG
```

---

## 4. Component Responsibilities

### 4.1 Presentation Layer

| Component | Technology | Responsibility |
|---|---|---|
| Next.js Frontend | Next.js 15 + TypeScript | User interface, routing, state display |
| Voice Interface | Web Speech API | STT/TTS for hands-free planning |

### 4.2 API Layer

| Component | Technology | Responsibility |
|---|---|---|
| FastAPI Gateway | FastAPI 0.110+ | Route requests, validate inputs, return responses |
| Auth Middleware | PyJWT + bcrypt | Verify JWT tokens on protected routes |
| Rate Limiter | SlowAPI / Redis | Prevent abuse (100 req/min per IP) |
| Request Logger | Python logging | Structured JSON request/response logs |

### 4.3 Orchestration Layer

| Component | Technology | Responsibility |
|---|---|---|
| LangGraph Workflow | LangGraph 0.2+ | Define and execute the multi-agent graph |
| State Manager | TypedDict State | Shared state across all graph nodes |
| Retry Handler | Custom decorator | Exponential backoff retry logic |

### 4.4 Agent Layer

Nine specialized agents, each extending `BaseAgent`. See `Agent_Architecture.md` for full details.

### 4.5 Tool Layer (MCP)

| Component | Responsibility |
|---|---|
| MCP Server | Expose tools via MCP protocol |
| Tool Registry | Discover and dispatch tool calls |
| Domain Tools | 12 tools across 7 domains |

### 4.6 Data Layer

| Component | Purpose |
|---|---|
| PostgreSQL 16 | Primary persistent storage (users, trips, logs) |
| Redis 7 | Session cache, rate limiting, agent result cache |

---

## 5. Request Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant FastAPI
    participant Auth
    participant LangGraph
    participant Agents
    participant MCP
    participant LLM
    participant DB

    Client->>FastAPI: POST /api/v1/trips/plan
    FastAPI->>Auth: Validate Bearer JWT
    Auth-->>FastAPI: user_id extracted
    FastAPI->>LangGraph: Start workflow(user_id, request)
    
    par Trip Understanding
        LangGraph->>Agents: TripUnderstandingAgent.run()
        Agents->>LLM: Parse intent → structured params
        LLM-->>Agents: TripParameters
    end
    
    par Parallel Research
        LangGraph->>Agents: DestinationAgent.run()
        LangGraph->>Agents: WeatherAgent.run()
        LangGraph->>Agents: TransportAgent.run()
        Agents->>MCP: Call domain tools
        MCP-->>Agents: Tool results
        Agents->>LLM: Generate reports
        LLM-->>Agents: Domain reports
    end

    LangGraph->>Agents: HotelAgent + BudgetAgent
    LangGraph->>Agents: ItineraryAgent.run()
    LangGraph->>Agents: FinalPlannerAgent.run()
    Agents->>LLM: Synthesize final plan
    LLM-->>Agents: FinalTripPlan
    LangGraph-->>FastAPI: Complete plan
    FastAPI->>DB: Persist trip + agent logs
    FastAPI-->>Client: 200 OK {trip_plan}
```

---

## 6. Data Flow Architecture

```mermaid
flowchart LR
    INPUT[User Input] --> PARSER[Intent Parser]
    PARSER --> STATE[Graph State]
    
    STATE --> DA[Destination Agent]
    STATE --> WA[Weather Agent]
    STATE --> TA[Transport Agent]
    
    DA --> |destination_report| STATE
    WA --> |weather_report| STATE
    TA --> |transport_report| STATE
    
    STATE --> HA[Hotel Agent]
    STATE --> BA[Budget Agent]
    HA --> |hotel_report| STATE
    BA --> |budget_report| STATE
    
    STATE --> IA[Itinerary Agent]
    IA --> |itinerary_report| STATE
    
    STATE --> FPA[Final Planner]
    FPA --> |final_plan| OUTPUT[Trip Plan JSON]
    
    OUTPUT --> DB[(PostgreSQL)]
    OUTPUT --> CACHE[(Redis)]
    OUTPUT --> CLIENT[Frontend]
```

---

## 7. Deployment Topology (Production)

```mermaid
graph TB
    subgraph "CDN Layer"
        CF[CloudFront CDN]
    end
    subgraph "Load Balancer"
        ALB[Application Load Balancer]
    end
    subgraph "Application Tier - Private Subnet"
        FE_ECS[ECS: Frontend Tasks ×2]
        BE_ECS[ECS: Backend Tasks ×3]
    end
    subgraph "Data Tier - Private Subnet"
        RDS_PRIMARY[(RDS Primary)]
        RDS_REPLICA[(RDS Read Replica)]
        REDIS_CLUSTER[(ElastiCache Redis Cluster)]
    end
    subgraph "External"
        GEMINI_API[Google Gemini API]
        OPENAI_API[OpenAI API]
        SES[AWS SES Email]
        S3_PDF[S3 PDF Storage]
    end

    CF --> ALB
    ALB --> FE_ECS
    ALB --> BE_ECS
    BE_ECS --> RDS_PRIMARY
    BE_ECS --> RDS_REPLICA
    BE_ECS --> REDIS_CLUSTER
    BE_ECS --> GEMINI_API & OPENAI_API
    BE_ECS --> SES & S3_PDF
```

---

## 8. Scalability Design

### Horizontal Scaling

- **Backend**: Stateless FastAPI pods behind ALB. Scale by adding ECS tasks.
- **Frontend**: Static-optimized Next.js behind CloudFront. CDN handles scale.
- **Database**: Read replica for read-heavy workloads (trip history queries).

### Caching Strategy

| Cache Target | TTL | Store |
|---|---|---|
| Weather tool results | 1 hour | Redis |
| Destination search results | 6 hours | Redis |
| Hotel search results | 30 minutes | Redis |
| User profile | 5 minutes | Redis |
| JWT refresh token state | 7 days | Redis |

### Agent Concurrency

- Parallel agent execution via `asyncio.gather()` in LangGraph.
- Each agent runs in its own async context — no shared mutable state.
- LLM calls use `AsyncOpenAI` / `AsyncGemini` clients.

---

## 9. Observability Stack

```mermaid
graph LR
    BE[Backend] --> |structured logs| CW[CloudWatch Logs]
    BE --> |metrics| CW_METRICS[CloudWatch Metrics]
    BE --> |traces| XRAY[AWS X-Ray]
    CW --> DASHBOARD[CloudWatch Dashboard]
    CW_METRICS --> ALARMS[CloudWatch Alarms]
    ALARMS --> SNS[SNS → Slack Alerts]
```

### Key Metrics

| Metric | Alert Threshold |
|---|---|
| API Error Rate | > 1% |
| P95 Trip Planning Latency | > 60 seconds |
| LLM Token Usage (daily) | > 80% of quota |
| DB Connection Pool Exhaustion | Any occurrence |
| Failed Agent Executions | > 5% of requests |

---

*Document: System Architecture | Version: 1.0.0*
