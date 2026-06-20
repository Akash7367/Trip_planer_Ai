from fastapi import APIRouter
from app.agents.itinerary import generate_itinerary
from app.schemas.itinerary import ItineraryRequest, ItineraryResponse

router = APIRouter()

@router.post("/generate", response_model=ItineraryResponse)
def generate_trip_itinerary(payload: ItineraryRequest):
    """
    Generate structured, day-by-day itineraries (Morning, Afternoon, Evening) matching interests and weather forecasts.
    """
    return generate_itinerary(payload)

