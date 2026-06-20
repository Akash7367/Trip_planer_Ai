from pydantic import BaseModel, Field
from typing import List

class TransportRequest(BaseModel):
    source_city: str = Field(..., description="The departure/origin city")
    destination: str = Field(..., description="The travel destination city")
    travel_dates: str = Field(..., description="The travel date(s) (e.g., YYYY-MM-DD)")

class TransportOption(BaseModel):
    mode: str = Field(..., description="Mode of transport (e.g., 'Flight', 'Train', 'Bus', 'Local')")
    cost: float = Field(..., description="Estimated cost of travel")
    duration: str = Field(..., description="Estimated travel duration (e.g., '8h', '1h 20m')")
    convenience_score: int = Field(..., ge=0, le=100, description="Convenience score out of 100")

class TransportResponse(BaseModel):
    options: List[TransportOption]
