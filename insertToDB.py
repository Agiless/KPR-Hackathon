import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime, timedelta

# --- 1. DATABASE SETUP ---

# It's best practice to manage your connection string in a .env file.
# Create a file named .env and add: MONGO_URI="mongodb://localhost:27017/"
# load_dotenv()
# MONGO_URI = os.getenv('MONGO_URI', "mongodb://localhost:27017/")
DB_NAME = "auraMallDB" # Using the final database name

uri = "mongodb+srv://mirunkaushik:mirun2005@cluster0.zdhf1hl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    db = client["auraMallDB"]
except Exception as e:
    print(e)


# --- 2. SAMPLE DATA DEFINITION ---
# We are defining all data with explicit _id fields to make referencing clear and predictable.

# --- STORES DATA ---
STORES_DATA = [
    {
        "_id": "store_01_lifestyle",
        "name": "Lifestyle",
        "floor": 1,
        "category": "Fashion & Apparel",
        "description": "A leading fashion destination for the latest trends.",
        "opening_hours": "10:30 AM - 10:00 PM",
        "contact": {"phone": "0431-4001234", "manager": "Priya S."},
        "tags": ["clothing", "accessories", "footwear", "beauty"]
    },
    {
        "_id": "store_02_croma",
        "name": "Croma",
        "floor": 2,
        "category": "Electronics",
        "description": "A one-stop shop for all your electronic needs.",
        "opening_hours": "11:00 AM - 9:30 PM",
        "contact": {"phone": "0431-4005678", "manager": "Ravi K."},
        "tags": ["smartphones", "laptops", "appliances", "gadgets"]
    },
    {
        "_id": "store_03_hamleys",
        "name": "Hamleys",
        "floor": 0,
        "category": "Toys & Hobbies",
        "description": "The finest toy shop in the world, bringing magical experiences.",
        "opening_hours": "11:00 AM - 9:00 PM",
        "contact": {"phone": "0431-4009101", "manager": "Anjali M."},
        "tags": ["toys", "games", "kids", "collectibles"]
    },
    {
        "_id": "store_04_sangeetha",
        "name": "Sangeetha Veg Restaurant",
        "floor": 2,
        "category": "Food & Beverage",
        "description": "Authentic South Indian vegetarian cuisine.",
        "opening_hours": "10:00 AM - 10:30 PM",
        "contact": {"phone": "0431-2777888", "manager": "Murali G."},
        "tags": ["south indian", "vegetarian", "dosa", "thali", "food court"]
    }
]

# --- PRODUCTS DATA (Linked to Stores) ---
PRODUCTS_DATA = [
    # Lifestyle Products
    {
        "_id": "prod_001", "store_id": "store_01_lifestyle", "brand": "Louis Philippe",
        "name": "Men's Formal Shirt", "price": 2499.00, "currency": "INR",
        "stock_status": "In Stock", "attributes": {"color": "Sky Blue", "sizes": ["M", "L", "XL"]}
    },
    {
        "_id": "prod_002", "store_id": "store_01_lifestyle", "brand": "Fossil",
        "name": "Gen 6 Smartwatch", "price": 21995.00, "currency": "INR",
        "stock_status": "In Stock", "attributes": {"color": "Rose Gold", "strap": "Leather"}
    },
    # Croma Products
    {
        "_id": "prod_003", "store_id": "store_02_croma", "brand": "Apple",
        "name": "iPhone 16 Pro", "price": 149900.00, "currency": "INR",
        "stock_status": "In Stock", "attributes": {"color": "Titanium Blue", "storage": "256GB"}
    },
    {
        "_id": "prod_004", "store_id": "store_02_croma", "brand": "Sony",
        "name": "Bravia 55-inch 4K TV", "price": 74990.00, "currency": "INR",
        "stock_status": "Low Stock", "attributes": {"display": "OLED", "model_year": 2025}
    },
    # Hamleys Products
    {
        "_id": "prod_005", "store_id": "store_03_hamleys", "brand": "LEGO",
        "name": "LEGO Star Wars Millennium Falcon", "price": 15999.00, "currency": "INR",
        "stock_status": "In Stock", "attributes": {"age_range": "9-14", "pieces": 1351}
    }
]

# --- MALL EVENTS DATA (Linked to Stores where applicable) ---
EVENTS_DATA = [
    {
        "_id": "event_01_diwali",
        "title": "Diwali Celebration Sale",
        "type": "MALL_WIDE",
        "store_id": None, # Null because it applies to the whole mall
        "description": "Celebrate the festival of lights with amazing discounts up to 60% off across all stores!",
        "start_time": datetime(2025, 10, 20, 10, 0),
        "end_time": datetime(2025, 10, 30, 22, 0),
        "image_url": "https://example.com/images/diwali_sale.png"
    },
    {
        "_id": "event_02_iphone_launch",
        "title": "New iPhone 16 Pro Launch Event",
        "type": "STORE_SPECIFIC",
        "store_id": "store_02_croma", # Linked directly to Croma
        "description": "Be the first to experience the new iPhone 16 Pro. Live demos and launch day offers available.",
        "start_time": datetime.now() - timedelta(days=2),
        "end_time": datetime.now() + timedelta(days=5),
        "image_url": "https://example.com/images/iphone_launch.png"
    }
]

# --- 3. DATABASE SEEDER FUNCTION ---

def seed_database():
    """Clears and seeds all collections with the sample data."""
    print("\n🌱 Starting database seeding process...")
    
    # A dictionary mapping collection names to their data
    collections_to_seed = {
        "stores": STORES_DATA,
        "products": PRODUCTS_DATA,
        "events": EVENTS_DATA
    }
    
    for name, data in collections_to_seed.items():
        collection = db[name]
        try:
            # Clear existing data
            collection.delete_many({})
            # Insert new data
            collection.insert_many(data)
            print(f"  - Successfully seeded '{name}' collection with {len(data)} documents.")
        except Exception as e:
            print(f"  - ❌ Error seeding '{name}' collection: {e}")
            
    print("\n✅ Database seeding process completed.")

# --- 4. VERIFICATION FUNCTION ---

def verify_data():
    """Fetches one sample document from each collection to verify insertion."""
    print("\n🔍 Verifying data insertion...")
    try:
        store = db.stores.find_one({"_id": "store_01_lifestyle"})
        product = db.products.find_one({"_id": "prod_003"})
        event = db.events.find_one({"type": "MALL_WIDE"})
        
        print("\n--- Sample Store ---")
        print(store)
        print("\n--- Sample Product ---")
        print(product)
        print("\n--- Sample Event ---")
        print(event)
        
        print("\n✅ Verification successful. Data looks good!")
    except Exception as e:
        print(f"❌ Verification failed. Error: {e}")

# --- 5. SCRIPT EXECUTION ---

if __name__ == "__main__":
    seed_database()
    verify_data()