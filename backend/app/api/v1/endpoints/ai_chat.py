from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.agents.travel_intelligence_orchestrator import call_travel_llm
import json

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' | 'assistant'
    text: str

class AIChatRequest(BaseModel):
    message: str = Field(..., description="User's message to the AI assistant")
    plan_context: Optional[Dict[str, Any]] = Field(default=None, description="Current trip plan for context")
    conversation_history: Optional[List[ChatMessage]] = Field(default=[], description="Previous messages")

class AIChatResponse(BaseModel):
    reply: str
    agent_name: str
    updated_plan: Optional[Dict[str, Any]] = None

def build_system_context(plan: Optional[Dict[str, Any]]) -> str:
    if not plan:
        return "You are a helpful AI travel assistant. Answer travel questions concisely."
    
    dest = plan.get("trip_summary", {}).get("destination") or plan.get("destination", "the destination")
    src = plan.get("trip_summary", {}).get("source_city", "the origin city")
    days = plan.get("trip_summary", {}).get("days") or plan.get("days", 5)
    budget = plan.get("estimated_budget", {}).get("total_estimated_cost", "unspecified budget")
    style = plan.get("trip_summary", {}).get("style", "general travel")
    lang = plan.get("trip_summary", {}).get("preferred_language", "English")

    # Extract key plan details
    hotels = []
    if plan.get("hotel_recommendation"):
        h = plan["hotel_recommendation"]
        hotels.append(f"{h.get('hotel', 'Unknown')} (₹{h.get('price', '?')}/night, rating: {h.get('rating', '?')})")
    
    transport = plan.get("transport_recommendation", {})
    transport_str = f"{transport.get('mode', 'N/A')} — {transport.get('duration', 'N/A')} — ₹{transport.get('cost', 'N/A')}" if transport else "N/A"

    weather = plan.get("weather_analysis", {})
    weather_str = f"{weather.get('temperature', 'N/A')}, Rain: {weather.get('rain_probability', 'N/A')}, Score: {weather.get('suitability_score', 'N/A')}%" if weather else "N/A"

    gems = [g.get("detail", "") for g in (plan.get("hidden_gems") or [])[:3]]
    
    context = f"""You are an expert AI Travel Consultant with full knowledge of the user's current trip plan.

CURRENT TRIP PLAN:
- Route: {src} → {dest}
- Duration: {days} days
- Budget: {budget}
- Trip Style: {style}
- Language: {lang}
- Hotels: {', '.join(hotels) if hotels else 'Not specified'}
- Transport: {transport_str}
- Weather: {weather_str}
- Hidden Gems: {', '.join(gems) if gems else 'None found'}

INSTRUCTIONS:
- Answer questions about this specific trip concisely (2-4 sentences max)
- If the user asks to change something (hotel, budget, add/remove activities), suggest the change clearly
- If asked for alternatives, provide 2-3 specific options with prices
- Always be helpful, specific, and actionable
- Respond in {lang} if user writes in that language, otherwise English
- Never say "I don't know" — make reasonable recommendations based on the destination
"""
    return context


def detect_agent(message: str) -> str:
    m = message.lower()
    if any(w in m for w in ["hotel", "stay", "room", "accommodation", "hostel"]):
        return "Hotel Recommendation Agent"
    if any(w in m for w in ["food", "eat", "restaurant", "cuisine", "meal", "breakfast", "dinner"]):
        return "Food & Dining Agent"
    if any(w in m for w in ["transport", "train", "flight", "bus", "taxi", "metro", "travel"]):
        return "Transport Agent"
    if any(w in m for w in ["budget", "cost", "money", "expensive", "cheap", "save", "spend"]):
        return "Budget Optimization Agent"
    if any(w in m for w in ["weather", "rain", "temperature", "season", "climate"]):
        return "Weather Intelligence Agent"
    if any(w in m for w in ["safe", "scam", "danger", "emergency", "police", "hospital"]):
        return "Safety & Emergency Agent"
    if any(w in m for w in ["hidden", "gem", "local", "secret", "offbeat", "crowd"]):
        return "Hidden Gems Agent"
    if any(w in m for w in ["translate", "language", "phrase", "speak", "hindi", "bengali"]):
        return "Language Personalization Agent"
    if any(w in m for w in ["day", "itinerary", "morning", "evening", "schedule", "plan"]):
        return "Itinerary Planning Agent"
    return "Travel Intelligence Agent"


@router.post("/ai-chat", response_model=AIChatResponse)
def ai_chat_endpoint(payload: AIChatRequest):
    """
    Real-LLM AI chat endpoint. Takes user message + current plan context 
    and returns a contextual AI response via Gemini/Groq/OpenAI fallback chain.
    """
    system_ctx = build_system_context(payload.plan_context)
    
    # Build conversation history string
    history_str = ""
    if payload.conversation_history:
        for msg in payload.conversation_history[-6:]:  # Last 6 messages for context
            role = "User" if msg.role == "user" else "Assistant"
            history_str += f"{role}: {msg.text}\n"
    
    prompt = f"""{system_ctx}

CONVERSATION HISTORY:
{history_str if history_str else "(New conversation)"}

User's latest message: {payload.message}

Respond as the AI travel consultant. Be specific, helpful, and actionable:"""

    reply = call_travel_llm(prompt)
    
    if not reply:
        reply = f"I'm having trouble connecting right now. Based on your {payload.plan_context.get('trip_summary', {}).get('destination', 'trip') if payload.plan_context else 'trip'} plan, I'd suggest checking local travel forums for the most current information."

    agent_name = detect_agent(payload.message)
    
    return AIChatResponse(
        reply=reply,
        agent_name=agent_name,
        updated_plan=None
    )
