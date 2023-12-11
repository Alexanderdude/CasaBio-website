//import modules
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Nav.module.css';
import axios from 'axios';

//Define the Nav component
const Nav = (props) => {

  const navigate = useNavigate();

  //adds a function to logout/clear token
  function logMeOut() {

    //post method to /logout api
    axios({
      method: "POST",
      url: "/logout",
    })

      //if successful, clear the token
      .then((response) => {
        props.tokenProps.removeToken()
        alert('You have successfuly logged out');

        //if unsuccessful, display error messages
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  }

  //trigger the use Effect each time a page has changed
  useEffect(() => {
    checkTokenExpiration();
    // eslint-disable-next-line
  }, [navigate]);

  const checkTokenExpiration = () => {
    const token = props.tokenProps.token;

    if (!token) {
      // No token, consider as expired
      logoutUser();
      return;
    }

    // decode the token as a variable
    const decodedToken = decodeToken(props.tokenProps.token);

    if (!decodedToken || !decodedToken.exp) {
      // Unable to decode token or no expiration time, consider as expired
      logoutUser();
      return;
    }

    // check if token has expired
    const isExpired = decodedToken.exp < Date.now() / 1000;

    if (isExpired) {
      // Token is expired, log the user out
      logoutUser();
    }
  };

  // decode the token for ease of use
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const logoutUser = () => {
    //post method to /logout api without alert
    axios({
      method: "POST",
      url: "/logout",
    })

      //if successful, clear the token
      .then((response) => {
        props.tokenProps.removeToken()

        //if unsuccessful, display error messages
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
      })
  };

  return (
    <nav className={styles.nav}>
      {/* adds correct styles to nav component */}

      <ul className={styles.ul}>
        {/* adds correct styles to the ul component */}

        <li>
          <Link to="/" className={styles.link}>Home</Link>
          {/* adds a clickable link that navigates to the Home Page */}

        </li>
        <li>
          <Link to="/upload" className={styles.link}>Upload</Link>
          {/* adds a clickable link that navigates to the Upload Page */}

        </li>
        <li>
          <Link to="/browse" className={styles.link}>Browser</Link>
          {/* adds a clickable link that navigates to the Browser Page */}

        </li>
        <li>
          <Link to="/profile" className={styles.link}>Profile</Link>
          {/* adds a clickable link that navigates to the Browser Page */}

        </li>

        <li>
          {/* Conditionally render "SignIn" or "Logout" based on the presence of the token */}
          {props.tokenProps.token ? (
            <span className={styles.logout} onClick={logMeOut}>
              Logout
            </span>
          ) : (
            <Link to="/login" className={styles.link}>
              SignIn
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Nav;