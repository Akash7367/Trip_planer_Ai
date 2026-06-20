# M19 — Testing & QA

**Milestone:** 19 of 20 | **Duration:** 2 Weeks | **Depends On:** M01–M18

---

## 1. Objective

Achieve comprehensive test coverage across all system layers — unit tests, integration tests, agent tests, MCP tool tests, and end-to-end (E2E) tests — and establish the quality gates for production readiness.

---

## 2. Scope

- Backend unit tests (pytest) for all services, repositories, and agents.
- Integration tests for all API endpoints.
- MCP tool tests with real DB fixtures.
- Agent tests with mocked LLM responses.
- Frontend component tests (Vitest + React Testing Library).
- E2E tests (Playwright) for critical user flows.
- Performance testing for planning endpoint.
- Security testing for auth and rate limiting.

---

## 3. Test Architecture

```mermaid
graph TD
    subgraph "Backend Tests"
        UNIT[Unit Tests: pytest]
        INT[Integration Tests: pytest + httpx]
        AGENT[Agent Tests: mocked LLM]
        MCP[MCP Tool Tests: DB fixtures]
    end

    subgraph "Frontend Tests"
        COMP[Component Tests: Vitest + RTL]
        HOOK[Hook Tests: Vitest]
    end

    subgraph "E2E Tests"
        E2E[Playwright: Critical flows]
    end

    subgraph "Quality Gates"
        COV[Coverage Reports]
        PERF[Performance Benchmarks]
        SEC[Security Scan]
    end

    UNIT & INT & AGENT & MCP --> COV
    COMP & HOOK --> COV
    E2E --> COV
```

---

## 4. Backend Test Configuration

```python
# backend/conftest.py
import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token

TEST_DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost:5432/trip_planner_test"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def db():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    session = AsyncSession(engine)
    yield session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest.fixture
async def client(db):
    app.dependency_overrides[get_db] = lambda: db
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def authenticated_client(client, db):
    # Register and login a test user
    await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "TestPass123!",
        "full_name": "Test User"
    })
    response = await client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "TestPass123!"
    })
    token = response.json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client

@pytest.fixture
def mock_llm():
    """Mock LLM client for agent tests."""
    class MockLLM:
        _responses = []
        
        def set_response(self, response):
            self._responses.append(response)
        
        async def generate_structured(self, **kwargs):
            if self._responses:
                return self._responses.pop(0)
            return {}
    
    return MockLLM()

@pytest.fixture
def mock_mcp():
    """Mock MCP client for agent tests."""
    class MockMCPClient:
        _tool_responses = {}
        
        def set_tool_response(self, tool_name: str, response: dict):
            self._tool_responses[tool_name] = response
        
        async def call_tool(self, tool_name: str, inputs: dict):
            from mcp_server.models import ToolResult
            data = self._tool_responses.get(tool_name, {})
            return ToolResult(tool_name=tool_name, success=True, data=data)
    
    return MockMCPClient()
```

---

## 5. Unit Tests

### Authentication Tests
```python
# tests/unit/test_security.py
import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_token
import jwt

def test_password_hashing():
    password = "TestPass123!"
    hashed = hash_password(password)
    assert hashed != password
    assert hashed.startswith("$2b$")  # bcrypt prefix
    assert verify_password(password, hashed) == True
    assert verify_password("WrongPass", hashed) == False

def test_access_token_creation():
    token = create_access_token("user-123")
    payload = decode_token(token, settings.SECRET_KEY)
    assert payload["sub"] == "user-123"
    assert payload["type"] == "access"

def test_access_token_expiry():
    token = create_access_token("user-123", expires_delta=timedelta(seconds=-1))
    with pytest.raises(jwt.ExpiredSignatureError):
        decode_token(token, settings.SECRET_KEY)
```

### Budget Agent Tests
```python
# tests/unit/test_budget_agent.py
@pytest.mark.asyncio
async def test_budget_allocation_sums_to_total(mock_llm, mock_mcp):
    agent = BudgetAgent(mock_llm, mock_mcp)
    state = make_state(trip_params={
        "total_budget": 4000,
        "duration_days": 7,
        "num_travelers": 2,
        "travel_style": "comfort"
    })
    
    result = agent._rule_based_allocation(4000, 7, 2, "comfort", 0, 0)
    
    total = sum(result["allocation"].values()) + result["emergency_reserve_usd"]
    assert abs(total - 4000) < 1  # Within $1 due to rounding

@pytest.mark.asyncio
async def test_feasibility_insufficient_when_costs_exceed_budget(mock_llm, mock_mcp):
    agent = BudgetAgent(mock_llm, mock_mcp)
    result = agent._rule_based_allocation(1000, 7, 2, "comfort", 800, 1500)
    assert result["feasibility"] == "insufficient"
```

### MCP Tool Tests
```python
# tests/unit/test_mcp_tools.py
@pytest.mark.asyncio
async def test_budget_tool_allocation_math():
    tool = OptimizeBudgetTool()
    result = await tool.execute({
        "total_budget_usd": 5000,
        "duration_days": 10,
        "num_travelers": 2,
        "travel_style": "comfort"
    })
    assert result.success
    allocation = result.data["allocation"]
    reserve = result.data["emergency_reserve_usd"]
    total = sum(allocation.values()) + reserve
    assert abs(total - 5000) < 1

@pytest.mark.asyncio
async def test_tool_registry_raises_on_unknown_tool():
    registry = ToolRegistry()
    with pytest.raises(ToolNotFoundError):
        await registry.execute("nonexistent_tool", {})
```

---

## 6. Integration Tests

### Auth Flow
```python
# tests/integration/test_auth.py
@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "NewPass123!",
        "full_name": "New User"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "hashed_password" not in data
    assert "password" not in data

@pytest.mark.asyncio
async def test_login_invalid_credentials(client):
    response = await client.post("/api/v1/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrong"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_protected_route_without_token(client):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_refresh_token_rotation(authenticated_client):
    old_refresh = authenticated_client.cookies.get("refresh_token")
    response = await authenticated_client.post("/api/v1/auth/refresh", 
        json={"refresh_token": old_refresh})
    assert response.status_code == 200
    new_refresh = response.json()["refresh_token"]
    assert new_refresh != old_refresh
    
    # Old token should now be invalid
    response2 = await authenticated_client.post("/api/v1/auth/refresh",
        json={"refresh_token": old_refresh})
    assert response2.status_code == 401

@pytest.mark.asyncio
async def test_rate_limiting_on_failed_logins(client):
    for _ in range(5):
        await client.post("/api/v1/auth/login", json={"email": "x@x.com", "password": "wrong"})
    response = await client.post("/api/v1/auth/login", json={"email": "x@x.com", "password": "wrong"})
    assert response.status_code == 429
```

### Trip API
```python
# tests/integration/test_trips.py
@pytest.mark.asyncio
async def test_list_trips_empty_for_new_user(authenticated_client):
    response = await authenticated_client.get("/api/v1/trips")
    assert response.status_code == 200
    assert response.json()["trips"] == []
    assert response.json()["total"] == 0

@pytest.mark.asyncio
async def test_get_trip_forbidden_for_other_user(authenticated_client, db):
    # Create a trip for another user
    other_user_trip_id = "fake-trip-uuid"
    response = await authenticated_client.get(f"/api/v1/trips/{other_user_trip_id}")
    assert response.status_code in [403, 404]

@pytest.mark.asyncio
async def test_trip_pagination(authenticated_client):
    response = await authenticated_client.get("/api/v1/trips?page=1&limit=5")
    assert "trips" in response.json()
    assert "total" in response.json()
    assert len(response.json()["trips"]) <= 5
```

---

## 7. Agent Tests

```python
# tests/agents/test_trip_understanding.py
@pytest.mark.asyncio
async def test_extract_japan_trip(mock_llm, mock_mcp):
    mock_llm.set_response({
        "destination": "Japan",
        "num_travelers": 2,
        "total_budget": 4000,
        "currency": "USD",
        "duration_days": 7,
        "travel_style": "comfort",
        "interests": ["culture", "food"]
    })
    mock_mcp.set_tool_response("get_user_memories", {"memories": []})
    
    agent = TripUnderstandingAgent(mock_llm, mock_mcp)
    state = make_state(raw_request="7-day Japan trip for 2 people, $4000 budget, love food and culture")
    result = await agent.run(state)
    
    assert result["trip_params"]["destination"] == "Japan"
    assert result["trip_params"]["num_travelers"] == 2
    assert result["trip_params"]["total_budget"] == 4000

@pytest.mark.asyncio
async def test_vague_input_sets_clarification_flag(mock_llm, mock_mcp):
    mock_llm.set_response({
        "needs_clarification": True,
        "clarification_fields": ["destination", "dates", "budget"]
    })
    mock_mcp.set_tool_response("get_user_memories", {"memories": []})
    
    agent = TripUnderstandingAgent(mock_llm, mock_mcp)
    state = make_state(raw_request="I want to travel")
    result = await agent.run(state)
    
    assert result["trip_params"]["needs_clarification"] == True
    assert len(result["trip_params"]["clarification_fields"]) > 0

@pytest.mark.asyncio
async def test_memory_context_injected_in_prompt(mock_llm, mock_mcp):
    memories = [{"type": "preference", "content": {"travel_style": "luxury"}}]
    mock_mcp.set_tool_response("get_user_memories", {"memories": memories})
    mock_llm.set_response({"destination": "Paris", "travel_style": "luxury"})
    
    agent = TripUnderstandingAgent(mock_llm, mock_mcp)
    state = make_state(raw_request="Paris trip")
    await agent.run(state)
    
    # Verify memory was fetched
    assert mock_mcp._call_count["get_user_memories"] == 1
```

---

## 8. E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', 'e2e@test.com');
    await page.fill('#password', 'E2ETest123!');
    await page.fill('#full_name', 'E2E Test User');
    await page.click('#register-btn');
    
    await expect(page).toHaveURL('/login');
    await page.fill('#email', 'e2e@test.com');
    await page.fill('#password', 'E2ETest123!');
    await page.click('#login-btn');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('#user-name')).toContainText('E2E Test User');
  });
  
  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'wrong@email.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-btn');
    
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

```typescript
// tests/e2e/trip_planning.spec.ts
test('user can plan a trip', async ({ page }) => {
  // Login first
  await loginAsTestUser(page);
  await page.goto('/plan');
  
  // Submit a trip request
  await page.fill('#trip-input', '5-day Paris trip for 2 people, $3000 budget');
  await page.click('#plan-btn');
  
  // Wait for planning (up to 60s)
  await expect(page.locator('.trip-results')).toBeVisible({ timeout: 60000 });
  
  // Verify plan sections exist
  await expect(page.locator('[data-tab="itinerary"]')).toBeVisible();
  await expect(page.locator('[data-tab="hotels"]')).toBeVisible();
  await expect(page.locator('[data-tab="budget"]')).toBeVisible();
});
```

---

## 9. Coverage Targets

| Layer | Tool | Target |
|---|---|---|
| Backend core (config, security, db) | pytest | 95% |
| Auth service | pytest | 90% |
| Repository layer | pytest | 85% |
| Agent implementations | pytest (mocked) | 80% |
| MCP tools | pytest | 85% |
| API endpoints | pytest + httpx | 85% |
| Frontend components | Vitest + RTL | 75% |
| Frontend hooks | Vitest | 80% |
| E2E critical paths | Playwright | 100% of listed flows |

---

## 10. Performance Benchmarks

| Scenario | Target P95 | Tool |
|---|---|---|
| `POST /trips/plan` | < 45 seconds | pytest-asyncio |
| `GET /trips` | < 200ms | locust |
| `POST /auth/login` | < 100ms | locust |
| Frontend initial load | < 2s LCP | Lighthouse |
| Frontend plan page render | < 500ms | Lighthouse |

---

## 11. Security Test Checklist

- [ ] SQL injection: test `'; DROP TABLE users; --` in all text inputs.
- [ ] XSS: test `<script>alert(1)</script>` in all text inputs.
- [ ] JWT tampering: modify payload without resigning → must return 401.
- [ ] IDOR: try to access another user's trip by ID.
- [ ] Rate limiting: verify 429 after threshold.
- [ ] CORS: verify requests from unknown origins are rejected.

---

## 12. Acceptance Criteria

- [ ] Overall backend coverage ≥ 80%.
- [ ] Overall frontend coverage ≥ 75%.
- [ ] All E2E critical paths pass.
- [ ] Zero critical security vulnerabilities.
- [ ] Performance benchmarks met for P95.
- [ ] CI pipeline runs all tests in < 5 minutes.

---

## 13. Definition of Done

- All test suites green in CI.
- Coverage reports generated and published.
- Performance benchmarks documented.
- Security test results reviewed and actioned.

---

*M19 — Testing & QA | Duration: 2 Weeks*
