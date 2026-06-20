import sys
import os
import json
import logging
from typing import List
from app.core.config import settings
from app.schemas.itinerary import ItineraryRequest, DailySchedule, ItineraryResponse

# Append root folder to sys.path so sibling modules like mcp_server are discoverable
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

logger = logging.getLogger("app.agents.itinerary")

try:
    from mcp_server.tools.destination_search import destination_search
    logger.info("Imported destination_search from mcp_server successfully.")
except ImportError:
    logger.warning("Could not import destination_search from mcp_server; falling back to local mock implementation.")
    # Local fallback matching the MCP tool logic
    def destination_search(query: str, category: str = None) -> dict:
        loc = query.lower()
        if "goa" in loc:
            return {
                "activities": [
                    {"name": "Calangute Beach Walk", "category": "beach", "rating": 4.5},
                    {"name": "Basilica of Bom Jesus", "category": "history", "rating": 4.8},
                    {"name": "Anjuna Flea Market", "category": "shopping", "rating": 4.3},
                    {"name": "Dudhsagar Waterfalls Trek", "category": "nature", "rating": 4.7},
                    {"name": "Fort Aguada Sightseeing", "category": "history", "rating": 4.6}
                ]
            }
        else:
            return {
                "activities": [
                    {"name": "Historic Castle Visit", "category": "history", "rating": 4.4},
                    {"name": "Public Park Stroll", "category": "nature", "rating": 4.3},
                    {"name": "Local Museum Walkthrough", "category": "culture", "rating": 4.6}
                ]
            }

def generate_itinerary(req: ItineraryRequest) -> ItineraryResponse:
    """
    Generate detailed daily itineraries matching days, interests, and weather parameters.
    Uses LLMs if API keys are set; otherwise, calls the MCP tool and maps outputs.
    """
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"Generate travel itinerary details for: {req.model_dump_json()}"
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=ItineraryResponse
                )
            )
            data = json.loads(response.text)
            return ItineraryResponse(**data)
        except Exception as e:
            logger.error(f"Gemini itinerary generation failed, falling back: {str(e)}")

    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            prompt = f"Generate travel itinerary details for: {req.model_dump_json()}"
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                response_format=ItineraryResponse
            )
            return response.choices[0].message.parsed
        except Exception as e:
            logger.error(f"OpenAI itinerary generation failed, falling back: {str(e)}")

    # Heuristic fallback matching
    logger.info("Executing rule-based itinerary generation.")
    return rule_based_generate(req)


def rule_based_generate(req: ItineraryRequest) -> ItineraryResponse:
    """
    Generates daily morning, afternoon, and evening slots using attractions from destination_search.
    """
    dest = req.destination
    days = req.days
    weather_score = req.weather_score

    # Fetch sights using MCP tool
    raw_data = destination_search(query=dest)
    activities = raw_data.get("activities", [])

    # If weather is bad, prioritize indoor activities
    bad_weather = weather_score is not None and weather_score < 60
    if bad_weather:
        # Filter for indoor/culture activities primarily, or issue warning alerts
        attractions = [a["name"] for a in activities if a["category"] in ["history", "culture", "shopping"]]
        if not attractions:
            attractions = [a["name"] for a in activities]
    else:
        attractions = [a["name"] for a in activities]

    if not attractions:
        attractions = ["Explore local streets and downtown landmarks", "Visit city centre public garden", "Tour regional arts hall"]

    schedule = []
    attraction_index = 0

    for day in range(1, days + 1):
        # Pick morning activity
        morning_sight = attractions[attraction_index % len(attractions)]
        attraction_index += 1

        # Pick afternoon activity
        afternoon_sight = attractions[attraction_index % len(attractions)]
        attraction_index += 1

        # Formulate descriptions based on weather
        if bad_weather:
            morning = f"Morning: Indoor visit to {morning_sight} to avoid bad weather conditions."
            afternoon = f"Afternoon: Head over to {afternoon_sight}. Enjoy indoor dining nearby during rest break."
            evening = f"Evening: Relax at local cafes, check out indoor shopping malls and dining options."
        else:
            morning = f"Morning: Visit {morning_sight}. Enjoy walking outdoors."
            afternoon = f"Afternoon: Travel over to {afternoon_sight}. Take leisure rest period under shade."
            evening = f"Evening: Walk through lively local street markets and dinner at top rated restaurants."

        schedule.append(
            DailySchedule(
                day=day,
                morning=morning,
                afternoon=afternoon,
                evening=evening
            )
        )

    return ItineraryResponse(
        destination=dest,
        itinerary=schedule
    )
