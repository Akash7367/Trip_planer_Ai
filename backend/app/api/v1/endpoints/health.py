import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.api.deps import get_db

router = APIRouter()
logger = logging.getLogger("app.health")

@router.get("", response_model=dict)
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint.
    Verifies API status and database connectivity.
    """
    health_status = {
        "status": "healthy",
        "services": {
            "api": "online",
            "database": "offline"
        }
    }
    
    try:
        # Check database connection
        db.execute(text("SELECT 1"))
        health_status["services"]["database"] = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["status"] = "unhealthy"
        health_status["services"]["database"] = f"error: {str(e)}"
        # Return 503 Service Unavailable if DB connection fails
        raise HTTPException(
            status_code=503,
            detail=health_status
        )

    return health_status
