import os
import json
import logging

logger = logging.getLogger(__name__)

try:
    import chromadb
    from chromadb.utils import embedding_functions
    HAS_NATIVE_CHROMADB = True
    logger.info("Successfully imported native ChromaDB.")
except ImportError:
    logger.warning("Native chromadb package not found. Falling back to internal pure-Python ChromaDB implementation.")
    import backend.vector_db.chromadb_fallback as chromadb
    from backend.vector_db import chromadb_fallback as embedding_functions
    HAS_NATIVE_CHROMADB = False

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "vector_db", "chroma_db_store")
SCHEMES_JSON_PATH = os.path.join(BASE_DIR, "data", "dummy_schemes.json")

# Ensure the DB directory exists
os.makedirs(DB_PATH, exist_ok=True)

class ChromaLoader:
    def __init__(self):
        # Use local persistent storage
        self.client = chromadb.PersistentClient(path=DB_PATH)
        # Using Chroma's embedding function (will be the mock one if fallback is active)
        self.embedding_function = embedding_functions.DefaultEmbeddingFunction()
        self.collection_name = "government_schemes"
        self.collection = None

    def get_or_create_collection(self):
        if not self.collection:
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                embedding_function=self.embedding_function
            )
        return self.collection

    def load_schemes(self, force_reload: bool = False):
        collection = self.get_or_create_collection()
        
        # Check if already populated
        existing_count = collection.count()
        if existing_count > 0 and not force_reload:
            logger.info(f"ChromaDB collection already contains {existing_count} schemes. Skipping loading.")
            return

        if not os.path.exists(SCHEMES_JSON_PATH):
            logger.error(f"Dummy schemes JSON not found at {SCHEMES_JSON_PATH}")
            return

        logger.info(f"Loading schemes from {SCHEMES_JSON_PATH} into ChromaDB...")
        with open(SCHEMES_JSON_PATH, "r", encoding="utf-8") as f:
            schemes = json.load(f)

        ids = []
        documents = []
        metadatas = []

        for scheme in schemes:
            scheme_id = scheme["id"]
            name = scheme["name"]
            category = scheme["category"]
            description = scheme["description"]
            eligibility = scheme["eligibility"]
            benefits = scheme["benefits"]
            
            # Combine text fields to create a rich document representation for embedding
            doc_text = (
                f"Scheme Name: {name}\n"
                f"Category: {category}\n"
                f"Description: {description}\n"
                f"Eligibility Criteria: {eligibility}\n"
                f"Benefits: {benefits}"
            )
            
            # Serialize the required documents list to store in ChromaDB metadata
            required_docs_str = json.dumps(scheme.get("required_documents", []))
            
            metadata = {
                "id": scheme_id,
                "name": name,
                "category": category,
                "description": description,
                "eligibility": eligibility,
                "benefits": benefits,
                "required_documents": required_docs_str,
                "official_link": scheme.get("official_link", "")
            }

            ids.append(scheme_id)
            documents.append(doc_text)
            metadatas.append(metadata)

        # Upsert
        if ids:
            collection.upsert(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
            logger.info(f"Successfully loaded {len(ids)} schemes into ChromaDB.")

    def search_schemes(self, query: str, limit: int = 4):
        collection = self.get_or_create_collection()
        results = collection.query(
            query_texts=[query],
            n_results=limit
        )
        
        # Format the query output back into standard dictionary structures
        schemes = []
        if results and results["metadatas"] and len(results["metadatas"]) > 0:
            for metadata in results["metadatas"][0]:
                # Deserialize required documents back to list
                req_docs = []
                if "required_documents" in metadata:
                    try:
                        req_docs = json.loads(metadata["required_documents"])
                    except Exception:
                        req_docs = metadata["required_documents"]
                
                scheme = {
                    "id": metadata.get("id"),
                    "name": metadata.get("name"),
                    "category": metadata.get("category"),
                    "description": metadata.get("description"),
                    "eligibility": metadata.get("eligibility"),
                    "benefits": metadata.get("benefits"),
                    "required_documents": req_docs,
                    "official_link": metadata.get("official_link")
                }
                schemes.append(scheme)
        return schemes

chroma_loader = ChromaLoader()

if __name__ == "__main__":
    # Setup simple logging to test run
    logging.basicConfig(level=logging.INFO)
    loader = ChromaLoader()
    loader.load_schemes(force_reload=True)
    results = loader.search_schemes("scholarship for OBC student", limit=2)
    print("Search results test:")
    print(json.dumps(results, indent=2))
