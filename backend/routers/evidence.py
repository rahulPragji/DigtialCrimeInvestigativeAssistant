from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Optional
from pydantic import BaseModel
import logging

from services.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/evidence", tags=["evidence"])

# Define response model for evidence items
class EvidenceItem(BaseModel):
    name: str
    significance: str
    locations: List[str]

@router.get("/{subtype}", response_model=List[EvidenceItem])
async def get_evidence_by_subtype(
    subtype: str,
    device: str = Query(..., description="Device type (android or windows)")
):
    """
    Get evidence items for a specific crime subtype and device type.
    
    Args:
        subtype (str): The crime subtype name
        device (str): The device type (android or windows)
        
    Returns:
        List[EvidenceItem]: A list of evidence items with their details
        
    Raises:
        HTTPException: If the parameters are invalid or the database query fails
    """
    # Validate device parameter
    if device.lower() not in ["android", "windows"]:
        raise HTTPException(
            status_code=400,
            detail="Device type must be either 'android' or 'windows'"
        )
    
    try:
        # Get database connection
        db = get_db()
        
        # Determine the relationship type based on device
        relationship_type = f"POSSIBLE_LOCATION_ON_{device.upper()}"
        
        # Log the query parameters for debugging
        logger.info(f"Fetching evidence for subtype: {subtype}, device: {device}, relationship: {relationship_type}")
        
        # Let's find all available CrimeSubtypes first to debug
        all_subtypes_query = """
        MATCH (s:CrimeSubtype)
        RETURN s.name as name
        """
        all_subtypes = db.execute_query(all_subtypes_query)
        subtype_names = [record.get("name") for record in all_subtypes]
        logger.info(f"Available CrimeSubtypes in database: {subtype_names}")
        
        # Now check if the requested CrimeSubtype exists
        check_query = """
        MATCH (s:CrimeSubtype {name: $subtype})
        RETURN count(s) as count
        """
        
        check_result = db.execute_query(check_query, {"subtype": subtype})
        subtype_count = check_result[0].get("count", 0) if check_result else 0
        
        logger.info(f"Found {subtype_count} CrimeSubtype nodes with exact name: '{subtype}'")
        
        if subtype_count == 0:
            # Try a case-insensitive match as a fallback
            case_insensitive_query = """
            MATCH (s:CrimeSubtype)
            WHERE toLower(s.name) = toLower($subtype)
            RETURN s.name as name
            """
            case_results = db.execute_query(case_insensitive_query, {"subtype": subtype})
            
            if case_results and len(case_results) > 0:
                # Found a case-insensitive match
                actual_name = case_results[0].get("name")
                logger.info(f"Found case-insensitive match: '{actual_name}' for query: '{subtype}'")
                subtype = actual_name  # Use the actual name for further queries
            else:
                # If no CrimeSubtype found, return empty array
                logger.warning(f"No CrimeSubtype found with name: '{subtype}'")
                return []
            
        # Let's modify the query to be more like what the user has shown to work
        # This approach is more flexible and will better match their database structure
        query = """
        // First find the CrimeSubtype and connected EvidenceItems
        MATCH (s:CrimeSubtype {name: $subtype})-[:HAS_EVIDENCE]->(e:EvidenceItem)
        
        // Then find possible locations based on device type
        OPTIONAL MATCH (e)-[r]->(p:PossibleLocation)
        WHERE type(r) = $relationship_type
        
        // Group by evidence item to collect all locations
        WITH e, collect(p.path) AS locations
        RETURN e.name AS name, e.significance AS significance, locations
        """
        
        results = db.execute_query(query, {
            "subtype": subtype,
            "relationship_type": relationship_type
        })
        
        # Transform database results into response objects
        evidence_items = []
        for result in results:
            name = result.get("name", "Unknown")
            significance = result.get("significance", "")
            locations = result.get("locations", [])
            
            # Log each evidence item for debugging
            logger.info(f"Evidence item: {name}, Significance: {significance[:30]}..., Locations: {locations}")
            
            evidence_items.append(EvidenceItem(
                name=name,
                significance=significance,
                locations=locations
            ))
        
        if not evidence_items:
            logger.warning(f"No evidence items found for subtype '{subtype}' on {device}")
            # Return a dummy item for testing if nothing found
            evidence_items.append(EvidenceItem(
                name="Sample Evidence (No actual data found)",
                significance="This is a sample evidence item because no actual data was found in the database for your query.",
                locations=[f"Example location on {device}"]
            ))
        
        logger.info(f"Returning {len(evidence_items)} evidence items for subtype '{subtype}' on {device}")
        return evidence_items
        
    except Exception as e:
        error_message = f"Failed to retrieve evidence items: {str(e)}"
        logger.error(error_message)
        raise HTTPException(
            status_code=500,
            detail=error_message
        )
