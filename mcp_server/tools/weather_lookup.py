from mcp_server.registry.tool_registry import tool_registry
from mcp_server.schemas.tools import WeatherLookupInput

@tool_registry.register(
    name="weather_lookup",
    description="Fetch historical or forecasted weather conditions for a given destination.",
    schema=WeatherLookupInput
)
def weather_lookup(location: str, days: int = 7) -> dict:
    """
    Lookup weather forecast.
    """
    days = min(max(days, 1), 14)
    forecast = []
    
    for i in range(days):
        forecast.append({
            "day": i + 1,
            "temp_c": 22 + (i % 3),
            "condition": "Sunny" if i % 4 != 0 else "Partly Cloudy",
            "rain_probability": "10%" if i % 4 != 0 else "30%"
        })

    return {
        "location": location,
        "days_checked": days,
        "average_temp_c": 23,
        "forecast": forecast
    }
