from typing import TypedDict, List, Dict, Any

class TravelIntelligenceState(TypedDict):
    query: str
    destination: str
    source_city: str
    budget: float
    days: int
    interests: List[str]
    language: str
    videos: List[Dict[str, Any]]
    raw_transcripts: List[Dict[str, Any]]
    translated_transcripts: List[Dict[str, Any]]
    extracted_knowledge: Dict[str, Any]
    verified_knowledge: Dict[str, Any]
    final_itinerary: Dict[str, Any]
    logs: List[str]
    retries: int
