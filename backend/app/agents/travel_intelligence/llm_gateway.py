import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger("app.agents.travel_intelligence")

def call_travel_llm(prompt: str, response_schema: Optional[Any] = None) -> str:
    """
    Resilient LLM gateway — priority order:
    1. Gemini (generous free tier, fastest)
    2. Groq (rate limited fallback)
    3. OpenAI (final fallback)
    """
    errors = []

    has_gemini = bool(settings.GEMINI_API_KEY)
    has_groq = bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("gsk_"))
    has_openai = bool(settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("gsk_"))

    # Priority: Gemini → Groq → OpenAI
    queue = []
    if has_gemini:
        queue.append("gemini")
    if has_groq:
        queue.append("groq")
    if has_openai:
        queue.append("openai")
    if not queue:
        if settings.GEMINI_API_KEY:
            queue.append("gemini")
        elif settings.OPENAI_API_KEY:
            queue.append("openai")

    for mode in queue:
        if mode == "gemini":
            # Use stable, non-deprecated models only
            for model_name in ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"]:
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=settings.GEMINI_API_KEY)
                    model = genai.GenerativeModel(model_name)
                    if response_schema:
                        response = model.generate_content(
                            prompt,
                            generation_config=genai.GenerationConfig(
                                response_mime_type="application/json",
                                response_schema=response_schema
                            )
                        )
                    else:
                        response = model.generate_content(prompt)
                    logger.info(f"LLM call succeeded via Gemini ({model_name})")
                    return response.text.strip()
                except Exception as e:
                    err_msg = f"Gemini ({model_name}) error: {str(e)}"
                    logger.warning(err_msg)
                    errors.append(err_msg)

        elif mode == "groq":
            for model_name in ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]:
                try:
                    from openai import OpenAI
                    client = OpenAI(
                        api_key=settings.OPENAI_API_KEY,
                        base_url="https://api.groq.com/openai/v1"
                    )
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=2000
                    )
                    logger.info(f"LLM call succeeded via Groq ({model_name})")
                    return response.choices[0].message.content.strip()
                except Exception as e:
                    err_msg = f"Groq ({model_name}) error: {str(e)}"
                    logger.warning(err_msg)
                    errors.append(err_msg)

        elif mode == "openai":
            for model_name in ["gpt-4o-mini", "gpt-4o"]:
                try:
                    from openai import OpenAI
                    client = OpenAI(api_key=settings.OPENAI_API_KEY)
                    response = client.chat.completions.create(
                        model=model_name,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=2000
                    )
                    logger.info(f"LLM call succeeded via OpenAI ({model_name})")
                    return response.choices[0].message.content.strip()
                except Exception as e:
                    err_msg = f"OpenAI ({model_name}) error: {str(e)}"
                    logger.warning(err_msg)
                    errors.append(err_msg)

    logger.error(f"All LLM routing layers failed: {errors}")
    return ""
