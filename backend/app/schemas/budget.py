from pydantic import BaseModel, Field

class BudgetBreakdown(BaseModel):
    travel_cost: float = Field(..., description="Estimated cost of transportation")
    accommodation_cost: float = Field(..., description="Estimated cost of lodging")
    food_cost: float = Field(..., description="Estimated cost of food and beverage")
    activities_cost: float = Field(..., description="Estimated cost of sightseeing and activities")
    buffer: float = Field(..., description="Emergency buffer amount")
    total: float = Field(..., description="Combined total estimated cost of the trip")
