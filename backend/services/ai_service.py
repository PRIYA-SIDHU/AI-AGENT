import os
import logging
from typing import List, Dict, Any
from groq import Groq
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

class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.default_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        
        if not self.api_key:
            logger.warning("GROQ_API_KEY not found in environment variables. Groq service will not function.")
            self.client = None
        else:
            self.client = Groq(api_key=self.api_key)

    async def generate_response(
        self,
        user_message: str,
        chat_history: List[Dict[str, str]],
        retrieved_schemes: List[Dict[str, Any]],
        model_name: str = None
    ) -> str:
        """
        Generates a response using Groq AI based on context and message history.
        
        chat_history is a list of dicts: [{"role": "user"/"assistant", "content": "..."}]
        retrieved_schemes is a list of scheme dicts from ChromaDB.
        """
        if not self.client:
            raise RuntimeError("Groq client not initialized. Please set GROQ_API_KEY in the environment.")

        model = model_name or self.default_model

        # 1. Build the System Prompt
        system_prompt = (
            "You are GovAssist AI, a helpful, conversational, and premium AI-powered Government Scheme Recommendation Assistant.\n"
            "Your goal is to help users understand and apply for government schemes based ONLY on the retrieved schemes provided below.\n\n"
            "CRITICAL RULES:\n"
            "1. NEVER invent or hallucinate government schemes that are not present in the retrieved schemes context. "
            "If the retrieved schemes do not contain information related to the user's query, state that you cannot find matching schemes in the database, "
            "but offer to help with general advice on the categories you support.\n"
            "2. Keep your answers conversational, concise, and structured. Use Markdown headings (###), bold text, bullet points, and blockquotes for premium presentation.\n"
            "3. If a scheme has an official link, output it clearly as a markdown link.\n"
            "4. Provide practical next steps like eligibility self-checks, documents checklist, or application guides.\n"
            "5. Answer in a warm, professional, human-like manner."
        )

        # 2. Format the retrieved documents context
        context_str = "RETIREVED SCHEMES CONTEXT:\n"
        if not retrieved_schemes:
            context_str += "No matching schemes found in the database.\n"
        else:
            for idx, scheme in enumerate(retrieved_schemes, 1):
                docs_list = ", ".join(scheme.get("required_documents", [])) if isinstance(scheme.get("required_documents"), list) else str(scheme.get("required_documents", ""))
                context_str += (
                    f"--- Scheme {idx} ---\n"
                    f"ID: {scheme.get('id')}\n"
                    f"Name: {scheme.get('name')}\n"
                    f"Category: {scheme.get('category')}\n"
                    f"Description: {scheme.get('description')}\n"
                    f"Eligibility: {scheme.get('eligibility')}\n"
                    f"Benefits: {scheme.get('benefits')}\n"
                    f"Required Documents: {docs_list}\n"
                    f"Official Link: {scheme.get('official_link')}\n"
                )

        # 3. Assemble the conversation history messages for the Chat Completion API
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history
        for msg in chat_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add context + current user question
        user_prompt = (
            f"{context_str}\n\n"
            f"CURRENT USER QUESTION: {user_message}"
        )
        messages.append({"role": "user", "content": user_prompt})

        try:
            logger.info(f"Calling Groq API with model {model} and {len(retrieved_schemes)} context documents...")
            
            # Since groq client call is synchronous, we run it in a threadpool or call it directly.
            # Running via run_in_executor or similar is preferred in async code to avoid blocking.
            import asyncio
            loop = asyncio.get_event_loop()
            
            def call_groq():
                return self.client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.3,
                    max_tokens=2048,
                )
                
            response = await loop.run_in_executor(None, call_groq)
            assistant_reply = response.choices[0].message.content
            logger.info("Successfully received response from Groq.")
            return assistant_reply
            
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            raise e

ai_service = AIService()
