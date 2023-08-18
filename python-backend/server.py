# Import necessary modules
from flask import Flask, request, jsonify
from pymongo import MongoClient

# Define the MongoDB cluster connection string
cluster = "mongodb://localhost:27017"

# Create a MongoDB client instance
client = MongoClient(cluster)

# Access the "CasaTest" database
db = client['CasaTest']

# Access the "Signin" collection within the database
collection = db['Signin']

# Create a Flask web application instance
app = Flask(__name__)

# Define a route for the "/signin" endpoint this hasnt been implemented properly yet
@app.route("/signin")
def members():
    # Retrieve the 'Name' field from all documents in the collection
    Names = [doc['Name'] for doc in collection.find({}, {'_id': 0, 'Name': 1})]

    # Join the retrieved names into a string and return as a response
    return '\n'.join(Names)

# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)
