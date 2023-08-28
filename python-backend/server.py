# Import necessary modules
from flask import Flask, request, jsonify
from pymongo import MongoClient

# Define the MongoDB cluster connection string
cluster = "mongodb://localhost:27017"
#start at brew services start mongodb/brew/mongodb-community
#stop at brew services stop mongodb/brew/mongodb-community


# Create a MongoDB client instance
client = MongoClient(cluster)

# Access the "CasaTest" database
db = client['CasaTest']

# Access the "Signin" signInDB within the database
signInDB = db['Signin']

# Create a Flask web application instance
app = Flask(__name__)

# Define a route for the "/signin" endpoint this hasnt been implemented properly yet
@app.route("/signin")
def members():
    # Retrieve the 'Name' field from all documents in the signInDB
    Names = [doc['Name'] for doc in signInDB.find({}, {'_id': 0, 'Name': 1})]

    # Join the retrieved names into a string and return as a response
    return '\n'.join(Names)

# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)
