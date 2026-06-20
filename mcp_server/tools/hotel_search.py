from mcp_server.registry.tool_registry import tool_registry
from mcp_server.schemas.tools import HotelSearchInput

@tool_registry.register(
    name="hotel_search",
    description="Search for lodging, hotels, or hostels in a specific area based on date constraints and budgets.",
    schema=HotelSearchInput
)
def hotel_search(location: str, check_in: str, check_out: str, budget: float = None) -> dict:
    """
    Search hotel options.
    """
    hotels = [
        {"name": "Kyoto Boutique Ryokan", "price_per_night": 150.0, "rating": 4.9, "amenities": ["WiFi", "Onsen", "Breakfast"]},
        {"name": "Gion Cozy Hostel", "price_per_night": 45.0, "rating": 4.5, "amenities": ["WiFi", "Shared Kitchen"]},
        {"name": "The Thousand Hotel Kyoto", "price_per_night": 320.0, "rating": 4.8, "amenities": ["WiFi", "Gym", "Spa", "Bar"]},
    ]

    if budget:
        filtered = [h for h in hotels if h["price_per_night"] <= budget]
    else:
        filtered = hotels

    return {
        "location": location,
        "check_in": check_in,
        "check_out": check_out,
        "results_count": len(filtered),
        "hotels": filtered
    }
