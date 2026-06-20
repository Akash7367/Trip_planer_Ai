from pydantic import BaseModel, Field
from typing import List, Optional

class RecommendationInput(BaseModel):
    budget: Optional[float] = Field(default=None, description="The budget for the trip")
    season: Optional[str] = Field(default=None, description="The season of travel (e.g. 'winter', 'summer', 'monsoon')")
    traveler_type: Optional[str] = Field(default=None, description="The traveler type (e.g. 'family', 'friends', 'solo', 'couple')")
    interests: List[str] = Field(default_factory=list, description="List of user interests (e.g. 'beach', 'culture', 'nature', 'adventure', 'food')")

class DestinationRecommendation(BaseModel):
    destination: str = Field(..., description="Name of the recommended destination")
    score: int = Field(..., ge=0, le=100, description="Recommendation match score from 0 to 100")
    reason: str = Field(..., description="Explanation/reason for why this destination matches preferences")

class RecommendationList(BaseModel):
    recommendations: List[DestinationRecommendation]
