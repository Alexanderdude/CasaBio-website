//import modules
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login(props) {

    //sets the useState for the login details as blank strings
    const [loginForm, setloginForm] = useState({
      username: "",
      password: ""
    })

    //defines navigate for a successful login
    const navigate = useNavigate();

    //defines the dunction logMeIn
    function logMeIn(event) {

        //sends a POST request to the /token api using axios
      axios({
        method: "POST",
        url:"/token",

        //retrieve data from backend
        data:{
          username: loginForm.username,
          password: loginForm.password
         }
      })

      //iff successful then navigate to profile and set the token as the accesstoken
      .then((response) => {
        props.setToken(response.data.access_token)
        navigate('/profile');

        //if unseccessful then display error messages
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })

      //sets the loginForm to blank strings
      setloginForm(({
        username: "",
        password: ""}))

        //prevents the event to work if values are default
      event.preventDefault()
    }

    //handleChange event
    function handleChange(event) { 

        // Destructure the 'value' and 'name' properties from the event target
      const {value, name} = event.target

      //update the form to replace the name value with the new name value
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}

    return (
      <div>
        {/* basic login page to be updated */}

        <h1>Login</h1>

        {/* Input fields */}
          <form className="login">

            {/* handleChange event */}
            <input onChange={handleChange} 
                  type="username"
                  text={loginForm.username} 
                  name="username" 
                  placeholder="Username" 
                  value={loginForm.username} />


            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Password" 
                  value={loginForm.password} />

            {/* Button to handle the logMeIn function when clicked */}
          <button onClick={logMeIn}>Submit</button>
        </form>
      </div>
    );
}

export default Login;