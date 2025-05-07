from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class Neo4jDatabase:
    """
    Neo4j database service for handling graph database operations.
    """
    
    def __init__(self):
        """Initialize Neo4j database connection using environment variables."""
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER")
        password = os.getenv("NEO4J_PASSWORD")
        
        if not uri or not user or not password:
            logger.error("Neo4j environment variables not properly set")
            raise ValueError("Neo4j environment variables not properly set")
        
        try:
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            logger.info("Successfully connected to Neo4j database")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {str(e)}")
            raise ConnectionError(f"Failed to connect to Neo4j: {str(e)}")
    
    def close(self):
        """Close the database connection."""
        if hasattr(self, 'driver'):
            self.driver.close()
            logger.info("Neo4j connection closed")
    
    def execute_query(self, query, parameters=None):
        """
        Execute a Cypher query and return the results.
        
        Args:
            query (str): Cypher query string
            parameters (dict, optional): Query parameters
            
        Returns:
            list: Query results
        """
        try:
            with self.driver.session() as session:
                result = session.run(query, parameters or {})
                return [record.data() for record in result]
        except Exception as e:
            logger.error(f"Query execution failed: {str(e)}")
            raise Exception(f"Query execution failed: {str(e)}")
    
    def get_node_by_id(self, node_id, labels=None):
        """
        Retrieve a node by its ID.
        
        Args:
            node_id (str): The ID of the node
            labels (list, optional): List of node labels to filter by
            
        Returns:
            dict: Node properties
        """
        label_condition = ""
        if labels:
            label_condition = ":" + ":".join(labels)
            
        query = f"""
        MATCH (n{label_condition})
        WHERE n.id = $node_id
        RETURN n
        """
        results = self.execute_query(query, {"node_id": node_id})
        return results[0]["n"] if results else None
    
    def find_related_nodes(self, node_id, relationship_type=None, direction="OUTGOING", limit=10):
        """
        Find nodes related to a given node.
        
        Args:
            node_id (str): The ID of the source node
            relationship_type (str, optional): Type of relationship to filter by
            direction (str): Direction of relationship ("OUTGOING", "INCOMING", or "BOTH")
            limit (int): Maximum number of results
            
        Returns:
            list: Related nodes with their relationships
        """
        rel_direction = {
            "OUTGOING": "()-[r]->(target)",
            "INCOMING": "(target)-[r]->()",
            "BOTH": "()-[r]-(target)"
        }.get(direction.upper(), "()-[r]->(target)")
        
        rel_type = f":{relationship_type}" if relationship_type else ""
        
        query = f"""
        MATCH (source {{id: $node_id}}), (source){rel_direction}
        WHERE r{rel_type}
        RETURN target, type(r) AS relationship_type, r.properties AS relationship_props
        LIMIT $limit
        """
        
        return self.execute_query(query, {
            "node_id": node_id,
            "limit": limit
        })

# Singleton instance
database = Neo4jDatabase()

def get_db():
    """
    Get the database instance.
    
    Returns:
        Neo4jDatabase: Database service instance
    """
    return database