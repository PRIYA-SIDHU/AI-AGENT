import os
import json
import math
import re
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

def tokenize(text: str) -> List[str]:
    """Tokenizes and lowercases text."""
    return re.findall(r'\w+', text.lower())

def compute_cosine_similarity(query_text: str, documents_list: List[str]) -> List[float]:
    """Computes TF-IDF cosine similarity between a query and a list of documents in pure Python."""
    query_tokens = tokenize(query_text)
    if not query_tokens or not documents_list:
        return [0.0] * len(documents_list)
        
    docs_tokens = [tokenize(doc) for doc in documents_list]
    
    # Build vocabulary of relevant terms
    vocab = set(query_tokens)
    for doc_t in docs_tokens:
        vocab.update(doc_t)
        
    # Document frequency for IDF
    df = {}
    for word in vocab:
        df[word] = sum(1 for doc_t in docs_tokens if word in doc_t)
        
    # Compute IDF with smoothing
    N = len(documents_list)
    idf = {}
    for word in vocab:
        idf[word] = math.log((1 + N) / (1 + df.get(word, 0))) + 1.0
        
    # Query TF-IDF vector
    query_tf = {}
    for word in query_tokens:
        query_tf[word] = query_tf.get(word, 0) + 1
        
    query_vec = {}
    for word in vocab:
        query_vec[word] = query_tf.get(word, 0) * idf[word]
        
    # Documents TF-IDF vectors
    doc_vecs = []
    for doc_t in docs_tokens:
        doc_tf = {}
        for word in doc_t:
            doc_tf[word] = doc_tf.get(word, 0) + 1
        vec = {}
        for word in vocab:
            vec[word] = doc_tf.get(word, 0) * idf[word]
        doc_vecs.append(vec)
        
    # Calculate cosine similarity
    similarities = []
    query_mag = math.sqrt(sum(v**2 for v in query_vec.values()))
    
    for doc_vec in doc_vecs:
        doc_mag = math.sqrt(sum(v**2 for v in doc_vec.values()))
        if query_mag == 0 or doc_mag == 0:
            similarities.append(0.0)
            continue
            
        dot_product = sum(query_vec.get(word, 0) * doc_vec.get(word, 0) for word in vocab)
        similarities.append(dot_product / (query_mag * doc_mag))
        
    return similarities

class MockCollection:
    def __init__(self, name: str, db_file: str):
        self.name = name
        self.db_file = db_file
        self.data = self._load_db()

    def _load_db(self) -> Dict[str, Any]:
        if os.path.exists(self.db_file):
            try:
                with open(self.db_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading mock ChromaDB file: {e}")
        return {}

    def _save_db(self):
        try:
            with open(self.db_file, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving mock ChromaDB file: {e}")

    def count(self) -> int:
        return len(self.data)

    def upsert(self, ids: List[str], documents: List[str], metadatas: List[Dict[str, Any]]):
        for i, item_id in enumerate(ids):
            self.data[item_id] = {
                "id": item_id,
                "document": documents[i],
                "metadata": metadatas[i]
            }
        self._save_db()
        logger.info(f"Upserted {len(ids)} documents into mock collection '{self.name}'")

    def query(self, query_texts: List[str], n_results: int = 4) -> Dict[str, List[Any]]:
        if not query_texts:
            return {"ids": [[]], "metadatas": [[]], "documents": [[]]}

        query_text = query_texts[0]
        items = list(self.data.values())
        if not items:
            return {"ids": [[]], "metadatas": [[]], "documents": [[]]}

        docs = [item["document"] for item in items]
        
        # Compute similarities
        sims = compute_cosine_similarity(query_text, docs)
        
        # Sort items based on similarity scores
        scored_items = sorted(
            zip(sims, items),
            key=lambda x: x[0],
            reverse=True
        )
        
        # Take top n results
        top_results = scored_items[:n_results]
        
        ids = [item[1]["id"] for item in top_results]
        metadatas = [item[1]["metadata"] for item in top_results]
        documents = [item[1]["document"] for item in top_results]
        
        return {
            "ids": [ids],
            "metadatas": [metadatas],
            "documents": [documents]
        }

class PersistentClient:
    def __init__(self, path: str):
        self.path = path
        os.makedirs(path, exist_ok=True)
        self.db_file = os.path.join(path, "chroma_mock_store.json")
        logger.info(f"Initialized mock ChromaDB PersistentClient at {self.db_file}")

    def get_or_create_collection(self, name: str, embedding_function: Any = None) -> MockCollection:
        return MockCollection(name, self.db_file)

class DefaultEmbeddingFunction:
    """Mock embedding function to mimic ChromaDB's utilities."""
    def __init__(self):
        pass
