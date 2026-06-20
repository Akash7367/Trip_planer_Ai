# M13 — Memory System

**Milestone:** 13 of 20 | **Duration:** 1 Week | **Depends On:** M12

---

## 1. Objective

Implement the user memory system that stores and retrieves travel preferences, past trip patterns, and behavioral signals to personalize all future recommendations.

---

## 2. Scope

- `Memory` ORM model and `Preference` model.
- `MemoryRepository` for CRUD operations.
- `get_user_memories` and `save_user_memory` MCP tools (full implementation).
- Memory retrieval with relevance scoring.
- `GET /users/me/memories` and `DELETE /users/me/memories/{id}` endpoints.
- `PUT /users/me/preferences` endpoint.
- Integration with `TripUnderstandingAgent` for context injection.

---

## 3. Memory Types

| Type | Description | Example Content |
|---|---|---|
| `past_trip` | Record of a completed trip | `{"destination": "Japan", "dates": "Apr 2026"}` |
| `preference` | Explicit user preference | `{"hotel_type": "boutique", "dietary": "vegetarian"}` |
| `feedback` | User feedback on a recommendation | `{"liked": "Tokyo itinerary", "disliked": "Hotel price"}` |
| `blacklist` | Destinations/hotels to avoid | `{"destination": "Dubai", "reason": "been there"}` |
| `inferred` | System-inferred preference from behavior | `{"prefers_morning_activities": true}` |

---

## 4. ORM Models

```python
# backend/app/models/memory.py
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.core.database import Base

class Memory(Base):
    __tablename__ = "memories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    memory_type = Column(String(50), nullable=False)  # past_trip, preference, feedback, blacklist, inferred
    content = Column(JSONB, nullable=False)
    relevance_score = Column(Float, default=1.0)  # Higher = more relevant/recent
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    last_accessed = Column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at = Column(DateTime(timezone=True), nullable=True)  # None = never expires
    
    user = relationship("User", back_populates="memories")


class Preference(Base):
    __tablename__ = "preferences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    key = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)
    data_type = Column(String(20), default="string")  # string, integer, boolean, json
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (UniqueConstraint("user_id", "key", name="uq_user_preference_key"),)
```

---

## 5. Repository

```python
# backend/app/repositories/memory.py

class MemoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_user(
        self, user_id: str, memory_type: str | None = None, limit: int = 10
    ) -> list[Memory]:
        query = select(Memory).where(
            Memory.user_id == user_id,
            or_(Memory.expires_at == None, Memory.expires_at > datetime.utcnow())
        )
        if memory_type:
            query = query.where(Memory.memory_type == memory_type)
        query = query.order_by(Memory.relevance_score.desc()).limit(limit)
        
        result = await self.db.execute(query)
        memories = result.scalars().all()
        
        # Update last_accessed timestamp
        for m in memories:
            m.last_accessed = datetime.utcnow()
        await self.db.commit()
        
        return memories
    
    async def create(self, user_id: str, memory_type: str, content: dict) -> Memory:
        memory = Memory(
            user_id=user_id,
            memory_type=memory_type,
            content=content,
            relevance_score=self._compute_initial_relevance(memory_type)
        )
        self.db.add(memory)
        await self.db.commit()
        await self.db.refresh(memory)
        return memory
    
    async def delete(self, memory_id: str, user_id: str) -> bool:
        result = await self.db.execute(
            delete(Memory).where(Memory.id == memory_id, Memory.user_id == user_id)
        )
        await self.db.commit()
        return result.rowcount > 0
    
    async def set_preference(self, user_id: str, key: str, value: str, data_type: str = "string") -> Preference:
        existing = await self.db.execute(
            select(Preference).where(Preference.user_id == user_id, Preference.key == key)
        )
        pref = existing.scalar_one_or_none()
        
        if pref:
            pref.value = value
            pref.data_type = data_type
            pref.updated_at = datetime.utcnow()
        else:
            pref = Preference(user_id=user_id, key=key, value=value, data_type=data_type)
            self.db.add(pref)
        
        await self.db.commit()
        return pref
    
    def _compute_initial_relevance(self, memory_type: str) -> float:
        """Recent memories are more relevant."""
        base_scores = {
            "preference": 1.0,
            "feedback": 0.9,
            "past_trip": 0.8,
            "inferred": 0.7,
            "blacklist": 1.0  # Always highly relevant
        }
        return base_scores.get(memory_type, 0.5)
```

---

## 6. MCP Tools (Full Implementation)

```python
# mcp_server/tools/memory_read.py

class GetUserMemoriesTool(BaseMCPTool):
    name = "get_user_memories"
    description = "Retrieve relevant user memories and preferences for personalization"
    
    async def _execute(self, inputs: dict) -> dict:
        user_id = inputs["user_id"]
        limit = inputs.get("limit", 10)
        memory_type = inputs.get("memory_type")
        
        repo = MemoryRepository(self.get_db_session())
        memories = await repo.get_by_user(user_id, memory_type=memory_type, limit=limit)
        
        return {
            "memories": [
                {
                    "id": str(m.id),
                    "type": m.memory_type,
                    "content": m.content,
                    "relevance_score": m.relevance_score,
                    "created_at": m.created_at.isoformat()
                }
                for m in memories
            ],
            "total": len(memories)
        }


# mcp_server/tools/memory_write.py

class SaveUserMemoryTool(BaseMCPTool):
    name = "save_user_memory"
    description = "Persist a new memory or preference for personalization"
    
    async def _execute(self, inputs: dict) -> dict:
        user_id = inputs["user_id"]
        memory_type = inputs["memory_type"]
        content = inputs["content"]
        
        repo = MemoryRepository(self.get_db_session())
        memory = await repo.create(user_id, memory_type, content)
        
        return {
            "memory_id": str(memory.id),
            "success": True
        }
```

---

## 7. API Endpoints

```python
# backend/app/api/v1/users.py

@router.get("/me/memories", response_model=MemoryListResponse)
async def get_memories(
    memory_type: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = MemoryRepository(db)
    memories = await repo.get_by_user(
        str(current_user.id), memory_type=memory_type, limit=50
    )
    return MemoryListResponse(
        memories=[MemoryResponse.from_orm(m) for m in memories]
    )


@router.delete("/me/memories/{memory_id}")
async def delete_memory(
    memory_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = MemoryRepository(db)
    deleted = await repo.delete(memory_id, str(current_user.id))
    if not deleted:
        raise HTTPException(404, "Memory not found")
    return {"message": "Memory deleted successfully"}


@router.put("/me/preferences")
async def update_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = MemoryRepository(db)
    for key, value in preferences.items():
        await repo.set_preference(str(current_user.id), key, str(value))
    return {"message": "Preferences updated", "updated_keys": list(preferences.keys())}
```

---

## 8. Memory Context Injection

When `TripUnderstandingAgent` runs, it injects memory context into its LLM prompt:

```python
def _format_memory_context(self, memories: list[dict]) -> str:
    if not memories:
        return "No prior user history available."
    
    sections = {
        "preference": [],
        "past_trip": [],
        "blacklist": [],
        "feedback": []
    }
    
    for m in memories:
        sections.get(m["type"], []).append(m["content"])
    
    lines = []
    if sections["preference"]:
        lines.append(f"User preferences: {json.dumps(sections['preference'])}")
    if sections["past_trip"]:
        dests = [t.get("destination") for t in sections["past_trip"] if t.get("destination")]
        lines.append(f"Previously visited: {', '.join(dests)}")
    if sections["blacklist"]:
        avoids = [b.get("destination") for b in sections["blacklist"] if b.get("destination")]
        lines.append(f"User wants to avoid: {', '.join(avoids)}")
    
    return "\n".join(lines)
```

---

## 9. Edge Cases

| Scenario | Behavior |
|---|---|
| User has no memories | Agents proceed with default behavior |
| Memory fetch fails (DB down) | Agents proceed without memory context, log warning |
| Expired memories | Filtered out by `expires_at > now()` query |
| Duplicate preference key | Upsert — update existing value |
| Memory content too large (>10KB) | Truncate with warning |
| User deletes non-owned memory | `404` returned |

---

## 10. Acceptance Criteria

- [ ] `GET /users/me/memories` returns all user memories filtered by type.
- [ ] `DELETE /users/me/memories/{id}` deletes only the owner's memory.
- [ ] `PUT /users/me/preferences` upserts preference key-value pairs.
- [ ] `save_user_memory` MCP tool persists to DB correctly.
- [ ] `get_user_memories` MCP tool returns memories ordered by `relevance_score`.
- [ ] Expired memories not returned in queries.
- [ ] TripUnderstandingAgent injects memory context into LLM prompt.
- [ ] Past trip destinations excluded from future recommendations.

---

## 11. Definition of Done

- All memory CRUD operations tested (unit + integration).
- MCP tools tested with DB fixture.
- Memory context injection verified in agent test.
- Coverage ≥ 80%.

---

*M13 — Memory System | Duration: 1 Week*
