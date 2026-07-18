import logging
import asyncio
from typing import List, Dict, Any
from backend.vector_db.chroma_loader import chroma_loader

logger = logging.getLogger(__name__)

class RAGService:
    async def retrieve_relevant_schemes(self, query: str, limit: int = 4) -> List[Dict[str, Any]]:
        """
        Retrieves relevant government schemes from ChromaDB based on semantic similarity to the query.
        Runs in an executor to prevent blocking the async event loop.
        """
        try:
            logger.info(f"Retrieving top {limit} schemes matching query: '{query}'")
            loop = asyncio.get_event_loop()
            
            def perform_search():
                return chroma_loader.search_schemes(query, limit=limit)
                
            results = await loop.run_in_executor(None, perform_search)
            logger.info(f"Successfully retrieved {len(results)} schemes from ChromaDB.")
            return results
        except Exception as e:
            logger.error(f"Error retrieving schemes from ChromaDB: {e}")
            # Fallback to empty list so Chat workflow can continue with empty context
            return []

rag_service = RAGService()
