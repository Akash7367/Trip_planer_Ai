from langgraph.graph import StateGraph, END
from app.agents.travel_intelligence.state import TravelIntelligenceState
from app.agents.travel_intelligence.nodes import (
    planner_node,
    youtube_search_node,
    transcript_node,
    translation_node,
    knowledge_extraction_node,
    verification_node,
    itinerary_generator_node,
    language_personalization_node
)

def build_travel_intelligence_graph() -> StateGraph:
    workflow = StateGraph(TravelIntelligenceState)
    
    # Add nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("search", youtube_search_node)
    workflow.add_node("transcript", transcript_node)
    workflow.add_node("translate", translation_node)
    workflow.add_node("extract", knowledge_extraction_node)
    workflow.add_node("verify", verification_node)
    workflow.add_node("itinerary", itinerary_generator_node)
    workflow.add_node("personalize", language_personalization_node)
    
    # Set entry point
    workflow.set_entry_point("planner")
    
    # Define sequential edges
    workflow.add_edge("planner", "search")
    workflow.add_edge("search", "transcript")
    workflow.add_edge("transcript", "translate")
    workflow.add_edge("translate", "extract")
    workflow.add_edge("extract", "verify")
    workflow.add_edge("verify", "itinerary")
    workflow.add_edge("itinerary", "personalize")
    workflow.add_edge("personalize", END)
    
    return workflow.compile()

# Global Compiled Graph
travel_intelligence_graph = build_travel_intelligence_graph()
