import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.database.mongodb import connect_to_mongo, close_mongo_connection
from backend.vector_db.chroma_loader import chroma_loader
from backend.routes.chat import router as chat_router
from backend.routes.history import router as history_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("govassist")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    logger.info("Initializing GovAssist AI Backend services...")
    await connect_to_mongo()
    
    # Startup: Load ChromaDB schemes in a separate thread
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, chroma_loader.load_schemes)
    except Exception as e:
        logger.error(f"Failed to auto-populate ChromaDB schemes: {e}")
        
    yield
    
    # Shutdown: Clean up connections
    logger.info("Stopping GovAssist AI Backend services...")
    await close_mongo_connection()

app = FastAPI(
    title="GovAssist AI - Backend",
    description=(
        "FastAPI Backend for GovAssist AI - AI Powered Government Scheme Recommendation Assistant. "
        "Integrates MongoDB for chat history, ChromaDB for RAG semantic search, and Groq SDK."
    ),
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development and testing
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Error handling middleware for unexpected server exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Exception Handler caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"}
    )

# Register routers
app.include_router(chat_router, tags=["Chats"])
app.include_router(history_router, tags=["History"])

@app.get("/", tags=["General"])
async def root():
    return {
        "app": "GovAssist AI Backend",
        "status": "online",
        "documentation": "/docs",
        "supported_models": ["llama-3.3-70b-versatile", "qwen/qwen3-32b"]
    }
