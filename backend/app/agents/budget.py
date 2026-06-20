import sys
import os
import json
import logging
from typing import Optional
from app.core.config import settings
from app.schemas.budget import BudgetBreakdown

# Append root folder to sys.path so sibling modules like mcp_server are discoverable
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

logger = logging.getLogger("app.agents.budget")

try:
    from mcp_server.tools.budget_estimator import budget_estimator
    logger.info("Imported budget_estimator from mcp_server successfully.")
except ImportError:
    logger.warning("Could not import budget_estimator from mcp_server; falling back to local mock implementation.")
    # Local fallback matching the MCP tool logic
    def budget_estimator(location: str, days: int, travelers: int = 1, accommodation_class: str = "mid") -> dict:
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

def optimize_budget(
    destination: str,
    days: int,
    travelers: int = 1,
    transport_cost: Optional[float] = None,
    accommodation_cost: Optional[float] = None
) -> BudgetBreakdown:
    """
    Calculate and optimize trip budget.
    Merges actual transport and accommodation inputs if available, falling back
    to the budget_estimator MCP tool for baseline values.
    """
    days = max(days, 1)
    travelers = max(travelers, 1)

    # 1. Fetch baseline estimates from MCP tool
    base_data = budget_estimator(location=destination, days=days, travelers=travelers)
    
    # 2. Extract breakdown components
    # If explicit costs were found in pipeline, override default rates
    final_transport = transport_cost if transport_cost is not None else (1500.0 * travelers)
    final_accommodation = accommodation_cost if accommodation_cost is not None else base_data["breakdown"]["total_accommodation"]
    
    # Allowances based on travelers count and duration
    food_rate = 1000.0  # per person per day (INR scale or similar local scale)
    activity_rate = 800.0  # per person per day
    
    food_cost = food_rate * days * travelers
    activities_cost = activity_rate * days * travelers
    
    subtotal = final_transport + final_accommodation + food_cost + activities_cost
    buffer = subtotal * 0.10  # 10% emergency buffer
    total = subtotal + buffer

    return BudgetBreakdown(
        travel_cost=float(final_transport),
        accommodation_cost=float(final_accommodation),
        food_cost=float(food_cost),
        activities_cost=float(activities_cost),
        buffer=float(buffer),
        total=float(total)
    )
