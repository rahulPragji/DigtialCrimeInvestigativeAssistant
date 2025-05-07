import requests
import logging
import os
from typing import List, Dict, Any, Tuple, Optional
from services.db import get_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ollama embedding service URL
OLLAMA_EMBEDDING_URL = "http://localhost:11434/api/embeddings"
VECTOR_DIMENSIONS = 384  # Dimensions for all-minilm model

def generate_embedding(text: str) -> Optional[List[float]]:
    """
    Generate an embedding vector for the given text using Ollama.
    
    Args:
        text (str): The text to generate embedding for
        
    Returns:
        Optional[List[float]]: The embedding vector or None if generation failed
    """
    try:
        # Prepare the request payload
        payload = {
            "model": "all-minilm",
            "prompt": text
        }
        
        # Send request to Ollama
        response = requests.post(OLLAMA_EMBEDDING_URL, json=payload)
        response.raise_for_status()  # Raise exception for non-200 responses
        
        # Extract embedding from response
        embedding_data = response.json()
        embedding = embedding_data.get("embedding")
        
        if not embedding:
            logger.error(f"No embedding returned for text: {text[:50]}...")
            return None
            
        logger.info(f"Generated embedding for text: {text[:50]}... (vector dim: {len(embedding)})")
        return embedding
        
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        return None

def get_nodes_without_embeddings() -> List[Dict[str, Any]]:
    """
    Query Neo4j for nodes that don't have embeddings yet.
    
    Returns:
        List[Dict]: List of node data with ID and text for embedding
    """
    try:
        db = get_db()
        
        # Query for nodes without embeddings
        query = """
        MATCH (n)
        WHERE NOT EXISTS(n.embedding)
          AND (n:EvidenceItem OR n:CrimeSubtype)
          AND EXISTS(n.description)
        RETURN id(n) AS nodeId, n.description AS text
        """
        
        results = db.execute_query(query)
        logger.info(f"Found {len(results)} nodes without embeddings")
        return results
        
    except Exception as e:
        logger.error(f"Error querying nodes without embeddings: {str(e)}")
        return []

def update_node_embedding(node_id: int, embedding: List[float]) -> bool:
    """
    Update a Neo4j node with its embedding vector.
    
    Args:
        node_id (int): The Neo4j node ID
        embedding (List[float]): The embedding vector
        
    Returns:
        bool: True if update successful, False otherwise
    """
    try:
        db = get_db()
        
        # Update node with embedding
        query = """
        MATCH (n)
        WHERE id(n) = $nodeId
        SET n.embedding = $embedding
        RETURN n
        """
        
        result = db.execute_query(query, {
            "nodeId": node_id,
            "embedding": embedding
        })
        
        if result:
            logger.info(f"Updated embedding for node ID {node_id}")
            return True
        else:
            logger.warning(f"No node found with ID {node_id}")
            return False
            
    except Exception as e:
        logger.error(f"Error updating node embedding: {str(e)}")
        return False

def ensure_vector_index_exists() -> bool:
    """
    Create or update the vector index for embeddings in Neo4j.
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        db = get_db()
        
        # Check if index exists first
        check_query = """
        SHOW INDEXES
        YIELD name, type
        WHERE name = 'node_embedding_index' AND type = 'VECTOR'
        RETURN count(*) > 0 AS exists
        """
        
        result = db.execute_query(check_query)
        index_exists = result[0].get("exists", False) if result else False
        
        if index_exists:
            logger.info("Vector index 'node_embedding_index' already exists")
            return True
            
        # Create index if it doesn't exist
        create_query = """
        CREATE VECTOR INDEX node_embedding_index FOR (n) ON (n.embedding)
        OPTIONS {
          indexConfig: {
            "vector.dimensions": 384,
            "vector.similarity_function": "cosine"
          }
        }
        """
        
        db.execute_query(create_query)
        logger.info("Created vector index 'node_embedding_index'")
        return True
        
    except Exception as e:
        logger.error(f"Error ensuring vector index exists: {str(e)}")
        return False

def vector_search(query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Perform vector similarity search in Neo4j.
    
    Args:
        query_embedding (List[float]): The query embedding vector
        limit (int): Maximum number of results to return
        
    Returns:
        List[Dict]: List of similar nodes with their metadata
    """
    try:
        db = get_db()
        
        # Vector similarity search query
        query = """
        CALL db.index.vector.queryNodes(
          "node_embedding_index",
          $limit,
          $queryEmbedding
        ) YIELD node, score
        RETURN 
          id(node) AS nodeId,
          labels(node) AS labels,
          node.name AS name,
          node.description AS description,
          node.significance AS significance,
          score
        ORDER BY score DESC
        """
        
        results = db.execute_query(query, {
            "queryEmbedding": query_embedding,
            "limit": limit
        })
        
        logger.info(f"Vector search returned {len(results)} results")
        return results
        
    except Exception as e:
        logger.error(f"Error performing vector search: {str(e)}")
        return []
