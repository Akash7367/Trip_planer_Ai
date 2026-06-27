import math
import hashlib
import logging
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.memory import UserMemory
from app.schemas.memory import UserMemoryResponse, MemorySearchResult

logger = logging.getLogger("app.agents.memory")

def get_mock_embedding(text: str) -> List[float]:
    """
    Produces a deterministic 128-dimensional unit vector mock embedding
    representing a bag-of-words using word hashes.
    """
    words = set(text.lower().split())
    vec = [0.01] * 128
    for word in words:
        # Clean word from punctuation
        w = "".join(c for c in word if c.isalnum())
        if not w:
            continue
        for offset in range(3):
            h = hashlib.md5(f"{w}:{offset}".encode()).hexdigest()
            dim = int(h, 16) % 128
            vec[dim] += 1.0
            
    # Normalize to unit vector
    mag = math.sqrt(sum(v**2 for v in vec))
    if mag == 0:
        return [0.0] * 128
    return [v / mag for v in vec]

def get_embedding(text: str) -> List[float]:
    """
    Compute text embedding vector.
    Tries Gemini or OpenAI first, falling back to deterministic mock vectors.
    """
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            response = genai.embed_content(
                model="models/text-embedding-004",
                content=text
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Gemini embedding generation failed: {str(e)}")

    if settings.OPENAI_API_KEY and not settings.IS_GROQ:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.embeddings.create(
                input=[text],
                model="text-embedding-3-small"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"OpenAI embedding generation failed: {str(e)}")

    return get_mock_embedding(text)

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """
    Calculate the cosine similarity between two float vectors.
    """
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)

def add_user_memory(db: Session, user_id: int, category: str, content: str) -> UserMemory:
    """
    Generate embedding vector for content and save memory record to DB.
    """
    embedding = get_embedding(content)
    db_mem = UserMemory(
        user_id=user_id,
        category=category,
        content=content,
        embedding=embedding
    )
    db.add(db_mem)
    db.commit()
    db.refresh(db_mem)
    return db_mem

def search_user_memory(
    db: Session,
    user_id: int,
    query_text: str,
    category: Optional[str] = None,
    limit: int = 5
) -> List[MemorySearchResult]:
    """
    Perform semantic search over user memory entries using cosine similarity.
    """
    query_vector = get_embedding(query_text)
    
    # Fetch candidate user memory rows from postgres
    q = db.query(UserMemory).filter(UserMemory.user_id == user_id)
    if category:
        q = q.filter(UserMemory.category == category)
        
    memories = q.all()
    results = []
    
    for mem in memories:
        if not mem.embedding:
            continue
        # Compute cosine similarity between query and saved memories
        score = cosine_similarity(query_vector, mem.embedding)
        
        results.append(
            MemorySearchResult(
                memory=UserMemoryResponse.model_validate(mem),
                score=float(score)
            )
        )
        
    # Sort descending by score
    results.sort(key=lambda x: x.score, reverse=True)
    return results[:limit]
