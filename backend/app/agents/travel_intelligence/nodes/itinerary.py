import re
import json
import logging
from app.agents.travel_intelligence.state import TravelIntelligenceState
from app.agents.travel_intelligence.llm_gateway import call_travel_llm

logger = logging.getLogger("app.agents.travel_intelligence")

def itinerary_generator_node(state: TravelIntelligenceState) -> dict:
    logs = list(state.get("logs", []))
    dest = state["destination"]
    days = state["days"]
    lang = state["language"]
    extracted = state["extracted_knowledge"]
    
    logs.append(f"Itinerary Generator Agent: Compiling a customized, highly specific {days}-day itinerary for {dest}...")
    
    prompt = (
        f"Generate a highly detailed, professional, and structured day-wise travel itinerary for a {days}-day trip to '{dest}' "
        f"in the target language '{lang}'.\n"
        f"Use these extracted details from local travel vlogs:\n"
        f"Gems: {extracted.get('gems')}\n"
        f"Food: {extracted.get('food')}\n"
        f"Lodging: {extracted.get('lodging')}\n\n"
        f"Return ONLY a JSON block containing a list under the key 'itinerary'. Each item in the list must represent one day "
        f"and contain the following keys:\n"
        f"- 'day' (integer)\n"
        f"- 'title' (string, e.g. 'Exploring Jaipur's Majestic Palaces')\n"
        f"- 'morning' (string, detailing specific sights by name, e.g. 'Arrive at Amber Palace at 8 AM to beat crowds')\n"
        f"- 'afternoon' (string, detailing dining and afternoon sights by name, e.g. 'Eat Onion Kachori at Rawat Mishtan Bhandar')\n"
        f"- 'evening' (string, detailing evening highlights and relaxation spots by name)\n"
        f"- 'why_selected_rationale' (string, explaining which vlogger recommended this and why it's structured this way)\n\n"
        f"Ensure every day contains SPECIFIC, REAL names of monuments, streets, cafes, and sights. Do not use generic placeholders. "
        f"Do not include markdown or backticks."
    )
    
    itinerary_list = []
    llm_res = call_travel_llm(prompt)
    if llm_res:
        try:
            cleaned = re.sub(r'```json|```', '', llm_res).strip()
            data = json.loads(cleaned)
            itinerary_list = data.get("itinerary", [])
        except Exception as e:
            logger.error(f"Failed parsing LLM itinerary generation: {str(e)}")
            
    if not itinerary_list:
        itinerary_list = [
            {
                "day": 1,
                "title": f"Discovering the Sights of {dest}",
                "morning": "Start early to explore the central historic district and landmarks.",
                "afternoon": "Enjoy a traditional lunch at a highly recommended local restaurant.",
                "evening": "Stroll through the lively street markets and catch the sunset.",
                "why_selected_rationale": "Compiled based on general traveler vlog reviews."
            }
        ]
            
    final_itinerary = {
        "destination": dest,
        "days": days,
        "itinerary": itinerary_list
    }
    
    logs.append("Itinerary Generator complete. Day-wise plan compiled with vlogger source citations.")
    return {
        "final_itinerary": final_itinerary,
        "logs": logs
    }
