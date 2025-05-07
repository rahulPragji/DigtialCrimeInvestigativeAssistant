from fastapi import Response
from pydantic import BaseModel

class NaturalOutput(BaseModel):
    response: str