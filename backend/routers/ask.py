from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import requests
import json
from typing import List, Dict, Any

from services import embedding

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/ask", tags=["ask"])

# Request and response models
class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]] = []

@router.post("/", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """
    Process a user question using semantic search and LLM integration.
    
    Args:
        request (QuestionRequest): The user's question
        
    Returns:
        QuestionResponse: The AI-generated answer with sources
        
    Raises:
        HTTPException: If processing fails
    """
    question = request.question.strip()
    
    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    try:
        # 1. Generate embedding for the question
        query_embedding = embedding.generate_embedding(question)
        
        if not query_embedding:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate embedding for question"
            )
        
        # 2. Perform vector similarity search
        similar_nodes = embedding.vector_search(query_embedding, limit=5)
        
        if not similar_nodes:
            # If no similar nodes found, provide a generic response
            return QuestionResponse(
                answer="I don't have specific information about that in my knowledge base. Please try a different question related to digital forensics.",
                sources=[]
            )
        
        # 3. Prepare context for LLM prompt
        context = []
        sources = []
        
        for node in similar_nodes:
            node_type = node.get("labels", ["Unknown"])[0]
            name = node.get("name", "Unknown item")
            description = node.get("description", "")
            significance = node.get("significance", "")
            
            # Add to context for LLM
            if description:
                context.append(f"- {name}: {description}")
            
            if significance:
                context.append(f"  Significance: {significance}")
            
            # Add to sources for response
            sources.append({
                "name": name,
                "type": node_type,
                "relevance_score": round(node.get("score", 0) * 100, 2)
            })
        
        # 4. Construct LLM prompt
        prompt = f"""
Instruction: Use the following forensic knowledge to answer the question accurately. If the information doesn't contain an answer to the question, state that you don't have enough information rather than making up an answer.

Context:
{chr(10).join(context)}

Question: {question}

Answer:
"""

        # 5. Send to Ollama for response
        # In a production environment, you might use a different LLM provider
        # This is a placeholder for demonstration
        answer = "Based on the digital forensic evidence provided, " + \
                 "I can answer your question with information from our knowledge base. " + \
                 "This would typically be processed through an LLM, but for now this is a placeholder response."
        
        # In a real implementation, you would send the prompt to an LLM service
        # and receive the generated answer.
        # Example:
        # llm_response = requests.post(
        #     "http://localhost:11434/api/generate",
        #     json={"model": "your-model", "prompt": prompt}
        # )
        # answer = llm_response.json().get("response", "")
        
        return QuestionResponse(
            answer=answer,
            sources=sources
        )
        
    except Exception as e:
        error_message = f"Error processing question: {str(e)}"
        logger.error(error_message)
        raise HTTPException(
            status_code=500,
            detail=error_message
        )
