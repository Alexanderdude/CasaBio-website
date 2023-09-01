//import modules
import { useState } from 'react'
import axios from "axios";

//Profile page
function Profile(props) {

    //define variables
    const [profileData, setProfileData] = useState(null)

    //define function to get data from backend
    function getData() {

        //use axios to send a GET request at /profile
        axios({
            method: "GET",
            url: "/profile",
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            //if successful then setProfileData
            .then((response) => {
                const res = response.data

                //Check if 'access_token' exists in the response and update the token if available
                res.access_token && props.setToken(res.access_token)

                //setProfileData based on the response(profile name and the about me)
                setProfileData(({
                    profile_name: res.name,
                    about_me: res.about
                }))

            //if unsuccessful then display error messages
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    return (

        //create a basic profile page to be updated at a later stage
        <div className="Profile">

            <p>To get your profile details: </p><button onClick={getData}>Click me</button>
            {profileData && <div>
                <p>Profile name: {profileData.profile_name}</p>
                <p>About me: {profileData.about_me}</p>
            </div>
            }

        </div>
    );
}

export default Profile;
