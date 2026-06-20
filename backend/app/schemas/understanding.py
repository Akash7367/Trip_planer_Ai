from pydantic import BaseModel, Field
from typing import List, Optional

class TripRequirements(BaseModel):
    destination: str = Field(..., description="The travel destination city, region, or country (e.g. 'Goa', 'Paris')")
    days: Optional[int] = Field(default=None, description="Total duration of the trip in days")
    people: Optional[int] = Field(default=None, description="Number of travelers/people on the trip")
    budget: Optional[float] = Field(default=None, description="The budget for the trip, if specified (keep numeric only)")
    trip_type: Optional[str] = Field(default=None, description="Category of the trip (e.g. 'friends', 'romantic', 'family', 'solo', 'business')")
    dates: Optional[str] = Field(default=None, description="Dates of travel if mentioned (e.g. 'December', 'next week')")
    interests: List[str] = Field(default_factory=list, description="List of activities, sights or interests mentioned (e.g. 'beaches', 'culture', 'nightlife')")
    accommodation_preferences: Optional[str] = Field(default=None, description="Preferred accommodation style (e.g. 'hostel', 'resort', 'luxury hotel', 'villa')")

class ParseRequest(BaseModel):
    query: str = Field(..., description="Natural language trip request query")

class ParseResponse(BaseModel):
    success: bool
    data: Optional[TripRequirements] = None
    error: Optional[str] = None
