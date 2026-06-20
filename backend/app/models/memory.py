from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class UserMemory(Base):
    __tablename__ = "user_memories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # 'favorite_destinations', 'travel_style', 'budget_preferences', 'trip_history'
    content = Column(Text, nullable=False)
    embedding = Column(JSON, nullable=True)  # Store list of floats
    created_at = Column(DateTime(timezone=True), server_default=func.now())
