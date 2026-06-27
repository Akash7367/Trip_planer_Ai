import time
import logging
import json
from typing import Dict, Any

logger = logging.getLogger("app.observability")

class EnterpriseLogger:
    @staticmethod
    def log_agent_activity(agent_name: str, task: str, status: str, duration_ms: float, tokens: int = 0):
        log_payload = {
            "timestamp": time.time(),
            "level": "INFO",
            "module": "multi_agent",
            "agent_name": agent_name,
            "task": task,
            "status": status,
            "duration_ms": duration_ms,
            "tokens_consumed": tokens
        }
        logger.info(json.dumps(log_payload))

    @staticmethod
    def log_api_latency(endpoint: str, method: str, duration_ms: float, status_code: int):
        log_payload = {
            "timestamp": time.time(),
            "level": "INFO",
            "module": "api_gateway",
            "endpoint": endpoint,
            "method": method,
            "duration_ms": duration_ms,
            "status_code": status_code
        }
        if duration_ms > 1000:
            logger.warning(f"SLOW_API_ALERT: {json.dumps(log_payload)}")
        else:
            logger.info(json.dumps(log_payload))
