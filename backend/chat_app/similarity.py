# helpers/fashion_recommender.py
import os
from dotenv import load_dotenv
import requests
from io import BytesIO
from PIL import Image
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
load_dotenv()

# ------------------------------
# 1. Load Model and MongoDB
# ------------------------------
print("Loading CLIP model...")
clip_model = SentenceTransformer('clip-ViT-B-32')
print("CLIP model loaded successfully!")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# MongoDB Connection
MONGO_URI = "mongodb+srv://mirun:mirun2005@cluster0.wka17ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client["auraMallDB"]
products_collection = db["products"]

# ------------------------------
# 2. Indexing Products
# ------------------------------
def index_product_images():
    """
    Run this function manually to generate embeddings for all products
    and store them in MongoDB.
    """
    docs = list(products_collection.find({}))
    print(f"Found {len(docs)} products to index")

    for product in docs:
        try:
            img_url = product.get("image_url")
            product_id = product["_id"]

            if not img_url:
                print(f"⚠️ Skipping product {product_id} (no image URL)")
                continue

            # Step 1: Download the product image
            response = requests.get(img_url, timeout=10)
            response.raise_for_status()

            # Step 2: Open the image
            image = Image.open(BytesIO(response.content))

            # Step 3: Generate embedding
            embedding = clip_model.encode(image).tolist()

            # Step 4: Save embedding to MongoDB
            products_collection.update_one(
                {"_id": product_id},
                {"$set": {"image_embedding": embedding}}
            )

            print(f"✅ Indexed product: {product.get('name', product_id)}")

        except Exception as e:
            print(f"❌ Failed to index product {product.get('name', product_id)}: {e}")


# ------------------------------
# 3. Main Recommendation Function
# ------------------------------
def run_fashion_advisor(user_image_path, db_connection=None, clip_model_instance=None):
    """
    Given a user's uploaded image, return the top recommended product image URL.
    """
    try:
        # Use provided model or default
        model = clip_model_instance if clip_model_instance else clip_model

        # Step 1: Load the uploaded image
        image = Image.open(user_image_path)

        # Step 2: Generate query vector
        query_vector = model.encode(image).tolist()

        # Step 3: MongoDB Vector Search Pipeline
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",  # Make sure this matches your MongoDB Atlas Search index
                    "path": "image_embedding",
                    "queryVector": query_vector,
                    "numCandidates": 150,
                    "limit": 5
                }
            },
            {
                "$project": {
                    "name": 1,
                    "brand": 1,
                    "price": 1,
                    "image_url": 1,
                    "_id": 0,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]

        # Step 4: Execute search
        results = list(products_collection.aggregate(pipeline))

        if not results:
            return None  # No recommendations found

        # Return the **top result's image URL**
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        You are a highly persuasive and friendly salesperson. 
        Recommend the following product to a customer in a natural, conversational tone.
        Reply in 1-2 lines beacause this is a chatbot, return it like you send a text to someone
        Product Name: {results[0]["name"]}
        Brand: {results[0]["brand"]}
        Price: ₹{results[0]["price"]}

        Output Requirements:
        - Start with a warm greeting.
        - Mention the brand and why it's trustworthy or premium.
        - Highlight the key features and benefits of the product.
        - End with a strong call-to-action encouraging the user to buy.
        """

        response = gemini_model.generate_content(prompt)
        print(response.text)
        response_text = response.text
        return results[0]["image_url"],response_text

    except Exception as e:
        print(f"Error in run_fashion_advisor: {e}")
        return None
