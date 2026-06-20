from fastapi import APIRouter
from typing import List
from app.agents.transport import plan_transport
from app.schemas.transport import TransportRequest, TransportOption

router = APIRouter()

@router.post("/plan", response_model=List[TransportOption])
def plan_route_transport(payload: TransportRequest):
    """
    Search transit routes and options (Flight, Train, Bus) and estimate costs, convenience, and travel times.
    """
    return plan_transport(payload)
