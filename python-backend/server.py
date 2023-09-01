# Import necessary modules
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json

#create test data
data_entries = [{'username': 'Alex', 'password': 'test1'}, {'username': 'John', 'password': 'test2'}]

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


#create a /token api point
@app.route('/token', methods=["POST"])
def create_token():

    #get the username and password from the json request data 
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # Check if the provided username and password match any data entry
    for entry in data_entries:
        if entry['username'] == username and entry['password'] == password:

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


# Start the Flask application if this script is run directly
if __name__ == "__main__":
    app.run(debug=True)
