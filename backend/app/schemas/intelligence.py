from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TravelInsightSource(BaseModel):
    video_id: str = Field(..., description="The YouTube video ID")
    title: str = Field(..., description="Title of the video")
    channel_name: str = Field(..., description="Name of the channel")
    upload_date: str = Field(..., description="Approximate upload date (e.g. 2025-12-01)")
    timestamp: str = Field(..., description="Vlog timestamp where the info is mentioned (e.g. 05:22)")
    url: str = Field(..., description="Direct YouTube link with timestamp")

class LocalInsight(BaseModel):
    category: str = Field(..., description="E.g. hidden_gems, scams, local_rules, shopping")
    detail: str = Field(..., description="The detailed insight")
    confidence: str = Field(..., description="High, Medium, or Low")
    source_ref: str = Field(..., description="Reference string matching a source video title or channel")

class LocalPhrases(BaseModel):
    phrase: str = Field(..., description="Phrase in local language")
    pronunciation: str = Field(..., description="Pronunciation guide")
    translation: str = Field(..., description="Translation in user's language")

class TravelIntelligenceResponse(BaseModel):
    trip_summary: Dict[str, Any] = Field(..., description="Summary of the trip including destination, days, interests, and style")
    daily_itinerary: List[Dict[str, Any]] = Field(..., description="Day-wise itinerary. Each recommendation must include a 'why_selected_rationale' field referring to vlog findings.")
    estimated_budget: Dict[str, Any] = Field(..., description="Estimated cost details in INR for lodging, food, activities, and transport, with average local prices.")
    latest_local_insights: List[Dict[str, Any]] = Field(..., description="General real-world travel tips and observations.")
    hidden_gems: List[LocalInsight] = Field(..., description="Lesser-known, off-the-beaten-path locations recommended by vloggers.")
    food_recommendations: List[LocalInsight] = Field(..., description="Dishes, street foods, or restaurants praised in vlogs.")
    transport_tips: List[LocalInsight] = Field(..., description="Local transport advice, metro guides, and taxi recommendations.")
    scam_alerts: List[LocalInsight] = Field(..., description="Safety alerts, tourist traps, and common street scams to avoid.")
    things_to_avoid: List[LocalInsight] = Field(..., description="Regrets, overrated places, or practices that travelers advised against.")
    packing_list: List[str] = Field(..., description="Packing items suggested by vloggers based on local climate and customs.")
    important_local_rules: List[LocalInsight] = Field(..., description="Crucial local customs, do's, and don'ts.")
    best_photo_spots: List[LocalInsight] = Field(..., description="Instagrammable spots recommended in travel vlogs.")
    shopping_tips: List[LocalInsight] = Field(..., description="Market recommendations and negotiation tips.")
    local_phrases: List[LocalPhrases] = Field(..., description="Useful phrases, greetings, and polite terms.")
    confidence_score: Dict[str, Any] = Field(..., description="Overall confidence analysis of the vlog data and official verifications (e.g. average score out of 100).")
    sources: List[TravelInsightSource] = Field(..., description="Array of source vlogs referenced in the insights.")
