from pydantic import BaseModel, Field
from typing import List, Optional

class ItineraryRequest(BaseModel):
    destination: str = Field(..., description="Target destination for the itinerary")
    days: int = Field(..., ge=1, le=30, description="Number of days for the trip")
    interests: List[str] = Field(default_factory=list, description="User interests for sightseeing filters")
    weather_score: Optional[int] = Field(default=None, description="Travel weather suitability score")

class DailySchedule(BaseModel):
    day: int = Field(..., description="Day number of the trip (1-indexed)")
    morning: str = Field(..., description="Morning activity description")
    afternoon: str = Field(..., description="Afternoon activity description")
    evening: str = Field(..., description="Evening activity description")

class ItineraryResponse(BaseModel):
    destination: str = Field(..., description="Name of the destination")
    itinerary: List[DailySchedule]
