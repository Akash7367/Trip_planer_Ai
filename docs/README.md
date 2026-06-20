# Aegis Multi-Agent Trip Planner - Documentation

Welcome to the documentation for Aegis Multi-Agent Trip Planner, a collaborative platform where multiple intelligent AI agents cooperate to create optimal travel itineraries.

## Architecture Overview

The platform uses a monorepo setup consisting of:
1. **Frontend**: Next.js 15 App Router, TypeScript, and TailwindCSS (configured with shadcn/ui).
2. **Backend**: FastAPI (Python 3.12) with modular, clean-architecture controllers, custom global error handlers, and logging.
3. **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations.

## Getting Started

To spin up the entire application locally using Docker:
```bash
docker compose up --build
```

### Services Map

- **Frontend Console**: [http://localhost:3000](http://localhost:3000)
- **FastAPI HTTP Server**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health check status**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
