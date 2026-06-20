import json
import logging
from typing import List
from app.core.config import settings
from app.schemas.transport import TransportRequest, TransportOption, TransportResponse

logger = logging.getLogger("app.agents.transport")

def plan_transport(req: TransportRequest) -> List[TransportOption]:
    """
    Formulate transit suggestions based on route.
    Uses LLMs if API keys are set; otherwise, uses local rule-based matching.
    """
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"Plan transport routes for: {req.model_dump_json()}"
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=TransportResponse
                )
            )
            data = json.loads(response.text)
            return [TransportOption(**opt) for opt in data.get("options", [])]
        except Exception as e:
            logger.error(f"Gemini transport planning failed, falling back: {str(e)}")

    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            prompt = f"Plan transport routes for: {req.model_dump_json()}"
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                response_format=TransportResponse
            )
            return response.choices[0].message.parsed.options
        except Exception as e:
            logger.error(f"OpenAI transport planning failed, falling back: {str(e)}")

    # Heuristic fallback matching
    logger.info("Executing rule-based transport suggestions.")
    return rule_based_plan(req)


def rule_based_plan(req: TransportRequest) -> List[TransportOption]:
    """
    Generates transit alternatives based on source and destination matching.
    """
    source = req.source_city.lower()
    dest = req.destination.lower()

    # Route definitions
    # Mumbai -> Goa (or similar domestic route)
    if ("mumbai" in source and "goa" in dest) or ("goa" in source and "mumbai" in dest):
        return [
            TransportOption(mode="Flight", cost=4500.0, duration="1h 15m", convenience_score=92),
            TransportOption(mode="Train", cost=2500.0, duration="8h", convenience_score=85),
            TransportOption(mode="Bus", cost=1200.0, duration="14h", convenience_score=55),
            TransportOption(mode="Local", cost=150.0, duration="1h", convenience_score=70)
        ]
    # Tokyo -> Kyoto (Shinkansen route)
    elif ("tokyo" in source and "kyoto" in dest) or ("kyoto" in source and "tokyo" in dest):
        return [
            TransportOption(mode="Train", cost=14000.0, duration="2h 15m", convenience_score=98), # Bullet train
            TransportOption(mode="Flight", cost=12000.0, duration="1h 10m", convenience_score=80), # Flight requires transfers
            TransportOption(mode="Bus", cost=5000.0, duration="8h", convenience_score=60),
            TransportOption(mode="Local", cost=400.0, duration="45m", convenience_score=85)
        ]
    # Default route fallback generator
    else:
        # Distance heuristic
        return [
            TransportOption(mode="Flight", cost=8500.0, duration="2h 30m", convenience_score=90),
            TransportOption(mode="Train", cost=3200.0, duration="12h", convenience_score=78),
            TransportOption(mode="Bus", cost=1800.0, duration="18h", convenience_score=45),
            TransportOption(mode="Local", cost=200.0, duration="1h 15m", convenience_score=75)
        ]
