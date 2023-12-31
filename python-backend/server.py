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
from fuzzywuzzy import fuzz

# Define your fuzzy search threshold (e.g., 60)
threshold = 60

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
db_profile = "profile"

try:
    signInDB = couch.create(db_signin)  # Create a new database
except couchdb.http.PreconditionFailed as e:
    signInDB = couch[db_signin]  # Access an existing database

try:
    informationDB = couch.create(db_information)  # Create a new database
except couchdb.http.PreconditionFailed as e:
    informationDB = couch[db_information]  # Access an existing database

try:
    profileDB = couch.create(db_profile)  # Create a new database
except couchdb.http.PreconditionFailed as e:
    profileDB = couch[db_profile]  # Access an existing database

# Create a Flask web application instance
app = Flask(__name__)

#configure the flask app with the secret key and assign it to variable jwt
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
jwt = JWTManager(app)

#sets the time to refresh the access token
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=4)

@app.after_request
def refresh_expiring_jwts(response):
    try:

        #Get the expiration timestamp from jwt
        exp_timestamp = get_jwt()["exp"]

        #get the current timestamp with the correct timezone
        now = datetime.now(timezone.utc)

        #calculate the target timestamp 
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

#create an API that receives information required for the uploadStep3 page
@app.route('/upload/information', methods=['GET'])
@jwt_required()
def recieve_information_data():
    username = request.args.get('username')
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

def save_image(username, imageData, image_id, images_directory):
    try:
        # Create a BytesIO object to work with the binary data
        image_buffer = io.BytesIO(imageData.read())

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

#create the /upload api point
@app.route('/upload', methods=['POST'])
@jwt_required()
def receive_image_data():
    try:
        #try recieve the data request
        data = request.form
        
        if not data: #display error message
            return jsonify({"error": "No data received"}), 400

        # Process and save specific fields as needed
        username = data.get("username")
        photographer = data.get("photographer")
        collector = data.get("collector")
        collection = data.get("collection")
        sciName = data.get("sciName")
        taxon = data.get('taxon')
        kingdom = data.get('kingdom')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        accuracy = data.get('accuracy')
        imageDate = data.get('date')
        country = data.get('country')
        province = data.get('province')
        city = data.get('city')
        preciseLocality = data.get('preciseLocality')
        mainImageID = data.get('mainImageID')
        extraImageIDs = data.get('extraImageID', [])
        tags = data.get('tags',{})
        subject = data.get('subject',{})
        
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
            "extraImageID": extraImageIDs,
            "tags": tags,
            "subject": subject
        }

        # Save the new document to the 'information' database
        informationDB.save(new_document)

        # Loop over each image file and call save_image function
        for image_key, image_file in request.files.items():
            # Extract the filename from the image_key
            _, filename = os.path.split(image_key)

            # Call save_image function with the username, image_file, and filename
            save_image(username, image_file, filename, images_directory)

        return jsonify({"message": "Data processed and saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/observation/get_image', methods=['GET'])
def get_image():
    try:
        # Get the username and image name from the params
        username = request.args.get('username')
        image_name = request.args.get('image_name')

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
    
#create a /logout api point
@app.route("/logout", methods=["POST"])
def logout():

    #display a successful logout response
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

#create a /profile api point with a jwt required decorator
@app.route('/profile', methods=["GET"])
@jwt_required()
def my_profile():

    # Extracts the username from the access token
    username = get_jwt_identity()

    # create a blank variable
    results=[]

    #cycles through each document with specific primary search fields and values
    for doc in profileDB.find({'selector': {"Username": username}}):
        
        # adds each doc to the variable
        results.append(doc)
    
    #returns the new variable
    return jsonify(results), 200

#create a /profile api point with a jwt required decorator
@app.route('/profile/public', methods=['GET'])
def public_profile():

    username = request.args.get('name')

    # create a blank variable
    results=[]

    #cycles through each document with specific primary search fields and values
    for doc in profileDB.find({'selector': {"Username": username}}):
        
        # adds each doc to the variable
        results.append(doc)
    
    #returns the new variable
    return jsonify(results), 200

# Create a /editProfile route
@app.route('/profile/edit', methods=['POST'])
@jwt_required()
def edit_profile():
    # Get the data from the request
    username = request.json.get('username')
    field = request.json.get('field')
    text = request.json.get('text')
    
    # Try to get the document with correct ID
    try:
        doc = profileDB.get(username)
        if doc:
        # Update and save the document
            doc[field] = text
            profileDB.save(doc)
            return '', 200
        else:
            return '', 404  # Document not found
    except Exception as e:
        print(f"Error retrieving document: {e}")
        return '', 500  # Return 500 for other errors

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

    new_user_Profile = {
        "Username": user_data['username'],
        "About": ''
    }
    
    doc_id, _ = signInDB.save(new_user_data)  # Save the document and get the generated document ID

    profileDB.save(new_user_Profile) # Save the respective profile page for use
    
    # Generate an access token for the new user
    access_token = create_access_token(identity=user_data['username'])
    response = {"access_token": access_token, "user_id": doc_id}
    
    return jsonify(response), 201  # Return a 201 (Created) status code

@app.route('/observation/search', methods=['GET'])
def search_database():
    try:
        # Get the pagination parameters from the request data
        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))

        # Extract the search criteria from the dictionary
        primary_searchTerm = request.args.get('primaryTerm') or ''
        primary_searchType = request.args.get('primaryType') or ''
        filter_searchTerm = request.args.get('filterTerm') or ''
        filter_searchType = request.args.get('filterType') or ''

        # Calculate the start and end index for pagination
        start_idx = (page - 1) * per_page

        # Check if primary_searchTerm is not provided
        if primary_searchTerm == '':

            # Query the view without specifying startkey and endkey
            primary_results = informationDB.view('my_design_doc/my_custom_view', include_docs=True, skip=start_idx, limit=per_page)
            
            # Cycle through the documents and save it to a variable
            results_blank=[row.doc for row in primary_results]

            #return values
            return jsonify(results_blank), 200
    

        # create a blank variable
        results=[]
        
        # Define the view name based on field_name
        view_name = f'{primary_searchType}/filter_by_field_start_letter'

        # Check the value of primary_searchType
        if primary_searchType == 'mainImageID':
            first_letter = primary_searchTerm[0]
        else:
            # get the first letter
            first_letter = primary_searchTerm[0].lower()

        # gets each document with first letter at specified field
        for doc in informationDB.view(view_name, include_docs=True, key=first_letter):
            
            # adds each doc to the variable
            results.append(doc.value)
        
        # Calculate similarity for each document's scientific name
        for doc in results:
            similarity = fuzz.token_sort_ratio(doc[primary_searchType], primary_searchTerm)
            doc['similarity'] = similarity

        # Filter documents based on the threshold
        filtered_results = [doc for doc in results if doc['similarity'] >= threshold]
        
        # Sort the filtered results from most accurate to least accurate
        filtered_results.sort(key=lambda doc: doc['similarity'], reverse=True)

        #check if filter term is not blank
        if filter_searchTerm != '':

            # Define an empty list to store the further filtered results
            further_filtered_results = []

            # Set a threshold for fuzzy matching
            fuzzy_threshold = 60  # Adjust the threshold as needed

            # Iterate through the already filtered results
            for doc in filtered_results:
                # Check if the filter_searchType matches the document's field
                if filter_searchType in doc:
                    # Check if the document's field contains the filter_searchTerm with a fuzzy match
                    if fuzz.partial_ratio(filter_searchTerm, doc[filter_searchType]) >= fuzzy_threshold:
                        # If the fuzzy match is above the threshold, add the document to further_filtered_results
                        further_filtered_results.append(doc)

            # Return the further filtered results
            return jsonify(further_filtered_results), 200

        else:

            #returns the new variable
            return jsonify(filtered_results), 200
            
    except Exception as e:
        # Handle any errors
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/ratings', methods=['POST'])
def star_ratings():
    # Get the data from the request
    doc_id = request.json.get('id')
    new_ratings = request.json.get('ratings')

    # Try to get the document with the correct ID
    try:
        doc = informationDB.get(doc_id)
        if doc:
            # Update the ratings field and save the document
            doc['ratings'] = new_ratings
            informationDB.save(doc)
            return '', 200
        else:
            return '', 404  # Document not found
    except Exception as e:
        print(f"Error updating document: {e}")
        return '', 500  # Return 500 for other errors

# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)