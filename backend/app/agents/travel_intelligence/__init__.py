from typing import Dict, Any
from app.agents.travel_intelligence.graph import travel_intelligence_graph
from app.agents.travel_intelligence.llm_gateway import call_travel_llm

def generate_travel_intelligence(query: str, days: int = 5, budget: float = 50000.0, source_city: str = "Delhi") -> Dict[str, Any]:
    """
    Run the full stateful LangGraph Travel Intelligence pipeline.
    """
    initial_state = {
        "query": query,
        "destination": "Rajasthan",
        "source_city": source_city,
        "budget": budget,
        "days": days,
        "interests": [],
        "language": "English",
        "videos": [],
        "raw_transcripts": [],
        "translated_transcripts": [],
        "extracted_knowledge": {},
        "verified_knowledge": {},
        "final_itinerary": {},
        "logs": [],
        "retries": 0
    }
    
    # Run the compiled LangGraph
    final_output = travel_intelligence_graph.invoke(initial_state)
    return {
        "plan": final_output["final_itinerary"],
        "logs": final_output["logs"]
    }
