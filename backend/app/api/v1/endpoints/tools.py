from fastapi import APIRouter, HTTPException, status
from typing import List

from app.core.registry import global_registry
from app.schemas.tool import ToolMetadata, ToolRegisterPayload, ToolExecutePayload

router = APIRouter()

@router.get("", response_model=List[ToolMetadata])
def list_tools():
    """
    List/discover all registered tools in the registry.
    """
    return global_registry.list_tools()

@router.get("/{name}", response_model=ToolMetadata)
def get_tool(name: str):
    """
    Retrieve metadata for a specific tool.
    """
    tool = global_registry.get_tool(name)
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with name '{name}' not found."
        )
    return tool

@router.post("", response_model=ToolMetadata, status_code=status.HTTP_201_CREATED)
def register_tool(payload: ToolRegisterPayload):
    """
    Dynamically register a new tool with its metadata and python code snippet.
    """
    try:
        metadata = global_registry.register_tool(
            name=payload.name,
            description=payload.description,
            input_schema=payload.input_schema,
            output_schema=payload.output_schema,
            version=payload.version,
            handler_or_code=payload.code
        )
        return metadata
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{name}", status_code=status.HTTP_204_NO_CONTENT)
def remove_tool(name: str):
    """
    Remove a tool from the registry.
    """
    removed = global_registry.remove_tool(name)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tool with name '{name}' not found."
        )
    return None

@router.post("/execute", response_model=dict)
def execute_tool(payload: ToolExecutePayload):
    """
    Execute a registered tool by name with arguments.
    """
    try:
        result = global_registry.execute_tool(payload.name, payload.arguments)
        return {
            "status": "success",
            "result": result
        }
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e).strip("'")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
