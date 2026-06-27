import json
import logging
from typing import Type, TypeVar
from pydantic import BaseModel
from openai import OpenAI
from app.core.config import settings

logger = logging.getLogger("app.core.llm")

T = TypeVar("T", bound=BaseModel)

def get_openai_client() -> OpenAI:
    if settings.IS_GROQ:
        return OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
    return OpenAI(api_key=settings.OPENAI_API_KEY)

def get_model_name() -> str:
    if settings.IS_GROQ:
        return "llama-3.3-70b-versatile"
    return "gpt-4o-mini"

def generate_structured_output(prompt: str, response_schema: Type[T]) -> T:
    client = get_openai_client()
    model = get_model_name()
    
    if settings.IS_GROQ:
        # Groq doesn't support beta.chat.completions.parse, so use JSON mode
        # with a system prompt specifying the schema.
        schema_json = json.dumps(response_schema.model_json_schema())
        system_prompt = (
            f"You are a helpful travel assistant. You must output JSON that strictly adheres to the following JSON schema:\n"
            f"{schema_json}\n"
            f"Ensure the JSON returned is valid and conforms exactly to the schema fields."
        )
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return response_schema.model_validate(data)
    else:
        # Standard OpenAI structured outputs
        response = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            response_format=response_schema
        )
        return response.choices[0].message.parsed
