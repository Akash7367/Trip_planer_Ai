import re
import json
import logging
from app.agents.travel_intelligence.state import TravelIntelligenceState
from app.agents.travel_intelligence.llm_gateway import call_travel_llm

logger = logging.getLogger("app.agents.travel_intelligence")

def planner_node(state: TravelIntelligenceState) -> dict:
    logs = list(state.get("logs", []))
    logs.append(f"Analyzing trip plan parameters for query: '{state['query']}'")
    
    prompt = (
        f"Extract the travel destination, target language, and interests from this user query: '{state['query']}'.\n"
        f"Return ONLY a JSON block with keys: 'destination' (string), 'language' (string, e.g. Hindi, English, Spanish), 'interests' (list of strings).\n"
        f"Do not include markdown or backticks."
    )
    
    dest = "Rajasthan"
    lang = "English"
    interests = []
    
    llm_res = call_travel_llm(prompt)
    if llm_res:
        try:
            cleaned = re.sub(r'```json|```', '', llm_res).strip()
            data = json.loads(cleaned)
            dest = data.get("destination", "Rajasthan")
            lang = data.get("language", "English")
            interests = data.get("interests", [])
        except Exception as e:
            logger.error(f"Failed parsing LLM planner response: {str(e)}")
            
    logs.append(f"Planner extracted Destination: {dest}, Target Language: {lang}, Interests: {interests}")
    return {
        "destination": dest,
        "language": lang,
        "interests": interests,
        "logs": logs
    }
