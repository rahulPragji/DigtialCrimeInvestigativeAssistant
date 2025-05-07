## Health check endpoints for the DCIA API.
from fastapi import APIRouter, HTTPException
from typing import Dict
import logging

from services.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check() -> Dict[str, str]:
    """
    Check if the API and dependent services are running correctly.
    
    Returns:
        A dictionary with status information
        
    Raises:
        HTTPException: If any of the dependent services are not available
    """
    # Check Neo4j database connection
    db_status = True
    
    try:
        # Simple query to check database connection
        db = get_db()
        db.execute_query("RETURN 1 as n")
    except Exception as e:
        db_status = False
        error_message = f"Neo4j database error: {str(e)}"
        logger.error(f"Neo4j database is not available: {str(e)}")
        
        # Database is not available, but API is running
        raise HTTPException(
            status_code=503,
            detail="API is running, but the Neo4j database is not available."
        )
    
    # All services are available
    logger.info("All services are running correctly.")
    return {
        "status": "healthy",
        "message": "All services are running correctly."
    }
