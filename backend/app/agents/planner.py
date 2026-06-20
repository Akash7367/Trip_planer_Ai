import json
import logging
from typing import List, Optional
from app.core.config import settings

# Import schemas
from app.schemas.understanding import TripRequirements
from app.schemas.weather import WeatherIntelligence
from app.schemas.transport import TransportOption
from app.schemas.accommodation import AccommodationOption
from app.schemas.budget import BudgetBreakdown
from app.schemas.itinerary import ItineraryResponse
from app.schemas.planner import FinalTripPlan

logger = logging.getLogger("app.agents.planner")

def generate_packing_list(
    destination: str,
    interests: List[str],
    weather: WeatherIntelligence
) -> List[str]:
    """
    Generate dynamic packing checklist customized by destination, interests, and weather.
    """
    items = ["Valid ID & Travel documents", "Chargers & Powerbank", "Personal toiletries", "First-aid kit"]
    
    # Destination & Interest adjustments
    dest_lower = destination.lower()
    interest_lowers = [i.lower() for i in interests]
    
    if "goa" in dest_lower or "beach" in interest_lowers:
        items.extend(["Swimwear", "Sunscreen (SPF 50+)", "Sunglasses", "Beach towel", "Flip-flops/sandals"])
    elif "kyoto" in dest_lower or "culture" in interest_lowers:
        items.extend(["Comfortable walking shoes", "Slip-on shoes for temples", "Modest clothing for sacred sights", "Camera"])
    elif "nature" in interest_lowers or "trekking" in interest_lowers:
        items.extend(["Hiking boots", "Insect repellent", "Reusable water bottle", "Hat / cap"])
        
    # Weather adjustments
    # Rain
    rain_prob = int(weather.rain_probability.replace("%", "")) if "%" in weather.rain_probability else 0
    if rain_prob > 30 or "rain" in "".join(weather.warnings).lower():
        items.extend(["Compact umbrella", "Raincoat / waterproof jacket", "Waterproof bag covers"])
        
    # Temperature
    temp_val = int("".join(filter(str.isdigit, weather.temperature))) if any(c.isdigit() for c in weather.temperature) else 20
    if temp_val < 15:
        items.extend(["Thermal layers", "Heavy warm coat", "Gloves & beanie", "Moisturizer / lip balm"])
    elif temp_val > 30:
        items.extend(["Lightweight breathable clothing", "Electrolyte packets", "Wide-brimmed hat"])
        
    return list(dict.fromkeys(items))  # Deduplicate keeping order

def compile_final_plan(
    requirements: TripRequirements,
    weather: WeatherIntelligence,
    transport: Optional[TransportOption],
    accommodation: Optional[AccommodationOption],
    budget: BudgetBreakdown,
    itinerary: ItineraryResponse
) -> FinalTripPlan:
    """
    Compile single structured trip plan, generating custom Executive Summary and packing lists.
    """
    dest = requirements.destination
    days = requirements.days or 5
    people = requirements.people or 1
    
    # 1. Generate Packing List
    packing_list = generate_packing_list(dest, requirements.interests, weather)
    
    # 2. Attempt LLM-based Executive Summary
    exec_summary = None
    prompt = (
        f"Generate a professional, inviting travel executive summary (2-3 sentences) for a "
        f"{days}-day trip to {dest} for {people} travelers. "
        f"Transport selected: {transport.mode if transport else 'None'}. "
        f"Hotel: {accommodation.hotel if accommodation else 'None'}. "
        f"Total estimated budget: {budget.total} USD. "
        f"Weather expected: {weather.temperature} with suitability score {weather.suitability_score}."
    )
    
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            exec_summary = response.text.strip()
        except Exception as e:
            logger.error(f"Gemini planner summary failed, falling back: {str(e)}")
            
    if not exec_summary and settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150
            )
            exec_summary = response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI planner summary failed, falling back: {str(e)}")
            
    # Fallback rule-based summary
    if not exec_summary:
        style = f" with primary interests in {', '.join(requirements.interests)}" if requirements.interests else ""
        stay_desc = f"staying at the highly rated {accommodation.hotel}" if accommodation else "planning independent lodging"
        transit_desc = f"via {transport.mode}" if transport else ""
        exec_summary = (
            f"This custom-curated {days}-day itinerary outlines an exceptional journey to {dest} for {people} "
            f"traveler(s){style}. You will be {stay_desc} {transit_desc}, enjoying an optimal weather suitability "
            f"score of {weather.suitability_score}% ({weather.temperature} avg). The complete schedule is optimized "
            f"comfortably within your financial target of {budget.total}."
        )

    return FinalTripPlan(
        executive_summary=exec_summary,
        destination=dest,
        days=days,
        travelers=people,
        weather_analysis=weather,
        transport_recommendation=transport,
        hotel_recommendation=accommodation,
        budget_summary=budget,
        day_wise_itinerary=itinerary,
        packing_list=packing_list
    )
