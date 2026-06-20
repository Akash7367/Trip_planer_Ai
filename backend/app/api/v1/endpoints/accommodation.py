from fastapi import APIRouter
from typing import List
from app.agents.accommodation import recommend_accommodation
from app.schemas.accommodation import AccommodationRequest, AccommodationOption

router = APIRouter()

@router.post("/recommend", response_model=List[AccommodationOption])
def recommend_lodging(payload: AccommodationRequest):
    """
    Search and rank hotel, hostel, and resort lodging matching location, budget, rating, and amenity options.
    """
    return recommend_accommodation(payload)
