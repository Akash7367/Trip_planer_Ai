from fastapi import APIRouter
from typing import List
from app.agents.recommendation import get_recommendations
from app.schemas.recommendation import RecommendationInput, DestinationRecommendation

router = APIRouter()

@router.post("/recommend", response_model=List[DestinationRecommendation])
def recommend_destinations(payload: RecommendationInput):
    """
    Rank and score top travel destinations matching budget, interests, season, and traveler type.
    """
    return get_recommendations(payload)

