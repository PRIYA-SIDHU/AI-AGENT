import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Dynamically find the root .env file by traversing upwards
_current_dir = os.path.dirname(os.path.abspath(__file__))
for _ in range(4):
    _env_path = os.path.join(_current_dir, ".env")
    if os.path.exists(_env_path):
        load_dotenv(dotenv_path=_env_path, override=True)
        break
    _current_dir = os.path.dirname(_current_dir)

logger = logging.getLogger(__name__)

# Default local MongoDB connection if not provided
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = "govassist_db"

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    try:
        db_instance.client = AsyncIOMotorClient(MONGODB_URI)
        db_instance.db = db_instance.client[DB_NAME]
        logger.info(f"Connected to MongoDB at {MONGODB_URI.split('@')[-1]} (DB: {DB_NAME})")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection")

def get_db():
    if db_instance.db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return db_instance.db
