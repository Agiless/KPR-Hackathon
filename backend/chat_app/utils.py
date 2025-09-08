# chatbot_logic/utils.py

import google.generativeai as genai
from .setup import embedding_model, embeddings_collection, gemini_model, PROMPT_TEMPLATE

def get_chatbot_response(user_query):
    """
    Performs a vector search and generates a chatbot response.
    """
    try:
        # Get query embedding
        query_embedding = genai.embed_content(model=embedding_model, content=user_query)["embedding"]

        # Define the aggregation pipeline for vector search
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "mall",
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

        # Execute the pipeline and get the search results
        results = embeddings_collection.aggregate(pipeline)
        
        context_docs = []
        for r in results:
            context_docs.append(r["text"])
        
        context = "\n".join(context_docs)

        # Create the final prompt with the context and user query
        prompt = PROMPT_TEMPLATE.format(user_query=user_query, context=context)
        
        # Generate the response
        response = gemini_model.generate_content(prompt)
        
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return "Sorry, I am currently experiencing a technical issue. Please try again later."