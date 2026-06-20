import json
import logging
from typing import List
from app.core.config import settings
from app.schemas.recommendation import RecommendationInput, DestinationRecommendation, RecommendationList

logger = logging.getLogger("app.agents.recommendation")

def get_recommendations(inputs: RecommendationInput) -> List[DestinationRecommendation]:
    """
    Get top ranked destination recommendations with match scores and reasoning.
    Uses LLM structured output if key is present; otherwise, falls back to a custom rule-based engine.
    """
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"Recommend destinations based on these preferences: {inputs.model_dump_json()}"
            
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=RecommendationList
                )
            )
            data = json.loads(response.text)
            return [DestinationRecommendation(**r) for r in data.get("recommendations", [])]
        except Exception as e:
            logger.error(f"Gemini recommendations failed, falling back: {str(e)}")

    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            prompt = f"Recommend destinations based on these preferences: {inputs.model_dump_json()}"
            
            response = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                response_format=RecommendationList
            )
            return response.choices[0].message.parsed.recommendations
        except Exception as e:
            logger.error(f"OpenAI recommendations failed, falling back: {str(e)}")

    # Heuristics/rule-based scoring fallback
    logger.info("Executing rule-based destination recommendations.")
    return rule_based_recommend(inputs)


def rule_based_recommend(inputs: RecommendationInput) -> List[DestinationRecommendation]:
    """
    Scoring engine that rates built-in destinations and returns explanations.
    """
    # Destination Database
    destinations_db = [
        {
            "name": "Goa",
            "interests": ["beach", "food", "nightlife", "relaxing"],
            "min_budget": 15000.0,
            "max_budget": 80000.0,
            "seasons": ["winter", "monsoon", "summer"],
            "travelers": ["friends", "couple", "solo"],
            "base_reason": "Excellent coastal beaches, local seafood, and vibrant nightlife perfect for group trips."
        },
        {
            "name": "Paris",
            "interests": ["culture", "food", "shopping", "art", "museums"],
            "min_budget": 60000.0,
            "max_budget": 500000.0,
            "seasons": ["spring", "summer", "autumn"],
            "travelers": ["couple", "solo", "family"],
            "base_reason": "World-class cultural heritage, historical architecture, gourmet dining, and romantic atmosphere."
        },
        {
            "name": "Kyoto",
            "interests": ["culture", "nature", "history", "temples", "relaxing"],
            "min_budget": 45000.0,
            "max_budget": 350000.0,
            "seasons": ["spring", "autumn", "winter"],
            "travelers": ["solo", "couple", "family"],
            "base_reason": "Traditional wooden temples, shrines, cherry blossom gardens, and peaceful atmosphere."
        },
        {
            "name": "Hawaii",
            "interests": ["beach", "nature", "adventure", "relaxing"],
            "min_budget": 80000.0,
            "max_budget": 600000.0,
            "seasons": ["summer", "winter", "spring"],
            "travelers": ["couple", "family", "friends"],
            "base_reason": "Incredible tropical volcanic landscapes, world-class surfing, beaches, and luxury resorts."
        },
        {
            "name": "London",
            "interests": ["culture", "history", "shopping", "museums", "city"],
            "min_budget": 50000.0,
            "max_budget": 400000.0,
            "seasons": ["summer", "spring", "winter"],
            "travelers": ["family", "solo", "friends"],
            "base_reason": "Rich royal history, massive public parks, iconic museums, and excellent transport networks."
        }
    ]

    results = []

    user_interests = [i.lower() for i in inputs.interests]
    user_budget = inputs.budget
    user_season = inputs.season.lower() if inputs.season else None
    user_traveler = inputs.traveler_type.lower() if inputs.traveler_type else None

    for dest in destinations_db:
        score = 40  # base starting score
        matching_interests = []

        # 1. Evaluate Interests (up to 40 points)
        if user_interests:
            matches = [i for i in user_interests if i in dest["interests"]]
            matching_interests = matches
            if matches:
                interest_score = int((len(matches) / len(user_interests)) * 40)
                score += interest_score

        # 2. Evaluate Budget (up to 30 points)
        if user_budget is not None:
            # If user budget is within destination range, add 30 points
            if dest["min_budget"] <= user_budget <= dest["max_budget"]:
                score += 30
            elif user_budget > dest["max_budget"]:
                score += 20  # fully affordable but maybe too cheap/simple
            else:
                # Under budget: subtract penalty based on gap
                penalty = int(((dest["min_budget"] - user_budget) / dest["min_budget"]) * 30)
                score += max(0, 30 - penalty)
        else:
            score += 20  # default budget score if unspecified

        # 3. Evaluate Season (up to 10 points)
        if user_season:
            if user_season in dest["seasons"]:
                score += 10
            else:
                score += 2

        # 4. Evaluate Traveler type (up to 10 points)
        if user_traveler:
            if user_traveler in dest["travelers"]:
                score += 10
            else:
                score += 3

        # Cap score at 99
        final_score = min(max(score, 10), 99)

        # Build personalized reason
        reason = dest["base_reason"]
        if matching_interests:
            reason = f"Ideal match for your interest in {', '.join(matching_interests)}. {reason}"
        if user_budget:
            reason += f" Well within your specified budget."

        results.append(
            DestinationRecommendation(
                destination=dest["name"],
                score=final_score,
                reason=reason
            )
        )

    # Sort by score descending
    results.sort(key=lambda x: x.score, reverse=True)
    return results
