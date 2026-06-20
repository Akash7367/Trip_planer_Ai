from pydantic import BaseModel, Field
from typing import List, Optional

class WeatherRequest(BaseModel):
    location: str = Field(..., description="The travel destination to analyze weather for")
    days: Optional[int] = Field(default=7, description="Number of days to forecast")

class WeatherIntelligence(BaseModel):
    temperature: str = Field(..., description="Estimated average temperature during trip (e.g. '31C')")
    rain_probability: str = Field(..., description="Estimated maximum rain probability (e.g. '15%')")
    suitability_score: int = Field(..., ge=0, le=100, description="Suitability score out of 100")
    warnings: List[str] = Field(default_factory=list, description="Weather warning list if any extreme conditions are forecasted")
