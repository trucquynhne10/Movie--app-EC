import pandas as pd
from fuzzywuzzy import fuzz
from surprise import SVD, Reader, Dataset
from pathlib import Path
from flask import Flask, request, jsonify
import json
from pymongo import MongoClient

def db_connection():
    uri = "mongodb+srv://movie:Trucquynh@cluster0.h1patwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri)
    return client

film_id_to_title = []
film_id_to_genre = []
collectedData = []
film_data = []

def get_data():
    global film_id_to_title, film_id_to_genre, collectedData, film_data
    client = db_connection()
    db = client["test"] 
    collection = db["films"] 
    collectionRating = db["rating"]
    documents = collection.find()
    
    film_data = pd.DataFrame(documents)
    rating = pd.DataFrame(collectionRating.find())
    film_data = film_data[["id", "title", "overview", "vote_average", "genre_names"]]

    df_exploded = rating.explode("Rating")

    ratingUser = pd.concat(
        [df_exploded.drop(columns=["Rating"]), df_exploded["Rating"].apply(pd.Series)],
        axis=1,
    )
    ratingUser=ratingUser.drop(columns=["_id"])
    ratingUser.rename(columns={"FilmId":"id"}, inplace = True)
    collectedData =  pd.merge(film_data, ratingUser[['UserId', 'Score', 'id']], on='id', how='right')

    # Create a mapping for FilmId to Title and Genre
    film_id_to_title = dict(zip(film_data['id'], film_data['title']))
    film_id_to_genre = dict(zip(film_data['id'], film_data['genre_names']))


# Train the SVD model
def train_svd_model():
    """Train the SVD model on user ratings."""
    reader = Reader(rating_scale=(1, 10))
    dataset = Dataset.load_from_df(collectedData[['UserId', 'id', 'Score']], reader)
    trainset = dataset.build_full_trainset()
    algo = SVD()
    algo.fit(trainset)
    print("Model training completed!")
    return algo

# Get popular unwatched films
def get_popular_unwatched_films(user_id, top_n=50):
    """Retrieve popular films not yet rated by the user."""
    watched_films = collectedData[collectedData['UserId'] == user_id]['id'].unique()
    popular_films = film_data[~film_data['id'].isin(watched_films)]['id'].tolist()
    return popular_films[:top_n]


app = Flask(__name__)

# Recommendation system functions
@app.route("/predictSVD", methods = ["GET"])
def recommend_films():
    """Recommend films for a user based on SVD predictions."""
    get_data()
    user_id = request.args.get("user_id")

    film_ids =  get_popular_unwatched_films(user_id)[:50]
    algo = train_svd_model()
    predictions = []
    for film_id in film_ids:
        pred = algo.predict(user_id, film_id)
        predictions.append((film_id, pred.est))
    predictions.sort(key=lambda x: x[1], reverse=True)
    return jsonify(predictions[:10])

@app.route("/similarFilms", methods = ["GET"])
def get_similar_films():
    
    get_data()

    """Find similar films based on title and genre similarity."""
    film_id = int(request.args.get("id"))
    selected_film_title = request.args.get("title")
    selected_film_genre_json = request.args.get("genre_names")
    selected_film_genre = json.loads(selected_film_genre_json)
    
    similar_films = []
    for other_id, other_title in film_id_to_title.items():
        if other_id == film_id:
            continue
        # Calculate similarity
        title_similarity = fuzz.ratio(selected_film_title, other_title)
        genre_similarity = fuzz.token_sort_ratio(selected_film_genre, film_id_to_genre.get(other_id, ""))
        total_similarity = title_similarity + genre_similarity
        similar_films.append((other_id, other_title, total_similarity))
    
    # Sort and return the top 12 most similar films
    similar_films.sort(key=lambda x: x[2], reverse=True)
    return jsonify(similar_films[:12])


# Example usage
if __name__ == "__main__":
    app.run(debug=True, port=5002)