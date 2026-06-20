from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class TripSave(BaseModel):
    destination: str = Field(..., description="Target destination city")
    days: int = Field(..., ge=1, description="Number of days")
    travelers: int = Field(..., ge=1, description="Number of travelers")
    plan_data: Optional[Any] = Field(default=None, description="The complete compiled FinalTripPlan JSON object")

class TripUpdate(BaseModel):
    is_favorite: Optional[bool] = Field(default=None, description="Toggle favorite status")

class TripResponse(BaseModel):
    id: int
    user_id: int
    destination: str
    days: int
    travelers: int
    is_favorite: bool
    plan_data: Optional[Any] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int
    page: int
    pages: int
    limit: int
