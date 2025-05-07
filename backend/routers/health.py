## Health check endpoints for the DCIA API.
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
import requests

from services.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/health", tags=["health"])

# Ollama embedding service URL from the embedding service
OLLAMA_EMBEDDING_URL = "http://localhost:11434/api/embeddings"

@router.get("/")
async def health_check() -> Dict[str, Any]:
    """
    Check if the API and dependent services are running correctly.
    
    Returns:
        A dictionary with status information
        
    Raises:
        HTTPException: If any of the dependent services are not available
    """
    # Check Neo4j database connection
    db_status = True
    ollama_status = True
    errors = []
    
    try:
        # Simple query to check database connection
        db = get_db()
        db.execute_query("RETURN 1 as n")
    except Exception as e:
        db_status = False
        error_message = f"Neo4j database error: {str(e)}"
        logger.error(f"Neo4j database is not available: {str(e)}")
        errors.append(error_message)
    
    # Check Ollama embedding service
    try:
        # Simple request to check if Ollama is running
        payload = {
            "model": "all-minilm",
            "prompt": "health check"  # Just a simple text to generate embeddings for
        }
        
        # Set a reasonable timeout to avoid long waits if the service is down
        response = requests.post(OLLAMA_EMBEDDING_URL, json=payload, timeout=5)
        response.raise_for_status()
        
        # Verify response contains embeddings
        embedding_data = response.json()
        if not embedding_data.get("embedding"):
            ollama_status = False
            error_message = "Ollama service returned an invalid response format"
            logger.error(error_message)
            errors.append(error_message)
            
    except requests.exceptions.RequestException as e:
        ollama_status = False
        error_message = f"Ollama embedding service error: {str(e)}"
        logger.error(f"Ollama service is not available: {str(e)}")
        errors.append(error_message)
    
    # Check overall health status
    if not db_status or not ollama_status:
        status_details = {
            "neo4j_status": "healthy" if db_status else "unhealthy",
            "ollama_status": "healthy" if ollama_status else "unhealthy",
            "errors": errors
        }
        
        raise HTTPException(
            status_code=503,
            detail=f"One or more services are not available: {status_details}"
        )
    
    # All services are available
    logger.info("All services are running correctly.")
    return {
        "status": "healthy",
        "message": "All services are running correctly.",
        "neo4j_status": "healthy",
        "ollama_status": "healthy"
    }
