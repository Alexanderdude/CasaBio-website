# Import necessary modules
from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json
import couchdb
import os
import io
from PIL import Image
from io import BytesIO
import base64
import imagecodecs
# Copyright notice and license information for imagecodecs/_jpegxl.pyx
# This code is part of the imagecodecs package (https://github.com/your-username/imagecodecs).
# Copyright (c) 2021-2023, Christoph Gohlke
# All rights reserved. Licensed under the BSD 3-Clause License.
import numpy as np

# get the current directory of the python app
current_directory = os.getcwd()

# Define the save_path
images_directory = os.path.join(current_directory, 'Images')

if not os.path.exists(images_directory):
    os.makedirs(images_directory)

#connect to couchDB server(change location to actual server)
couch = couchdb.Server("http://localhost:5984")

# Define CouchDB admin credentials
couch_username = "admin"  # Replace with the CouchDB admin username
couch_password = "casaAdmin"  # Replace with the CouchDB admin password

# Authenticate with CouchDB
couch.resource.credentials = (couch_username, couch_password)

db_signin = "signin"  #Get the database name database
db_information = "information"

try:
    signInDB = couch.create(db_signin)  # Create a new database
except couchdb.http.PreconditionFailed as e:
    signInDB = couch[db_signin]  # Access an existing database

try:
    informationDB = couch.create(db_information)  # Create a new database
except couchdb.http.PreconditionFailed as e:
    informationDB = couch[db_information]  # Access an existing database

# Create a Flask web application instance
app = Flask(__name__)

#configure the flask app with the secret key and assign it to variable jwt
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
jwt = JWTManager(app)

#sets the time to refresh the access token
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

@app.after_request
def refresh_expiring_jwts(response):
    try:

        #Get the expiration timestamp from jwt
        exp_timestamp = get_jwt()["exp"]

        #get the current timestamp with the correct timezone
        now = datetime.now(timezone.utc)

        #calculate the target timestamp 30mins into the future
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

        #checks if target is greater than the expire timestamp
        if target_timestamp > exp_timestamp:

            #generate a new access token with identifier from jwt
            access_token = create_access_token(identity=get_jwt_identity())

            #get the response json data
            data = response.get_json()

            #checks if the data is a dictionary
            if type(data) is dict:

                #adds a new access token to response data
                data["access_token"] = access_token 
                response.data = json.dumps(data)

        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    
#create an API that receives information required for the uploadStep3 page
@app.route('/informationStep3', methods=['POST'])
def recieve_information_data():
    requested_data = request.get_json()
    username = requested_data['username']
    # Initialize lists to hold unique collectors, collections, and photographers
    unique_collectors = []
    unique_collections = []
    unique_photographers = []

    # Query the CouchDB database for documents with the specified username
    for doc in informationDB.find({'selector': {'username': username}}):
        collectors = doc['collectors']
        collections = doc['collections']
        photographers = doc['photographers']

        # Add unique collectors to the list
        if collectors not in unique_collectors:
            unique_collectors.append(collectors)

        # Add unique collections to the list
        if collections not in unique_collections:
            unique_collections.append(collections)

        # Add unique photographers to the list
        if photographers not in unique_photographers:
            unique_photographers.append(photographers)

    # Create a dictionary to hold the unique data
    unique_data = {
        "collectors": unique_collectors,
        "collections": unique_collections,
        "photographers": unique_photographers
    }

    return jsonify(unique_data), 200

def save_base64_image(username, image_id, base64_data, images_directory):
    try:
        # Decode the base64 data
        image_data = base64.b64decode(base64_data)

        # Create a BytesIO object to work with the binary data
        image_buffer = io.BytesIO(image_data)

        # Open the image using PIL
        image = Image.open(image_buffer)

        # Convert the PIL image to an RGB array
        rgb_data = np.array(image)

        # Create a directory if it doesn't exist
        user_directory = os.path.join(images_directory, username)
        os.makedirs(user_directory, exist_ok=True)

        # Construct the file path with a .jxl extension
        image_path = os.path.join(user_directory, f"{image_id}.jxl")

        # Encode the RGB data as JXL and save it as a JXL file
        jxl_data = imagecodecs.jpegxl_encode(rgb_data)
        with open(image_path, "wb") as jxl_file:
            jxl_file.write(jxl_data)
    except Exception as e:
        return False, str(e)

#create the /information api point
@app.route('/information', methods=['POST'])
def receive_image_data():
    try:
        #try recieve the data request
        data = request.get_json()
        
        if not data: #display error message
            return jsonify({"error": "No data received"}), 400

        # Iterate through each entry in imageData
        for entry in data:
            # Process and save specific fields as needed
            username = entry.get("username")
            photographer = entry.get("photographer")
            collector = entry.get("collector")
            collection = entry.get("collection")
            sciName = entry.get("sciName")
            taxon = entry.get('taxon')
            kingdom = entry.get('kingdom')
            latitude = entry.get('latitude')
            longitude = entry.get('longitude')
            accuracy = entry.get('accuracy')
            imageDate = entry.get('date')
            country = entry.get('country')
            province = entry.get('province')
            city = entry.get('city')
            preciseLocality = entry.get('preciseLocality')
            mainImageID = entry.get('mainImageID')
            mainImage = entry.get('mainImage')
            extraImages = entry.get('extraImage', [])
            extraImageIDs = entry.get('extraImageID', [])
            
             # Create a new document in the 'information' database
            new_document = {
                "username": username,
                "photographers": photographer,
                "collectors": collector,
                "collections": collection,
                "scientific_name": sciName,
                "taxon": taxon,
                "kingdom": kingdom,
                "latitude": latitude,
                "longitude": longitude,
                "accuracy": accuracy,
                "imageDate": imageDate,
                "country": country,
                "province": province,
                "city": city,
                "preciseLocality": preciseLocality,
                "mainImageID": mainImageID,
                "extraImageID": extraImageIDs
            }

            # Save the new document to the 'information' database
            informationDB.save(new_document)

            save_base64_image(username,mainImageID,mainImage,images_directory)

            if extraImages and extraImageIDs:
                for i in range(len(extraImages)):
                    if extraImages[i] and extraImageIDs[i]:
                        save_base64_image(username, extraImageIDs[i], extraImages[i], images_directory)

                        
        return jsonify({"message": "Data processed and saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_image', methods=['POST'])
def get_image():
    try:
        imageData= request.get_json()
        # Get the username and image name from the request
        username = imageData['username']
        image_name = imageData['image_name']

        # Construct the path to the image
        image_path = os.path.join(images_directory, username, f"{image_name}.jxl")

        # Check if the image exists
        if os.path.exists(image_path):
            # Send the image back to the frontend
            return send_from_directory(os.path.dirname(image_path), os.path.basename(image_path))
        else:
            return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#create a /token api point
@app.route('/token', methods=["POST"])
def create_token():

    #get the username and password from the json request data 
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Query the view for the username and password combination
    result = signInDB.view('auth/Auth', key=[username, password])

    # Check if a matching entry is found in the view
    if result:
        # If a matching entry is found, generate an access token
        access_token = create_access_token(identity=username)
        response = {"access_token": access_token}
        return response

    # If no matching entry is found, return an error
    return {"msg": "Wrong username or password"}, 401

#create a /logout api point
@app.route("/logout", methods=["POST"])
def logout():

    #display a successful logout response
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

#create a /profile api point with a jwt required decorator
@app.route('/profile')
@jwt_required()
def my_profile():

    #data retrieved
    response_body = {
        "name": "Alex",
        "about" :"Successful login page"
    }

    return response_body


@app.route('/register', methods=["POST"])
def register_user():
    user_data = request.json

    # Ensure that the required fields are present in the request data
    if 'username' not in user_data or 'email' not in user_data or 'password' not in user_data:
        return jsonify({"msg": "Incomplete user data"}), 400  # Return a 400 (Bad Request) status code

    # Check if the username already exists in the database
    for doc_id in signInDB:
        doc = signInDB[doc_id]
        if 'username' in doc and doc['username'] == user_data['username']:
            return jsonify({"msg": "Username already exists"}), 409  # Return a 409 (Conflict) status code

    # Check if the email already exists in the database
    for doc_id in signInDB:
        doc = signInDB[doc_id]
        if 'email' in doc and doc['email'] == user_data['email']:
            return jsonify({"msg": "Email already exists"}), 409  # Return a 409 (Conflict) status code

    # Add the new user data to the database with an auto-generated document ID
    new_user_data = {
        "username": user_data['username'],
        "email": user_data['email'],
        "password": user_data['password'],
        "securityQuestion": user_data['securityQuestion']
    }
    
    doc_id, _ = signInDB.save(new_user_data)  # Save the document and get the generated document ID

    # Generate an access token for the new user
    access_token = create_access_token(identity=user_data['username'])
    response = {"access_token": access_token, "user_id": doc_id}
    
    return jsonify(response), 201  # Return a 201 (Created) status code

@app.route('/search', methods=['POST'])
def search_database():
    try:
        # Get the search criteria and pagination parameters from the request data
        search_criteria = request.json
        page = search_criteria['page']
        per_page = search_criteria['per_page']

        # Extract the search criteria from the dictionary
        primary_searchTerm = search_criteria['primaryTerm']
        primary_searchType = search_criteria['primaryType']
        filter_searchTerm = search_criteria['filterTerm']
        filter_searchType = search_criteria['filterType']

        # Calculate the start and end index for pagination
        start_idx = (page - 1) * per_page

        # Check if primary_searchTerm is not provided
        if primary_searchTerm == '':

            #create a new blank variable
            results_blank=[]

            # retrieve from all documents in couchDB between the pagination values
            primary_results = informationDB.view('_all_docs', include_docs=True, skip=start_idx, limit=per_page)
            
            # Cycle through the documents and save it to a variable
            results_blank=[row.doc for row in primary_results]

            #return values
            return jsonify(results_blank), 200
        
        # Checks if filter term is blank
        if filter_searchTerm == '':

            # create a blank variable
            results=[]

            #cycles through each document with specific primary search fields and values
            for doc in informationDB.find({'selector': {primary_searchType: primary_searchTerm}, 'skip':start_idx, 'limit':per_page}):
                
                # adds each doc to the variable
                results.append(doc)
            
            #returns the new variable
            return jsonify(results), 200

        # If there are filter search criteria, narrow down the results
        if filter_searchTerm != '':

            #creates a blank filter variable
            results_filter=[]

            #cycles through each document with a specific primary and filter field and value
            for doc in informationDB.find({'selector': {primary_searchType: primary_searchTerm, filter_searchType:filter_searchTerm}, 'skip':start_idx, 'limit':per_page}):
                
                # adds the values to the variable
                results_filter.append(doc)

            #returns the variable 
            return jsonify(results_filter), 200
            
        

    except Exception as e:
        # Handle any errors
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)
