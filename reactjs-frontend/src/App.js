// Import required modules from React and React Router
import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';

// Import components for different routes
import UploadStep1 from './UploadStep1';
import Nav from './Nav';
import Home from './Home';
import UploadStep2 from './UploadStep2';
import UploadStep3 from './UploadStep3';
import useToken from './useToken';
import Login from './Login';
import Profile from './Profile';
import Browser from './Browser';

// Define the main App component
const App = () => {

  //Destructure functions and values from the useToken component
  const { token, removeToken, setToken } = useToken();

  return (
    <div>
      {/* Render the navigation bar */}
      <Nav token={removeToken}/>

      {/* Define the routing configuration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* navigate to login page if token has not been set */}
        <Route path="/profile" element={token ? <Profile token={token} setToken={setToken} /> : <Navigate to="/login" />}/>
        <Route path="/upload" element={<UploadStep1/>}/>
        <Route path="/uploadStep2" element={token ? <UploadStep2 token={token} setToken={setToken} /> : <Navigate to="/login" />}/>
        <Route path="/uploadStep3" element={token ? <UploadStep3 token={token} setToken={setToken} /> : <Navigate to="/login" />}/>
        <Route path="/browse" element={<Browser />}/>
      </Routes>
    </div>
  );
};

// Export the App component as the default export
export default App;
