from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import google.generativeai as genai
import json

# --- Gemini setup (keep API key in env var ideally) ---
genai.configure(api_key="AIzaSyBiVDyT_scKALxY3Gl3Z8Ydb6d_hQM8Yjc")
embedding_model = "models/embedding-001"

# --- MongoDB setup (move URI to env var for security) ---
uri = "mongodb+srv://mirunkaushik:mirun2005@cluster0.zdhf1hl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["auraMallDB"]
query = input("Hey there what can i help you with? ")
query_embedding = genai.embed_content(model=embedding_model, content=query)["embedding"]

pipeline = [
    {
        "$vectorSearch": {
            "index": "mall",   # your index name in Atlas
            "path": "embedding",
            "queryVector": query_embedding,
            "numCandidates": 100,
            "limit": 5
        }
    },
    {
        "$project": {
            "source_collection": 1,
            "text": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    }
]

results = db["embeddings"].aggregate(pipeline)

print("\n🔎 Search results:")
context_docs = []
for r in results:
    context_docs.append(r["text"])

context = "\n".join(context_docs)

# User query
user_query = query

# Create a prompt
prompt = f"""
You are a helpful mall assistant.
The user asked: "{user_query}"

Here is some context from the mall database:
{context}

Based on this, answer the user's question clearly and concisely.
If the context is not relevant, politely say you don’t know.
"""

response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)

print("\n💬 Chatbot Answer:\n", response.text)