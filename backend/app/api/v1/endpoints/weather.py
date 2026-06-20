from fastapi import APIRouter
from app.agents.weather import analyze_weather
from app.schemas.weather import WeatherRequest, WeatherIntelligence

router = APIRouter()

@router.post("/analyze", response_model=WeatherIntelligence)
def analyze_destination_weather(payload: WeatherRequest):
    """
    Lookup weather parameters using MCP tools and calculate travel suitability.
    """
    return analyze_weather(payload)
