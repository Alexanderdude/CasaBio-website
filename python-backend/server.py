# Import necessary modules
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json
import couchdb

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

#create the /information api point
@app.route('/information', methods=['POST'])
def receive_image_data():
    try:
        #try recieve the data request
        data = request.get_json()
        
        if not data: #display error message
            return jsonify({"error": "No data received"}), 400

        # Iterate through each entry in imageData
        for index, entry in enumerate(data):
            # Process and save specific fields as needed
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

             # Create a new document in the 'information' database
            new_document = {
                "photographer": photographer,
                "collector": collector,
                "collection": collection,
                "scientific Name": sciName,
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
                
            }

            # Save the new document to the 'information' database
            informationDB.save(new_document)

        return jsonify({"message": "Data processed and saved successfully"}), 200

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


# Create a /register api point for adding users
@app.route('/register', methods=["POST"])
def register_user():
    # Get user data from the JSON request data
    user_data = request.json

    # Ensure that the required fields are present in the request data
    if 'username' not in user_data or 'email' not in user_data or 'password' not in user_data:
        return {"msg": "Incomplete user data"}, 400

    # Check if the username already exists in the database
    for doc_id in signInDB:
        doc = signInDB[doc_id]
        #check if username is equal to a username in the database
        if 'username' in doc and doc['username'] == user_data['username']:
            return {"msg": "Username already exists"}, 400
        
    # Check if the email already exists in the database
    for doc_id in signInDB:
        doc = signInDB[doc_id]
        #check if email is equal to a email in the database
        if 'email' in doc and doc['email'] == user_data['email']:
            return {"msg": "Email already exists"}, 400

    # Add the new user data to the database
    new_user_id = signInDB.save(user_data)

    # Generate an access token for the new user
    access_token = create_access_token(identity=user_data['username'])
    response = {"access_token": access_token, "user_id": new_user_id}
    
    return response, 201  # Return a 201 (Created) status code


# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)
