from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    destination = Column(String(100), nullable=False, index=True)
    days = Column(Integer, nullable=False)
    travelers = Column(Integer, nullable=False)
    is_favorite = Column(Boolean, default=False, nullable=False, index=True)
    plan_data = Column(JSON, nullable=True)  # Store compiled FinalTripPlan JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
