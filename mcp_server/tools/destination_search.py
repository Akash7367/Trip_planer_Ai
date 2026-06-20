from mcp_server.registry.tool_registry import tool_registry
from mcp_server.schemas.tools import DestinationSearchInput

@tool_registry.register(
    name="destination_search",
    description="Search for travel attractions, sightseeing, and activities in a specific destination.",
    schema=DestinationSearchInput
)
def destination_search(query: str, category: str = None) -> dict:
    """
    Search destination attractions.
    """
    activities = [
        {"name": "Kiyomizu-dera Temple", "category": "temples", "rating": 4.8, "cost": "Low"},
        {"name": "Fushimi Inari-taisha Shrine", "category": "temples", "rating": 4.9, "cost": "Free"},
        {"name": "Arashiyama Bamboo Grove", "category": "nature", "rating": 4.7, "cost": "Free"},
        {"name": "Nishiki Market Food Tour", "category": "food", "rating": 4.6, "cost": "Medium"},
    ]
    
    if category:
        filtered = [a for a in activities if a["category"].lower() == category.lower()]
    else:
        filtered = activities

    return {
        "destination": query,
        "results_count": len(filtered),
        "activities": filtered
    }
