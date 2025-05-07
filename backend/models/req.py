from pydantic import BaseModel
from fastapi import FastAPI

class NaturalInput(BaseModel):
    query: str
