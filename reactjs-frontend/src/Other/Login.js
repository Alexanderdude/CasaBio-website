//import modules
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import './Login.css'; // Import the CSS file

function Login(props) {

  // State for reCAPTCHA
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  // reCAPTCHA onChange handler
  function handleRecaptchaChange(value) {
    setRecaptchaValue(value);
  }

  //sets the useState for the login details as blank strings
  const [loginForm, setloginForm] = useState({
    username: "",
    password: ""
  })

  //defines navigate for a successful login
  const navigate = useNavigate();

  //sets a variable to change the form if the user is registering
  const [isRegistering, setIsRegistering] = useState(false);

  //defines the dunction logMeIn
  function logMeIn(event) {

    // Check if reCAPTCHA is solved
    // if (!recaptchaValue) {
    //   alert("Please complete the reCAPTCHA.");
    //   return;
    // }

    //sends a POST request to the /token api using axios
    axios({
      method: "POST",
      url: "/token",

      //retrieve data from backend
      data: {
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
      password: ""
    }))

    //prevents the event to work if values are default
    event.preventDefault()
  }

  //handleChange event
  function handleChange(event) {

    // Destructure the 'value' and 'name' properties from the event target
    const { value, name } = event.target

    //update the form to replace the name value with the new name value
    setloginForm(prevNote => ({
      ...prevNote, [name]: value
    })
    )
  }

  //function to change the isRegistering variable 
  function handleToggleRegister() {
    setIsRegistering(!isRegistering);
  }

  function registerUser(event) {
    event.preventDefault();

    // Check if reCAPTCHA is solved
    if (!recaptchaValue) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    // Check if password and confirm password match
    if (loginForm.password !== loginForm.confirmPassword) {
      alert("Password and Confirm Password must match.");
      return;
    }

    // Prepare the user data for registration
    const userData = {
      username: loginForm.username,
      email: loginForm.email,
      password: loginForm.password,
      securityQuestion: loginForm.securityQuestion
    };

    // Send a POST request to your Flask /register endpoint
    axios({
      method: "POST",
      url: "/register",
      data: userData,
    })
      .then((response) => {
        // Handle the successful registration response, e.g., store the access token
        props.setToken(response.data.access_token);
        navigate('/profile');
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.msg); // Display the error message from the server
          return;
        }
      });

    // Toggles the registering values
    handleToggleRegister();

    // Reset the registration form
    setloginForm({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      securityQuestion: ""
    });
  }

  //defines the password strength variable and timer
  const [passwordStrength, setPasswordStrength] = useState('');
  const [timer, setTimer] = useState(null);

  //function that checks the password strength
  function checkPasswordStrength(password) {
    let strength = '';

    //displays the message if password is less than 8 in length
    if (password.length < 8) {
      strength = 'Password should be at least 8 characters long';
    }

    return strength;
  }

  //function that handles the password change
  function handlePasswordChange(event) {
    clearTimeout(timer); // Clear any existing timer
    const password = event.target.value;

    // Set a timer to update the password strength after a brief pause (e.g., 500ms)
    const newTimer = setTimeout(() => {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    }, 500);

    setTimer(newTimer);

    //handle the onchange event
    handleChange(event);
  }

  return (
    <div className='login-page'>
      <div className="centered">

        <br />

        {/* Displays Heading text based on Login or Registering */}
        <h1>{isRegistering ? 'REGISTER' : 'LOGIN'}</h1>

        {/* Creates the Login Form */}
        <form className="login">

          <div className="form-group">

            {/* Username Input field */}
            <label htmlFor="username">Username:</label>
            <input
              //Settings for the input box
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={loginForm.username}
            />
          </div>

          <div className="form-group">

            {/* Password Input field */}
            <label htmlFor="password">Password:</label>
            <input
              //Settings for the input box
              onChange={handlePasswordChange}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={loginForm.password}
            />
            {/* Checks if the user is registering or not */}
            {isRegistering && passwordStrength && (
              <div className="password-strength">
                {passwordStrength}
              </div>
            )}
          </div>

          {/* If the user is registering */}
          {isRegistering && (
            <>
              <div className="form-group">

                {/*  */}
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  //Settings for the input box
                  onChange={handleChange}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={loginForm.confirmPassword}
                />
              </div>

              <div className="form-group">

                {/* Email Input field */}
                <label htmlFor="email">Email:</label>
                <input
                  //Settings for the input box
                  onChange={handleChange}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={loginForm.email}
                />
              </div>

              <div className="form-group">

                {/* Question Input field */}
                <label htmlFor="securityQuestion">What is your reason for joining CASABIO:</label>
                {/* Use a textarea for securityQuestion */}
                <textarea
                  onChange={handleChange}
                  name="securityQuestion"
                  id="securityQuestion"
                  placeholder="Answer"
                  value={loginForm.securityQuestion}
                  rows={5}
                />
              </div>
            </>
          )}

          {/* reCAPTCHA */}
          <div className="form-group">
            <ReCAPTCHA
              sitekey="YOUR_RECAPTCHA_SITE_KEY"  //CHANGE WITH REAL KEY LATER STAGE
              onChange={handleRecaptchaChange}
            />
          </div>

          {/* Adds a button that has multiple functions if user is registering or not */}
          <button className='login-button' onClick={isRegistering ? registerUser : logMeIn}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className='login-text'>
          {/* Adds some text that asks the user if they have an account or not */}
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account yet?"}

          {/* Adds a button that toggles the registering variable */}
          <button className='login-button' onClick={handleToggleRegister}>
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;