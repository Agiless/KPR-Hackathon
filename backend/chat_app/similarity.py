import torch
import requests
import json
from sentence_transformers import SentenceTransformer
from PIL import Image
from io import BytesIO
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# --- 1. SETUP: LOAD MODEL AND CONNECT TO DATABASE ---

def load_model():
    """Loads the CLIP model from sentence-transformers."""
    print("Loading CLIP model... (This may take a moment on first run)")
    try:
        model = SentenceTransformer('clip-ViT-B-32')
        print("Model loaded successfully.")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def connect_to_db():
    """Establishes connection to the MongoDB database."""
    uri = "mongodb+srv://mirun:mirun2005@cluster0.wka17ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    try:
        client = MongoClient(uri, server_api=ServerApi('1'))
        client.admin.command('ping')
        print("Successfully connected to MongoDB.")
        return client["auraMallDB"]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

# --- 2. CORE LOGIC FUNCTIONS ---

def find_best_match(user_image_path, db, model):
    """
    Finds the single best visually similar product from the database.
    Returns the product's details if found, otherwise None.
    """
    print("\n--- Step 1: Finding the most similar product in our database... ---")
    products_collection = db["products"]
    try:
        image = Image.open(user_image_path)
    except FileNotFoundError:
        print(f"Error: The image file was not found at '{user_image_path}'")
        return None
    except Exception as e:
        print(f"Error opening image: {e}")
        return None

    query_vector = model.encode(image).tolist()

    pipeline = [
        {
            '$vectorSearch': {
                'index': 'image_embedding',
                'path': 'image_embedding',
                'queryVector': query_vector,
                'numCandidates': 100,
                'limit': 1  # We only want the single best match
            }
        },
        {
            # Project all the necessary fields for both steps
            '$project': {
                'name': 1, 'brand': 1, 'price': 1, 'image_url': 1,
                'category': 1, 'style': 1, 'color': 1,
                '_id': 0,
                'score': {'$meta': 'vectorSearchScore'}
            }
        }
    ]

    try:
        similar_products = list(products_collection.aggregate(pipeline))
        print(similar_products)
        if similar_products:
            best_match = similar_products[0]
            print(f"Found a match: '{best_match.get('name')}' with similarity score {best_match.get('score', 0):.4f}")
            print(json.dumps(best_match, indent=2))
            return best_match
        else:
            print("Could not find any similar products in the database.......")
            return None
    except Exception as e:
        print(f"An error occurred during vector search: {e}")
        return None

def recommend_outfit(product_attributes, db):
    """
    Recommends a complementary outfit based on the attributes of a given product.
    """
    print("\n--- Step 2: Recommending a Complementary Outfit ---")

    def get_outfit_rules(attributes):
        """Defines what to look for based on input attributes."""
        rules = {}
        input_cat = attributes.get('category')
        input_color = attributes.get('color')

        if input_cat == 'top': rules['required_categories'] = ['bottom', 'shoes']
        elif input_cat == 'bottom': rules['required_categories'] = ['top', 'shoes']
        else: rules['required_categories'] = ['top', 'bottom']

        color_map = {
            'blue': ['khaki', 'white', 'black', 'grey', 'brown'],
            'black': ['white', 'grey', 'red'], 'white': ['black', 'khaki', 'blue', 'brown'],
            'red': ['black', 'white', 'khaki', 'blue'], 'khaki': ['blue', 'white', 'black', 'brown'],
            'brown': ['khaki', 'blue', 'white'], 'grey': ['black', 'white', 'blue']
        }
        rules['compatible_colors'] = color_map.get(input_color, ['black', 'white', 'grey'])
        return rules

    fashion_rules = get_outfit_rules(product_attributes)
    input_style = product_attributes.get('style')
    outfit = []
    products_collection = db["products"]

    print("\nSearching for complementary items...")
    for category_to_find in fashion_rules.get('required_categories', []):
        query = {
            "category": category_to_find, "style": input_style,
            "color": {"$in": fashion_rules.get('compatible_colors', [])}
        }
        result = products_collection.find_one(query)
        if result:
            print(f"  > Found a matching '{category_to_find}': {result.get('name')}")
            outfit.append(result)

    print("\n--- ✨ Your Recommended Outfit ✨ ---")
    if outfit:
        for item in outfit:
            print(f"- {item.get('category', 'Item').capitalize()}: {item.get('name')}")
            print(f"  (Brand: {item.get('brand')}, Price: {item.get('price')})")
    else:
        print("Sorry, we couldn't find a complete outfit for this item.")
    print("-" * 40)

# --- 3. MAIN WORKFLOW ORCHESTRATOR ---

def run_fashion_advisor(user_image_path, db, model):
    """Runs the full user workflow: find match, then offer outfit recommendation."""
    
    # Step 1: Find the best matching product
    best_match = find_best_match(user_image_path, db, model)

    if not best_match:
        print("\nCould not complete the request as no matching product was found.")
        return

    # Check if the found product has the necessary attributes for an outfit recommendation
    if not all(key in best_match for key in ['category', 'style', 'color']):
        print("\nNote: The matched product is missing key attributes (category, style, color).")
        print("Cannot proceed with outfit recommendation. Please ensure the database is populated correctly.")
        return

    # Step 2: If it's a clothing item, ask for permission to recommend an outfit
    clothing_categories = ['top', 'bottom', 'dress']
    if best_match.get('category') in clothing_categories:
        print("-" * 40)
        try:
            user_permission = input("This is a clothing item. Would you like to see a recommended outfit for it? (y/n): ").lower()
            if user_permission == 'y':
                recommend_outfit(best_match, db)
            else:
                print("\nOkay, skipping outfit recommendation. Enjoy your find!")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user.")
        except Exception as e:
            print(f"\nAn error occurred: {e}")


# --- 4. DATABASE UTILITY FUNCTIONS (Run as needed) ---

def add_sample_data(db):
    """Inserts a sample product dataset into the database."""
    products_collection = db["products"]
    if products_collection.count_documents({"_id": "prod_001"}) > 0:
        print("\nSample dataset already exists in the database.")
        return
    print("\nInserting sample dataset...")
    data = [
    #   { "_id": "prod_001", "name": "Men's Slim Fit Jeans", "brand": "True Blue", "price": 2999, "image_url":"https://imgs.search.brave.com/9gTLbf51h8SvMjiE1-jT-uYPRI1n1wbKMkBDEvckGU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFmMlpOdm9JV0wu/anBn"},
    #   { "_id": "prod_002", "name": "Women's Cotton Kurti", "brand": "FabIndia", "price": 1499, "image_url":"https://imgs.search.brave.com/sQv27LfbecswkgAAhYIXzhKTRsb4JAMVX3QtARyI1QQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjF6WWVKMjdvR0wu/anBn"},
    #   { "_id": "prod_003", "name": "Running Shoes", "brand": "Nike", "price": 4999, "image_url":"https://imgs.search.brave.com/MtY1ZFLU_3zFcCO9bA6A-gc23GBGYF9gEglWHr1kwYc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMubmlrZS5jb20v/YS9pbWFnZXMvdF9k/ZWZhdWx0LzU0ODUz/NzYyLWMxMTEtNDY0/ZC1iZTNiLWYxOWQy/NDk4ZmUwZS9GTEVY/K0VYUEVSSUVOQ0Ur/Uk4rMTIucG5n"},
    #   { "_id": "prod_004", "name": "Casual Sneakers", "brand": "Adidas", "price": 3599, "image_url":"https://imgs.search.brave.com/ow-OxmGi-OOA8Y555HQSgPMFV3PG8OZPlKWSleX55FM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzEwZDM4OUtickwu/anBn"},
    #   { "_id": "prod_005", "name": "Leather Wallet", "brand": "Woodland", "price": 1299, "image_url":"https://imgs.search.brave.com/Kcgvwrf7j1sJf_POkbF5ga-DO-RrFcl4BF4zIh986QQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cHRjYnV5LmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxOS8w/OC9Xb29kbGFuZC1C/cm93bi1MZWF0aGVy/LUZvcm1hbC1SZWd1/bGFyLU1lbnMtV2Fs/bGV0LmpwZw"},
    #   { "_id": "prod_008", "name": "Football", "brand": "Nivia", "price": 999, "image_url":"https://imgs.search.brave.com/t9BUyZG9h3-xWftWG2hnWcBQ3pgn3kJLL2EmbB1wVz4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vo/WGM2Tk9oQnI3ZHo2/TE5BY3E0WlFwdkZ0/TEl3MzRUUFFLLTdW/aDVqZkZvalhUQzlP/cUk5WnhvUEJxdjZH/dFExMndYN2lVdkFL/bUdSVktUeE9HS2hw/SVNrUFc1U25VNnl2/Q1M5RDllNENaUTdI/b1RJNVBNV1BnbjhG/NkZmLV9DZjI1UzJJ/bDJGaUllX1lmTjRv/V2c3ZHg2bmtxZzlo/MlJXY1loLVF6N2Zr/WWV3SjNTUHYzZkFJ/dGpCYXEvczYwMC9h/ZGlkYXMlMjBjbGFz/c2ljJTIwYmFsbCUy/MHJlbWFrZXMlMjAo/OCkuanBn"},
     {
  "_id": "prod_009",
  "name": "Light Blue Women's Jeans",
  "brand": "Levi's",
  "price": 2499,
  "image_url": "https://imgs.search.brave.com/fWpm-wtq539PnDFWoX9ZDs3zNPbp9Wo5h7w9lt4QQg0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzk3L2Q1/L2ZkLzk3ZDVmZGY5/ODQ5OTIwOGMyN2Jk/ZGVlODM1NTE0OTE1/LmpwZw",
  "category": "jeans",
  "color": "light blue",
  "style": "casual"
}

    ]
    products_collection.insert_one(data)
    print("Successfully inserted sample data.")

def populate_database_embeddings_and_attributes(db, model):
    """
    One-time utility to add embeddings and AI-generated attributes to all products.
    """
    print("\nStarting one-time database population for embeddings and attributes...")
    products_collection = db["products"]
    
    # Create a helper function to extract attributes since it's used here
    def _extract_attributes_for_db(image: Image.Image, model: SentenceTransformer):
        attributes = {}
        possible_categories = ["a photo of a shirt", "a photo of pants", "a photo of a shoe", "a photo of a dress"]
        possible_styles = ["a photo of a formal item", "a photo of a casual item", "a photo of a sporty item"]
        possible_colors = ["a photo of a black item", "a photo of a white item", "a photo of a blue item", "a photo of a khaki item", "a photo of a red item", "a photo of a brown item", "a photo of a grey item"]
        image_embedding = model.encode(image, convert_to_tensor=True)
        cat_text_embeddings = model.encode(possible_categories, convert_to_tensor=True)
        style_text_embeddings = model.encode(possible_styles, convert_to_tensor=True)
        color_text_embeddings = model.encode(possible_colors, convert_to_tensor=True)
        cat_sims = torch.nn.functional.cosine_similarity(image_embedding, cat_text_embeddings)
        style_sims = torch.nn.functional.cosine_similarity(image_embedding, style_text_embeddings)
        color_sims = torch.nn.functional.cosine_similarity(image_embedding, color_text_embeddings)
        attributes['category'] = possible_categories[cat_sims.argmax()].split(" ")[-1]
        attributes['style'] = possible_styles[style_sims.argmax()].split(" ")[-2]
        attributes['color'] = possible_colors[color_sims.argmax()].split(" ")[-2]
        if attributes['category'] in ['shirt', 'dress']: attributes['category'] = 'top'
        elif attributes['category'] == 'pants': attributes['category'] = 'bottom'
        return attributes

    for product in list(products_collection.find({})):
        try:
            if 'image_embedding' in product and 'category' in product:
                continue
            img_url = product["image_url"]
            response = requests.get(img_url, timeout=10)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
            embedding = model.encode(image).tolist()
            attributes = _extract_attributes_for_db(image, model)
            products_collection.update_one(
                {'_id': product['_id']},
                {'$set': {
                    'image_embedding': embedding,
                    'category': attributes['category'],
                    'style': attributes['style'],
                    'color': attributes['color']
                }}
            )
            print(f"  Updated '{product.get('name')}'")
        except Exception as e:
            print(f"  Could not process product {product.get('_id')}. Error: {e}")
    print("Database population complete.")

