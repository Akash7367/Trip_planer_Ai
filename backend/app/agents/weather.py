import sys
import os
import logging
from typing import List

# Append root folder to sys.path so sibling modules like mcp_server are discoverable
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

logger = logging.getLogger("app.agents.weather")

try:
    from mcp_server.tools.weather_lookup import weather_lookup
    logger.info("Imported weather_lookup from mcp_server successfully.")
except ImportError:
    logger.warning("Could not import weather_lookup from mcp_server; falling back to local mock implementation.")
    # Local fallback matching the MCP tool logic
    def weather_lookup(location: str, days: int = 7) -> dict:
        days = min(max(days, 1), 14)
        forecast = []
        for i in range(days):
            # If Goa is requested, give a nice warm sunny forecast
            if "goa" in location.lower():
                temp = 31
                rain = 15
            else:
                temp = 22 + (i % 3)
                rain = 10 if i % 4 != 0 else 30
                
            forecast.append({
                "day": i + 1,
                "temp_c": temp,
                "condition": "Sunny" if rain < 20 else "Partly Cloudy",
                "rain_probability": f"{rain}%"
            })
        return {
            "location": location,
            "days_checked": days,
            "average_temp_c": sum(d["temp_c"] for d in forecast) // len(forecast),
            "forecast": forecast
        }

from app.schemas.weather import WeatherRequest, WeatherIntelligence

def analyze_weather(payload: WeatherRequest) -> WeatherIntelligence:
    """
    Invoke MCP weather tool, analyze results, and calculate suitability score.
    """
    location = payload.location
    days = payload.days or 7

    # Call MCP weather tool
    forecast_data = weather_lookup(location=location, days=days)
    forecast = forecast_data.get("forecast", [])

    if not forecast:
        return WeatherIntelligence(
            temperature="N/A",
            rain_probability="N/A",
            suitability_score=50,
            warnings=["No forecast details available."]
        )

    # Calculate metrics
    total_temp = 0
    max_rain = 0
    warnings = []

    for day in forecast:
        temp = day.get("temp_c", 20)
        rain_str = day.get("rain_probability", "0%")
        rain_val = int(rain_str.replace("%", ""))

        total_temp += temp
        if rain_val > max_rain:
            max_rain = rain_val

    avg_temp = total_temp / len(forecast)

    # 1. Compute suitability score (starting at 100)
    score = 100

    # Deduct for rain
    score -= (max_rain * 0.4)

    # Deduct for temperature extremes
    temp_penalty = 0
    if avg_temp > 32:
        temp_penalty = (avg_temp - 32) * 2
    elif avg_temp < 15:
        temp_penalty = (15 - avg_temp) * 2
    score -= temp_penalty

    # Deduct for specific warnings
    if max_rain > 70:
        warnings.append("Heavy rain/storms forecast. Outdoor travel not recommended.")
        score -= 20
    elif max_rain > 40:
        warnings.append("Moderate rain expected. Carry umbrellas/raincoats.")

    if avg_temp > 38:
        warnings.append("Extreme heat warning. Stay hydrated.")
        score -= 15
    elif avg_temp < 5:
        warnings.append("Extreme cold warning. Wear heavy winter layers.")
        score -= 15

    final_score = min(max(int(score), 0), 100)

    # Format returns
    return WeatherIntelligence(
        temperature=f"{int(avg_temp)}C",
        rain_probability=f"{max_rain}%",
        suitability_score=final_score,
        warnings=warnings
    )
