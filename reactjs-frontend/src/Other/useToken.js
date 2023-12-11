import { useState } from 'react';

function useToken() {

    //define the function that retrieves the token from local storage
  function getToken() {
    const userToken = localStorage.getItem('token');

    //returns token is it exists or keeps it null
    return userToken && userToken
  }

  //sets the token state as getToken
  const [token, setToken] = useState(getToken());

  //define saveToken that saves the token in localstorage
  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  //defines the removeToken function that removes token from local storage
  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  //returns the tokens for use
  return {
    setToken: saveToken,
    token,
    removeToken
  }

}

export default useToken;