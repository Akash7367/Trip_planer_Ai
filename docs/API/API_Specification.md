# API Specification — Aegis Multi-Agent Trip Planner

**Version:** 1.0.0 | **Base URL:** `http://localhost:8000/api/v1` | **Last Updated:** 2026-06-20

---

## Authentication

All protected endpoints require a Bearer JWT in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response `201 Created`:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2026-06-20T12:00:00Z"
}
```

**Error Responses:**
| Status | Code | Description |
|---|---|---|
| 400 | `EMAIL_ALREADY_EXISTS` | Email is already registered |
| 422 | `VALIDATION_ERROR` | Invalid email format or weak password |

---

### POST `/auth/login`

Authenticate and receive JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

**Error Responses:**
| Status | Code | Description |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many failed login attempts |

---

### POST `/auth/refresh`

Refresh an expired access token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

**Error Responses:**
| Status | Code | Description |
|---|---|---|
| 401 | `INVALID_REFRESH_TOKEN` | Token is invalid or expired |
| 401 | `TOKEN_REUSED` | Refresh token already used (rotation violation) |

---

### POST `/auth/logout`

Invalidate the current refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response `200 OK`:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Trip Endpoints

### POST `/trips/plan`

Submit a trip planning request. Triggers the full multi-agent planning pipeline.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "request": "Plan a 7-day trip to Japan for 2 people in April with a $4000 budget",
  "preferences": {
    "interests": ["culture", "food", "temples"],
    "travel_style": "comfort",
    "currency": "USD"
  }
}
```

**Response `202 Accepted`** (async — returns trip_id immediately):
```json
{
  "trip_id": "uuid",
  "status": "planning",
  "estimated_completion_seconds": 30,
  "poll_url": "/api/v1/trips/uuid/status"
}
```

**Response `200 OK`** (sync — returns complete plan):
```json
{
  "trip_id": "uuid",
  "status": "completed",
  "title": "7-Day Japan Adventure",
  "destination": "Japan",
  "start_date": "2026-04-01",
  "end_date": "2026-04-08",
  "num_travelers": 2,
  "total_budget": 4000,
  "summary": "An immersive cultural journey through Tokyo and Kyoto...",
  "destination_report": { "...": "..." },
  "weather_report": { "...": "..." },
  "hotel_recommendations": [{ "...": "..." }],
  "transport_recommendations": { "...": "..." },
  "budget_breakdown": { "...": "..." },
  "itinerary": [{ "day": 1, "...": "..." }],
  "practical_tips": ["..."],
  "created_at": "2026-06-20T12:00:00Z"
}
```

**Validation Rules:**
- `request` must be 10–2000 characters.
- `preferences.travel_style` must be one of: `budget`, `comfort`, `luxury`.
- `preferences.currency` must be a valid ISO 4217 currency code.

**Error Responses:**
| Status | Code | Description |
|---|---|---|
| 400 | `REQUEST_TOO_VAGUE` | Insufficient information to plan |
| 422 | `VALIDATION_ERROR` | Request body invalid |
| 503 | `PLANNING_FAILED` | Agent pipeline encountered an unrecoverable error |

---

### GET `/trips`

List all trips for the authenticated user.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | int | Page number (default: 1) |
| `limit` | int | Results per page (default: 10, max: 50) |
| `status` | string | Filter by status: `planning`, `completed`, `failed` |
| `sort` | string | Sort: `created_at_desc` (default), `created_at_asc` |

**Response `200 OK`:**
```json
{
  "trips": [
    {
      "trip_id": "uuid",
      "title": "7-Day Japan Adventure",
      "destination": "Japan",
      "start_date": "2026-04-01",
      "end_date": "2026-04-08",
      "status": "completed",
      "created_at": "2026-06-20T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### GET `/trips/{trip_id}`

Get the full details of a specific trip.

**Headers:** `Authorization: Bearer <access_token>`

**Path Params:** `trip_id` (UUID)

**Response `200 OK`:** Full trip plan object (same as POST /trips/plan response).

**Error Responses:**
| Status | Code | Description |
|---|---|---|
| 404 | `TRIP_NOT_FOUND` | Trip ID doesn't exist |
| 403 | `FORBIDDEN` | Trip belongs to a different user |

---

### GET `/trips/{trip_id}/status`

Poll the planning status for an async trip planning request.

**Response `200 OK`:**
```json
{
  "trip_id": "uuid",
  "status": "planning",
  "current_phase": "itinerary_generation",
  "phases_completed": ["understanding", "destination", "weather", "hotel", "transport", "budget"],
  "estimated_remaining_seconds": 12
}
```

---

### POST `/trips/{trip_id}/replan`

Trigger replanning for an existing trip due to a disruption.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "disruption_type": "weather",
  "disruption_description": "Major storm forecast on Day 3 (outdoor hiking day)",
  "affected_dates": ["2026-04-03"],
  "constraints": {
    "budget_change": 0,
    "date_change": false
  }
}
```

**Response `200 OK`:**
```json
{
  "trip_id": "uuid",
  "status": "replanned",
  "changes_summary": [
    {
      "type": "CHANGED",
      "day": 3,
      "original": "Mount Fuji hiking",
      "updated": "Tokyo National Museum + Asakusa temple visit",
      "reason": "Storm forecast on April 3 makes outdoor activities unsafe"
    }
  ],
  "updated_plan": { "...": "..." }
}
```

**Validation:**
- `disruption_type` must be: `weather`, `flight_cancellation`, `budget_change`, `preference_change`.
- At least one `affected_dates` date must be within the trip duration.

---

### GET `/trips/{trip_id}/export/pdf`

Generate and download the trip plan as a PDF.

**Headers:** `Authorization: Bearer <access_token>`

**Response `200 OK`:**
```json
{
  "pdf_url": "https://s3.amazonaws.com/aegis-pdfs/uuid/trip.pdf?signature=...",
  "expires_at": "2026-06-21T12:00:00Z",
  "file_size_bytes": 204800
}
```

---

### POST `/trips/{trip_id}/email`

Send the trip plan to specified email addresses.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "recipients": ["companion@example.com"],
  "include_self": true,
  "template": "full_plan",
  "personal_message": "Here's our Japan adventure plan!"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "delivered_to": ["user@example.com", "companion@example.com"],
  "message_id": "ses-message-id"
}
```

---

## 3. User Endpoints

### GET `/users/me`

Get the authenticated user's profile.

**Response `200 OK`:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "travel_style": "comfort",
  "preferred_currency": "USD",
  "preferences": { "dietary": "vegetarian", "airline": "economy" },
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### PUT `/users/me/preferences`

Update user preferences.

**Request Body:**
```json
{
  "travel_style": "luxury",
  "preferred_currency": "EUR",
  "preferences": {
    "dietary": "vegan",
    "room_type": "king_bed",
    "airline_alliance": "star_alliance"
  }
}
```

**Response `200 OK`:** Updated user profile object.

---

### GET `/users/me/memories`

Retrieve all stored user memories.

**Query Params:** `type` (optional) — Filter by memory type: `preference`, `past_trip`, `feedback`.

**Response `200 OK`:**
```json
{
  "memories": [
    {
      "id": "uuid",
      "type": "preference",
      "content": { "preferred_hotel_type": "boutique" },
      "created_at": "2026-06-01T00:00:00Z"
    }
  ]
}
```

---

### DELETE `/users/me/memories/{memory_id}`

Delete a specific memory.

**Response `200 OK`:**
```json
{
  "message": "Memory deleted successfully"
}
```

---

## 4. Voice Endpoints

### POST `/voice/process`

Process a voice input (base64 audio) and return a planning response.

**Request Body:**
```json
{
  "audio_base64": "UklGRiQ...",
  "audio_format": "webm",
  "session_id": "voice-session-uuid",
  "context": "initial"
}
```

**Response `200 OK`:**
```json
{
  "transcript": "Plan a 5-day beach trip to Bali for one person",
  "intent": "trip_planning",
  "response_text": "Great choice! I'll plan a 5-day Bali beach getaway for you. Let me gather all the details...",
  "response_audio_base64": "UklGRiQ...",
  "trip_started": true,
  "trip_id": "uuid"
}
```

---

## 5. Health Endpoints

### GET `/health`

Service health check (no authentication required).

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-06-20T12:00:00Z"
}
```

---

## 6. Error Response Format

All error responses follow a standard format:

```json
{
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip with ID 'abc-123' was not found",
    "details": {},
    "request_id": "req-uuid",
    "timestamp": "2026-06-20T12:00:00Z"
  }
}
```

---

## 7. Rate Limits

| Endpoint Group | Limit |
|---|---|
| Auth endpoints | 10 requests/minute per IP |
| `POST /trips/plan` | 5 requests/minute per user |
| All other authenticated endpoints | 60 requests/minute per user |
| All endpoints (global) | 100 requests/minute per IP |

Rate limit headers returned on every response:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1718880060
```

---

*Document: API Specification | Version: 1.0.0*
