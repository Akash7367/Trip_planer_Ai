from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.weather import WeatherIntelligence
from app.schemas.transport import TransportOption
from app.schemas.accommodation import AccommodationOption
from app.schemas.budget import BudgetBreakdown
from app.schemas.itinerary import ItineraryResponse

class FinalTripPlan(BaseModel):
    executive_summary: str = Field(..., description="High-level narrative summary of the planned trip")
    destination: str = Field(..., description="Target destination city or region")
    days: int = Field(..., description="Total duration of the trip in days")
    travelers: int = Field(..., description="Total number of travelers")
    weather_analysis: WeatherIntelligence = Field(..., description="Weather overview and travel suitability score")
    transport_recommendation: Optional[TransportOption] = Field(default=None, description="Recommended mode of travel details")
    hotel_recommendation: Optional[AccommodationOption] = Field(default=None, description="Recommended accommodation booking option")
    budget_summary: BudgetBreakdown = Field(..., description="Categorized budget breakdown and emergency buffer")
    day_wise_itinerary: ItineraryResponse = Field(..., description="Detailed day-by-day morning, afternoon, and evening schedules")
    packing_list: List[str] = Field(default_factory=list, description="Tailored checklist of packing recommendations")
