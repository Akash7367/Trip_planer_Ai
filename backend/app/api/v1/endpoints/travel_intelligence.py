from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.agents.travel_intelligence_orchestrator import generate_travel_intelligence

router = APIRouter()

class TravelIntelligenceRequest(BaseModel):
    query: str = Field(..., description="The natural language trip description")
    days: Optional[int] = Field(default=5, description="Number of trip days")
    budget: Optional[float] = Field(default=50000.0, description="Total budget limit in INR")
    source_city: Optional[str] = Field(default="Mumbai", description="Starting city")
    user_id: Optional[int] = Field(default=None, description="User ID")
    people: Optional[int] = Field(default=1, description="Number of travelers")

class TravelIntelligenceAPIResponse(BaseModel):
    plan: Dict[str, Any] = Field(..., description="The compiled TravelIntelligenceResponse payload")
    logs: List[str] = Field(..., description="Descriptive execution logs of the agent graph pipeline")

@router.post("/travel-intelligence", response_model=TravelIntelligenceAPIResponse)
def get_travel_intelligence_endpoint(payload: TravelIntelligenceRequest):
    """
    Triggers the multi-agent Travel Intelligence LangGraph pipeline.
    Parses vlogs, extracts real-world prices, local warnings, and compiles a customized itinerary.
    """
    try:
        result = generate_travel_intelligence(
            query=payload.query,
            days=payload.days,
            budget=payload.budget,
            source_city=payload.source_city or "Delhi"
        )
        return TravelIntelligenceAPIResponse(
            plan=result["plan"],
            logs=result["logs"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Travel Intelligence Agent Graph execution failed: {str(e)}")
