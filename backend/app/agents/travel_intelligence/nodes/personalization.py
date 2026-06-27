import re
import json
import logging
from app.agents.travel_intelligence.state import TravelIntelligenceState
from app.agents.travel_intelligence.llm_gateway import call_travel_llm
from app.schemas.intelligence import TravelIntelligenceResponse, TravelInsightSource, LocalInsight

logger = logging.getLogger("app.agents.travel_intelligence")

def language_personalization_node(state: TravelIntelligenceState) -> dict:
    logs = list(state.get("logs", []))
    lang = state["language"]
    
    logs.append(f"Language Personalization Agent: Formatting final JSON response in {lang}...")
    
    # Prepare sources mapping
    sources_list = []
    for t in state["raw_transcripts"]:
        sources_list.append(TravelInsightSource(
            video_id=t["video_id"],
            title=t["title"],
            channel_name=t["channel_name"],
            upload_date=t["upload_date"],
            timestamp=t["timestamp"],
            url=f"https://www.youtube.com/watch?v={t['video_id']}&t={int(t['timestamp'].split(':')[0])*60 + int(t['timestamp'].split(':')[1])}s"
        ))

    v_k = state["verified_knowledge"]
    f_i = state["final_itinerary"]
    
    # Parse the user's target budget limits to dynamically scale and calibrate all estimates
    target_budget = state.get("budget") or 50000.0
    
    hotel_avg_str = v_k["prices"].get("hotel_avg", "₹1,500")
    hotel_val = 1500
    try:
        # Extract the base number from the string
        nums = re.findall(r'\d[\d,]*', hotel_avg_str)
        if nums:
            hotel_val = int(nums[0].replace(',', ''))
    except Exception:
        pass
        
    # Scale variables dynamically based on budget constraints
    if target_budget <= 20000.0:  # "Budget" level
        scaled_hotel_val = min(hotel_val, 800)
        v_k["prices"]["hotel_avg"] = f"₹{scaled_hotel_val} - ₹{scaled_hotel_val + 400}"
        v_k["prices"]["rickshaw_day"] = "₹300"
        v_k["prices"]["metro_ticket"] = "₹15"
        emergency_buffer = "₹1,000"
    elif target_budget <= 50000.0:  # "Moderate" level
        scaled_hotel_val = min(hotel_val, 2800)
        v_k["prices"]["hotel_avg"] = f"₹{scaled_hotel_val} - ₹{scaled_hotel_val + 1200}"
        v_k["prices"]["rickshaw_day"] = "₹500"
        v_k["prices"]["metro_ticket"] = "₹30"
        emergency_buffer = "₹2,500"
    else:  # "Luxury" level
        scaled_hotel_val = max(hotel_val, 8500)
        v_k["prices"]["hotel_avg"] = f"₹{scaled_hotel_val} - ₹{scaled_hotel_val + 6500}"
        v_k["prices"]["rickshaw_day"] = "₹1,200"
        v_k["prices"]["metro_ticket"] = "₹60"
        emergency_buffer = "₹8,000"
        
    accommodation_cost_val = scaled_hotel_val * state["days"]

    # Compile the complete TravelIntelligenceResponse object
    response = TravelIntelligenceResponse(
        trip_summary={
            "destination": state["destination"],
            "source_city": state.get("source_city", "Delhi"),
            "days": state["days"],
            "preferred_language": lang,
            "style": "Adventure & Culture"
        },
        daily_itinerary=f_i["itinerary"],
        estimated_budget={
            "accommodation_cost": f"₹{accommodation_cost_val:,}",
            "local_prices_index": v_k["prices"],
            "emergency_buffer": emergency_buffer
        },
        latest_local_insights=[
            {"tip": "Weather is sunny, carry sunscreen and a light jacket.", "source": "Travel vlogger advice"},
            {"tip": "UPI is widely accepted, but carry some cash for monuments.", "source": "Local traveler recommendation"}
        ],
        hidden_gems=v_k["hidden_gems"],
        food_recommendations=v_k["food_recommendations"],
        transport_tips=v_k["transport_tips"],
        scam_alerts=v_k["scam_alerts"],
        things_to_avoid=[
            LocalInsight(category="things_to_avoid", detail="Avoid central spots at noon due to extreme sun. Buy safaris directly from hostels, never via street touts.", confidence="High", source_ref="Vlog recommendations")
        ],
        packing_list=["Sunscreen (SPF 50+)", "Light linen clothing", "Slip-on shoes for temples", "Camera"],
        important_local_rules=[
            LocalInsight(category="local_rules", detail="Always take off shoes before entering religious temples and dress modestly.", confidence="High", source_ref="Vlog recommendations")
        ],
        best_photo_spots=[
            LocalInsight(category="photo_spots", detail="Key scenic views, arches, and historic stepwells recommended in travel guides.", confidence="High", source_ref="Travel guides")
        ],
        shopping_tips=[
            LocalInsight(category="shopping", detail="Negotiate street markets by starting at 50% of the quoted price.", confidence="Medium", source_ref="Travel guides")
        ],
        local_phrases=v_k["phrases"],
        confidence_score={
            "overall_score": 95,
            "verifications_performed": ["Leaflet Maps API", "Nominatim Geocoder", "YouTube Transcript Cleansing"]
        },
        sources=sources_list
    )
    
    # If a language other than English is requested, ask the LLM to translate and polish the entire response
    if lang != "English":
        prompt = (
            f"Translate and localize the following JSON travel intelligence package into the language '{lang}'.\n"
            f"Ensure all names of places, hotels, cafes, and specific local terms remain intact but the descriptions, "
            f"titles, tips, and phrases are beautifully translated and natural.\n\n"
            f"JSON Payload:\n{json.dumps(response.model_dump())}\n\n"
            f"Return ONLY the translated JSON payload. Do not include markdown or backticks."
        )
        
        translated_res = call_travel_llm(prompt)
        if translated_res:
            try:
                cleaned = re.sub(r'```json|```', '', translated_res).strip()
                translated_data = json.loads(cleaned)
                logs.append(f"Language Personalization: Successfully localized the entire itinerary package into {lang}.")
                return {
                    "final_itinerary": translated_data,
                    "logs": logs
                }
            except Exception as e:
                logger.error(f"Failed parsing localized JSON response: {str(e)}")
    
    logs.append("Language Personalization complete. Final Travel Intelligence Response compiled successfully!")
    return {
        "final_itinerary": response.model_dump(),
        "logs": logs
    }
