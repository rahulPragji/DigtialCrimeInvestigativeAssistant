from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
import logging
from pydantic import BaseModel

from services import embedding

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/refresh-embeddings", tags=["embeddings"])

# Response model
class EmbeddingJobResponse(BaseModel):
    message: str
    job_started: bool
    nodes_to_process: int = 0

async def refresh_embeddings_job():
    """
    Background job to refresh embeddings for nodes that don't have them.
    This runs asynchronously after the API request returns.
    """
    try:
        # Get nodes that need embeddings
        nodes = embedding.get_nodes_without_embeddings()
        
        if not nodes:
            logger.info("No nodes found that need embeddings")
            return
        
        logger.info(f"Starting embedding refresh for {len(nodes)} nodes")
        
        # Process each node
        for node in nodes:
            node_id = node.get("nodeId")
            text = node.get("text")
            
            if not text:
                logger.warning(f"Node {node_id} has no text for embedding, skipping")
                continue
                
            # Generate embedding for the node
            embedding_vector = embedding.generate_embedding(text)
            
            if not embedding_vector:
                logger.error(f"Failed to generate embedding for node {node_id}")
                continue
                
            # Update the node with the embedding
            success = embedding.update_node_embedding(node_id, embedding_vector)
            
            if not success:
                logger.error(f"Failed to update embedding for node {node_id}")
        
        # Ensure vector index exists after updating embeddings
        embedding.ensure_vector_index_exists()
        
        logger.info("Embedding refresh job completed")
        
    except Exception as e:
        logger.error(f"Error in embedding refresh job: {str(e)}")

@router.post("/", response_model=EmbeddingJobResponse)
async def refresh_embeddings(background_tasks: BackgroundTasks):
    """
    Trigger a job to refresh embeddings for nodes in the database.
    The job runs in the background after the request returns.
    
    Returns:
        EmbeddingJobResponse: Status of the job request
        
    Raises:
        HTTPException: If there's an error starting the job
    """
    try:
        # Count nodes that need embeddings
        nodes = embedding.get_nodes_without_embeddings()
        count = len(nodes)
        
        # Add the job to background tasks
        background_tasks.add_task(refresh_embeddings_job)
        
        # Prepare response
        return EmbeddingJobResponse(
            message=f"Embedding refresh job started for {count} nodes",
            job_started=True,
            nodes_to_process=count
        )
        
    except Exception as e:
        error_message = f"Failed to start embedding refresh job: {str(e)}"
        logger.error(error_message)
        raise HTTPException(
            status_code=500,
            detail=error_message
        )
