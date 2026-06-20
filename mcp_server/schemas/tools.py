from pydantic import BaseModel, Field
from typing import Optional

class DestinationSearchInput(BaseModel):
    query: str = Field(..., description="The travel destination or city to search for (e.g. 'Kyoto', 'Paris')")
    category: Optional[str] = Field(default=None, description="Optional category to filter interests (e.g. 'temples', 'nature', 'museums')")

class WeatherLookupInput(BaseModel):
    location: str = Field(..., description="The destination location to lookup forecast for")
    days: Optional[int] = Field(default=7, description="Number of forecast days, up to 14")

class HotelSearchInput(BaseModel):
    location: str = Field(..., description="The city or area to find hotels in")
    check_in: str = Field(..., description="Check-in date formatted as YYYY-MM-DD")
    check_out: str = Field(..., description="Check-out date formatted as YYYY-MM-DD")
    budget: Optional[float] = Field(default=None, description="Maximum price limit per night")

class BudgetEstimatorInput(BaseModel):
    location: str = Field(..., description="Destination name to estimate budget for")
    days: int = Field(..., description="Total trip duration in days")
    travelers: Optional[int] = Field(default=1, description="Number of travelers")
    accommodation_class: Optional[str] = Field(default="mid", description="Accommodation tier: 'budget', 'mid', or 'luxury'")
