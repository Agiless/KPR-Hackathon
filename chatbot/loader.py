import json

# Your JSON file should be in the same directory as your script
file_path = 'stores.json'
file_path1 = 'products.json'

# Use a 'with' statement for safe file handling
with open(file_path, 'r') as file:
    # Use json.load() to parse the file object
    data = json.load(file)
with open(file_path1, 'r') as file1:
    # Use json.load() to parse the file object
    data1 = json.load(file1)
# The 'data' variable now contains the content of the JSON file as a Python object
print(len(data),len(data1))



# You can access elements just like you would with a dictionary or list
# print(data['name'])
# print(data['items'][0])