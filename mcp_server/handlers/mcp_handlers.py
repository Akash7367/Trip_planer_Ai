import logging
import json
from mcp.server import Server
import mcp.types as types

from mcp_server.registry.tool_registry import tool_registry
# Import tools to ensure they decorate register
import mcp_server.tools 

logger = logging.getLogger("mcp_server.handlers")

server = Server("trip-planner-mcp-server")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """
    List all available MCP tools in the registry.
    """
    logger.info("Listing tools requested by client")
    tools_list = []
    
    for tool_name, info in tool_registry.tools.items():
        # Get json schema properties
        json_schema = info["schema"].model_json_schema()
        
        tools_list.append(
            types.Tool(
                name=info["name"],
                description=info["description"],
                inputSchema=json_schema
            )
        )
    return tools_list

@server.call_tool()
async def handle_call_tool(
    name: str,
    arguments: dict | None
) -> list[types.TextContent]:
    """
    Execute a registered tool based on its name and arguments.
    """
    logger.info(f"Execution requested for tool: {name}")
    tool = tool_registry.get_tool(name)
    if not tool:
        raise ValueError(f"Tool not found: {name}")

    if arguments is None:
        arguments = {}

    try:
        # Validate arguments using the Pydantic schema
        validated_args = tool["schema"](**arguments)
        
        # Execute the tool function
        result = tool["handler"](**validated_args.model_dump())
        
        return [
            types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )
        ]
    except Exception as e:
        logger.error(f"Error executing tool {name}: {str(e)}")
        return [
            types.TextContent(
                type="text",
                text=json.dumps({
                    "status": "error",
                    "message": str(e)
                }, indent=2)
            )
        ]
