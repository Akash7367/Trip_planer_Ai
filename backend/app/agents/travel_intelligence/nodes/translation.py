import logging
from app.agents.travel_intelligence.state import TravelIntelligenceState
from app.agents.travel_intelligence.llm_gateway import call_travel_llm

logger = logging.getLogger("app.agents.travel_intelligence")

def translation_node(state: TravelIntelligenceState) -> dict:
    logs = list(state.get("logs", []))
    lang = state["language"]
    transcripts = state["raw_transcripts"]
    
    translated_transcripts = []
    
    if lang == "English":
        logs.append("Translation Agent: Target language is English. No translation needed.")
        translated_transcripts = transcripts
    else:
        logs.append(f"Translation Agent: Translating transcripts of {len(transcripts)} vlogs into {lang}...")
        for t in transcripts:
            prompt = (
                f"Translate the following travel vlog transcript into {lang}. Retain all names of places, hotels, "
                f"prices, and specific local terms exactly. Return ONLY the translated text:\n\n{t['transcript_text']}"
            )
            translated_text = call_travel_llm(prompt)
            if not translated_text:
                translated_text = f"[Translated to {lang}]: {t['transcript_text']}"
            
            translated_transcripts.append({
                **t,
                "transcript_text": translated_text
            })
            
    return {
        "translated_transcripts": translated_transcripts,
        "logs": logs
    }
