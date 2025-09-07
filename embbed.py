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

# --- Loop through all collections and insert embeddings ---
# Central embeddings collection
embeddings_coll = db["embeddings"]

# Clear old data (optional)
embeddings_coll.delete_many({})

# Loop through all collections (except embeddings itself)
for coll_name in db.list_collection_names():
    if coll_name == "embeddings":
        continue  # skip this collection

    print(f"Processing {coll_name} collection...")
    collection = db[coll_name]

    docs = list(collection.find({}))
    for doc in docs:
        # Convert doc to string for embedding
        doc_str = "; ".join([f"{k}: {v}" for k, v in doc.items() if k != "_id"])

        # Generate embedding
        embedding = genai.embed_content(model=embedding_model, content=doc_str)["embedding"]

        # Insert into embeddings collection
        embeddings_coll.insert_one({
            "source_collection": coll_name,
            "original_id": str(doc["_id"]),
            "text": doc_str,
            "raw_doc": json.loads(json.dumps(doc, default=str)),
            "embedding": embedding
        })

print("✅ All documents copied into 'embeddings' collection with embeddings!")


