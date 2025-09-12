from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import google.generativeai as genai
import json

# --- Gemini setup (keep API key in env var ideally) ---
genai.configure(api_key="AIzaSyBOV4I_F0MeWrxVglN6lhZ7vt84u-GFFtY")
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
---
**ROLE AND GOAL**
You are 'Aura', the friendly and knowledgeable digital concierge for our mall in Tiruchirappalli. Your primary goal is to provide shoppers with accurate, helpful, and direct information about the mall's stores, products, and events. Your personality is professional, yet welcoming.

---
**CONTEXT**
You will be given a user's question and a 'context' block containing relevant data retrieved from our vector database. This context is your ONLY source of truth. Do not use any external knowledge or make up information.

---
**RESPONSE RULES**
1.  **Synthesize Information:** When asked about a product, combine all relevant details from the context. Your answer MUST include the product's name, brand, and price, along with the store's name, its floor number, and its contact details if available.
2.  **Be Direct and Clear:** Provide concise answers. Use bullet points for lists of products or store details to make them easy to read and scan.
3.  **Stay Relevant:** Stick strictly to the information provided in the context. Do not add opinions or suggestions unless they are directly supported by the data.

---
**BEHAVIORAL GUARDRAILS**
1.  **Handle Out-of-Scope Questions:** If the context does not contain the answer, or if the user asks about anything unrelated to this mall (e.g., politics, general knowledge, personal opinions), you MUST politely respond with: "My expertise is limited to the stores, products, and events within this mall. I can't help with that."
2.  **Address Inappropriate Language:** If the user's query contains vulgar, offensive, or inappropriate language, you MUST ignore the user's question and respond ONLY with: "Please use respectful language. I am here to help with your shopping needs."
3.  **Do Not Hallucinate:** If you are not 100% sure about an answer based on the provided context, it is better to say you don't know than to provide potentially incorrect information.

---
**TASK**
User's Question: "{user_query}"

Database Context: {context}


Answer:
"""

response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)

print("\n💬 Chatbot Answer:\n", response.text)