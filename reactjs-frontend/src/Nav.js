//import modules
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import axios from 'axios';

//Define the Nav component
const Nav = (props) => {

  //adds a function to logout/clear token
  function logMeOut() {

    //post method to /logout api
    axios({
      method: "POST",
      url:"/logout",
    })

    //if successful, clear the token
    .then((response) => {
      props.token()

    //if unsuccessful, display error messages
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

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
          <Link to="/browser" className={styles.link}>Browser</Link>
          {/* adds a clickable link that navigates to the Browser Page */}
          
        </li>
        <li>
          <Link to="/profile" className={styles.link}>Profile</Link>
          {/* adds a clickable link that navigates to the Browser Page */}
          
        </li>

        <li>
          {/* Add a "Logout" text that calls the logMeOut function when clicked */}
          <span className={styles.link} onClick={logMeOut}>
            Logout
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default Nav;