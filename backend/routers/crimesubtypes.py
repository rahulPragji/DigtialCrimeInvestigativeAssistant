from fastapi import APIRouter, HTTPException
from typing import List
import logging

from services.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/crimesubtypes", tags=["crimesubtypes"])

@router.get("/", response_model=List[str])
async def get_crime_subtypes():
    """
    Get all crime subtypes from the Neo4j database.
    
    Returns:
        List[str]: A list of crime subtype names
        
    Raises:
        HTTPException: If the database query fails
    """
    try:
        # Get database connection
        db = get_db()
        
        # Query to get all crime subtypes
        query = """
        MATCH (n:CrimeSubtype)
        RETURN n.name AS name
        ORDER BY name
        """
        
        results = db.execute_query(query)
        
        # Extract just the name from each result
        crime_subtypes = [result.get("name") for result in results]
        
        logger.info(f"Retrieved {len(crime_subtypes)} crime subtypes")
        return crime_subtypes
        
    except Exception as e:
        error_message = f"Failed to retrieve crime subtypes: {str(e)}"
        logger.error(error_message)
        raise HTTPException(
            status_code=500,
            detail=error_message
        )
