import logging
from typing import Callable, Dict, Any, Type
from pydantic import BaseModel

logger = logging.getLogger("mcp_server.registry")

class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Dict[str, Any]] = {}

    def register(self, name: str, description: str, schema: Type[BaseModel]):
        """
        Decorator to register a tool function.
        """
        def decorator(func: Callable):
            self.tools[name] = {
                "name": name,
                "description": description,
                "schema": schema,
                "handler": func
            }
            logger.info(f"Registered tool: {name}")
            return func
        return decorator

    def get_tool(self, name: str) -> Dict[str, Any]:
        return self.tools.get(name)

    def list_tools(self) -> list:
        return [
            {
                "name": info["name"],
                "description": info["description"],
                "inputSchema": info["schema"].model_json_schema()
            }
            for info in self.tools.values()
        ]

tool_registry = ToolRegistry()
