import logging
from typing import Dict, Any, Callable, Union, List, Optional
from app.schemas.tool import ToolMetadata


logger = logging.getLogger("app.core.registry")

class ToolRegistry:
    def __init__(self):
        # Stores tool metadata and their executable handlers
        self._tools: Dict[str, Dict[str, Any]] = {}

    def register_tool(
        self,
        name: str,
        description: str,
        input_schema: Dict[str, Any],
        output_schema: Dict[str, Any],
        version: str = "1.0.0",
        handler_or_code: Union[Callable, str] = None
    ) -> ToolMetadata:
        """
        Register a new tool. Supports either a callable handler or a Python code string
        that defines a function 'run(**kwargs)'.
        """
        if not name or not name.isalnum() and "_" not in name:
            raise ValueError("Tool name must be alphanumeric (underscores allowed).")

        executable_handler = None

        if isinstance(handler_or_code, str):
            # Compile code string dynamically
            local_scope = {}
            try:
                # Compile and execute within local scope
                compiled_code = compile(handler_or_code, f"<dynamic_tool_{name}>", "exec")
                exec(compiled_code, {}, local_scope)
                
                # Retrieve the 'run' function
                if "run" not in local_scope or not callable(local_scope["run"]):
                    raise ValueError("Source code must define a callable function named 'run'")
                executable_handler = local_scope["run"]
            except Exception as e:
                logger.error(f"Failed to compile dynamic tool code for {name}: {str(e)}")
                raise ValueError(f"Code compilation failed: {str(e)}")
        elif callable(handler_or_code):
            executable_handler = handler_or_code
        else:
            raise ValueError("A valid callable handler or source code string must be provided.")

        metadata = ToolMetadata(
            name=name,
            description=description,
            input_schema=input_schema,
            output_schema=output_schema,
            version=version
        )

        self._tools[name] = {
            "metadata": metadata,
            "handler": executable_handler,
            "code": handler_or_code if isinstance(handler_or_code, str) else None
        }

        logger.info(f"Dynamically registered tool: {name} v{version}")
        return metadata

    def remove_tool(self, name: str) -> bool:
        """
        Remove a tool from the registry.
        """
        if name in self._tools:
            del self._tools[name]
            logger.info(f"Removed tool: {name}")
            return True
        return False

    def get_tool(self, name: str) -> Optional[ToolMetadata]:
        """
        Get metadata of a specific tool.
        """
        tool = self._tools.get(name)
        if tool:
            return tool["metadata"]
        return None

    def list_tools(self) -> List[ToolMetadata]:
        """
        List all registered tools (Discovery).
        """
        return [tool["metadata"] for tool in self._tools.values()]

    def execute_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """
        Execute a tool by name with arguments.
        """
        tool = self._tools.get(name)
        if not tool:
            raise KeyError(f"Tool '{name}' is not registered.")

        handler = tool["handler"]
        try:
            # Execute handler
            result = handler(**arguments)
            return result
        except Exception as e:
            logger.error(f"Error during execution of tool {name}: {str(e)}")
            raise RuntimeError(f"Tool execution failed: {str(e)}")

# Global registry instance
global_registry = ToolRegistry()
