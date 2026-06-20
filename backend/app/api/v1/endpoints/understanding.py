from fastapi import APIRouter, HTTPException, status
from app.agents.understanding import parse_trip_request
from app.schemas.understanding import ParseRequest, ParseResponse

router = APIRouter()

@router.post("/parse", response_model=ParseResponse)
def parse_query(payload: ParseRequest):
    """
    Parse natural language query into structured trip requirements.
    """
    try:
        parsed_data = parse_trip_request(payload.query)
        return ParseResponse(
            success=True,
            data=parsed_data
        )
    except Exception as e:
        return ParseResponse(
            success=False,
            error=str(e)
        )
