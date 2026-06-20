from mcp_server.registry.tool_registry import tool_registry
from mcp_server.schemas.tools import BudgetEstimatorInput

@tool_registry.register(
    name="budget_estimator",
    description="Calculate an estimated travel budget based on traveler size, duration, and accommodation class.",
    schema=BudgetEstimatorInput
)
def budget_estimator(location: str, days: int, travelers: int = 1, accommodation_class: str = "mid") -> dict:
    """
    Estimate travel budget.
    """
    rates = {
        "budget": {"accommodation": 40.0, "food": 25.0, "transport": 10.0, "attractions": 15.0},
        "mid": {"accommodation": 110.0, "food": 50.0, "transport": 20.0, "attractions": 30.0},
        "luxury": {"accommodation": 300.0, "food": 120.0, "transport": 60.0, "attractions": 80.0}
    }
    
    tier = rates.get(accommodation_class.lower(), rates["mid"])
    
    daily_acc = tier["accommodation"]
    daily_per_person = tier["food"] + tier["transport"] + tier["attractions"]
    
    total_accommodation = daily_acc * days
    total_activities_food = daily_per_person * days * travelers
    total_estimated = total_accommodation + total_activities_food

    return {
        "location": location,
        "days": days,
        "travelers": travelers,
        "class": accommodation_class,
        "breakdown": {
            "daily_accommodation_rate": daily_acc,
            "daily_per_person_allowance": daily_per_person,
            "total_accommodation": total_accommodation,
            "total_activities_and_food": total_activities_food,
        },
        "currency": "USD",
        "total_estimated": total_estimated
    }
