import asyncio
import logging
import sys
from mcp.server.stdio import stdio_server
from mcp_server.handlers.mcp_handlers import server

# Configure logging to stderr to keep stdout clear for stdio communication channel
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    stream=sys.stderr
)
logger = logging.getLogger("mcp_server")

async def main():
    logger.info("Starting Multi-Agent Trip Planner MCP Server...")
    try:
        async with stdio_server() as (read_stream, write_stream):
            await server.run(
                read_stream,
                write_stream,
                server.create_initialization_options()
            )
    except Exception as e:
        logger.critical(f"MCP Server crashed: {str(e)}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
