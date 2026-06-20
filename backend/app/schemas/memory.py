from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserMemoryCreate(BaseModel):
    category: str = Field(..., description="Memory classification, e.g. 'favorite_destinations', 'travel_style', 'budget_preferences', 'trip_history'")
    content: str = Field(..., description="The details / context of the user preference memory")

class UserMemoryResponse(BaseModel):
    id: int
    user_id: int
    category: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class MemorySearchQuery(BaseModel):
    query: str = Field(..., description="The semantic search query term")
    category: Optional[str] = Field(default=None, description="Optional category to restrict searches to")

class MemorySearchResult(BaseModel):
    memory: UserMemoryResponse
    score: float = Field(..., description="Cosine similarity score (0.0 to 1.0)")
