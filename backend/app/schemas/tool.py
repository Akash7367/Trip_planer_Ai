from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ToolMetadata(BaseModel):
    name: str = Field(..., description="Unique name of the tool")
    description: str = Field(..., description="Detailed description of what the tool does")
    input_schema: Dict[str, Any] = Field(..., description="JSON schema defining input arguments")
    output_schema: Dict[str, Any] = Field(..., description="JSON schema defining tool outputs")
    version: str = Field(default="1.0.0", description="Semantic version of the tool")

class ToolRegisterPayload(ToolMetadata):
    code: str = Field(..., description="Python source code containing a function named 'run' representing the tool handler")

class ToolExecutePayload(BaseModel):
    name: str = Field(..., description="Name of the tool to execute")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Key-value arguments for execution")
