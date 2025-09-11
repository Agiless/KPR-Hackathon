import pandas as pd
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

# --- Step 1: Attribute Extraction ---
# We need functions to get the category, color, and style from an image.

def extract_dominant_color(image_path, k=3):
    """
    Finds the most dominant color in an image using KMeans clustering.
    Returns the color as a hex string.
    """
    try:
        img = Image.open(image_path)
        # Resize for faster processing
        img = img.resize((100, 100))
        # Remove alpha channel for simplicity
        img = img.convert("RGB")
        
        # Reshape the image to be a list of pixels
        pixels = np.array(img).reshape(-1, 3)
        
        # Cluster the pixels
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get the most frequent cluster
        unique, counts = np.unique(kmeans.labels_, return_counts=True)
        dominant_cluster_index = unique[counts.argmax()]
        dominant_color = kmeans.cluster_centers_[dominant_cluster_index].astype(int)
        
        # We can return the RGB or a simplified color name
        return classify_color(dominant_color)
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return "unknown"

def classify_color(rgb_tuple):
    """
    A simple function to map an RGB value to a basic color name.
    In a real system, this would be more sophisticated.
    """
    colors = {
        "black": [0, 0, 0],
        "white": [255, 255, 255],
        "red": [255, 0, 0],
        "green": [0, 128, 0],
        "blue": [0, 0, 255],
        "khaki": [195, 176, 145],
        "grey": [128, 128, 128],
        "brown": [165, 42, 42]
    }
    
    min_dist = float('inf')
    closest_color = "unknown"
    
    for name, value in colors.items():
        dist = np.linalg.norm(np.array(rgb_tuple) - np.array(value))
        if dist < min_dist:
            min_dist = dist
            closest_color = name
            
    return closest_color

def classify_item_attributes(image_path):
    """
    *** MOCK FUNCTION ***
    In a real application, this function would use a trained Machine Learning model
    (e.g., a CNN classifier) to determine the item's category and style.
    Here, we'll just return a hardcoded value for our example.
    """
    # For this example, we assume the input is always a casual shirt.
    print(f"INFO: Simulating attribute classification for {image_path}")
    return {
        "category": "top",
        "style": "casual"
    }

# --- Step 2: Product Database & Fashion Rules ---

def load_product_database():
    """
    Creates a mock product database as a pandas DataFrame.
    In a real system, this would come from a database or a CSV file.
    """
    data = {
        'product_id': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112],
        'name': [
            'Classic Khaki Chinos', 'Black Denim Jeans', 'White Linen Trousers',
            'Grey Joggers', 'Brown Leather Loafers', 'White Sneakers',
            'Black Dress Shoes', 'Silver Chronograph Watch', 'Brown Leather Belt',
            'Red Scarf', 'Formal White Shirt', 'Sporty Green T-shirt'
        ],
        'category': [
            'bottom', 'bottom', 'bottom', 'bottom', 'shoes', 'shoes', 'shoes',
            'accessory', 'accessory', 'accessory', 'top', 'top'
        ],
        'color': [
            'khaki', 'black', 'white', 'grey', 'brown', 'white', 'black',
            'grey', 'brown', 'red', 'white', 'green'
        ],
        'style': [
            'casual', 'casual', 'formal', 'sporty', 'casual', 'casual', 'formal',
            'formal', 'casual', 'casual', 'formal', 'sporty'
        ]
    }
    return pd.DataFrame(data)

def get_recommendations(input_attributes, product_db):
    """
    The Core Rule Engine. Finds matching items based on predefined fashion rules.
    """
    input_cat = input_attributes['category']
    input_color = input_attributes['color']
    input_style = input_attributes['style']
    
    recommendations = []
    
    # 1. Define which categories to look for
    if input_cat == 'top':
        required_categories = ['bottom', 'shoes', 'accessory']
    elif input_cat == 'bottom':
        required_categories = ['top', 'shoes']
    else: # Default for shoes, accessories etc.
        return pd.DataFrame() # Or define other rules
        
    # 2. Define Color Harmony Rules
    color_rules = {
        'blue': ['khaki', 'white', 'black', 'grey', 'brown'],
        'red': ['black', 'white', 'khaki'],
        'black': ['white', 'grey', 'red'],
        'white': ['black', 'khaki', 'blue', 'grey'],
        'green': ['khaki', 'black', 'white'],
        # Add more rules as needed
    }
    
    # Get the allowed colors for the input item's color
    allowed_colors = color_rules.get(input_color, ['black', 'white', 'grey']) # Default to neutrals
    
    # 3. Filter the database based on the rules
    for category in required_categories:
        # Rule: Style must match
        # Rule: Category must be one of the required ones
        # Rule: Color must be in the allowed list
        
        filtered_items = product_db[
            (product_db['category'] == category) &
            (product_db['style'] == input_style) &
            (product_db['color'].isin(allowed_colors))
        ]
        
        if not filtered_items.empty:
            # For simplicity, we just pick the first match for each category
            recommendations.append(filtered_items.iloc[0])
            
    return pd.DataFrame(recommendations)


# --- Step 3: Main Execution ---

if __name__ == "__main__":
    # Create a dummy image for the example to work out-of-the-box
    # This will be our "blue shirt"
    try:
        blue_shirt_img = Image.new('RGB', (200, 200), color = (50, 100, 200)) # A shade of blue
        input_image_path = "redshirt.jpg"
        blue_shirt_img.save(input_image_path)
        print(f"Created a sample image: '{input_image_path}'")
        
    except Exception as e:
        print(f"Could not create dummy image. Please provide your own image. Error: {e}")
        exit()

    print("\n--- Starting Outfit Recommendation ---")
    
    # 1. Extract attributes from the input image
    input_attributes = classify_item_attributes(input_image_path)
    input_attributes['color'] = extract_dominant_color(input_image_path)
    
    print(f"\nInput Item Attributes: {input_attributes}")
    
    # 2. Load the product database
    product_db = load_product_database()
    
    # 3. Get recommendations based on the rules
    outfit_recommendations = get_recommendations(input_attributes, product_db)
    
    print("\n--- Here is your recommended outfit! ✨ ---")
    if not outfit_recommendations.empty:
        # Using .to_string() for better console formatting
        print(outfit_recommendations.to_string())
    else:
        print("Sorry, no matching items found for your item.")