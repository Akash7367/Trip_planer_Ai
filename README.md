# Aegis Multi-Agent Trip Planner Platform

A production-grade foundation for a Multi-Agent Trip Planner platform orchestrating flight, hotel, weather, and budget agents to build optimized travel plans.

## Project Structure
- `frontend/`: Next.js 15+ App Router, Tailwind CSS, shadcn/ui.
- `backend/`: FastAPI application, Pydantic configuration, global logging, and versioned routing.
- `database/`: Database configuration and schema blueprints.
- `docker/`: Custom Docker configs and helper scripts.
- `docs/`: Reference documentation and guidelines.

## Quick Start
Spin up the entire stack (PostgreSQL, Backend, and Frontend) via Docker Compose:
```bash
docker compose up --build
```
Once healthy, access:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend**: [http://localhost:8000](http://localhost:8000)
- **API Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
