// Import required modules from React and React Router
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import components for different routes
import UploadStep1 from './UploadStep1';
import Nav from './Nav';
import Home from './Home';
import UploadStep2 from './UploadStep2';
import UploadStep3 from './UploadStep3';

// Define the main App component
const App = () => {
  return (
    <div>
      {/* Render the navigation bar */}
      <Nav />

      {/* Define the routing configuration */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Upload" element={<UploadStep1 />} />
        <Route path="/UploadStep2" element={<UploadStep2 />} />
        <Route path="/UploadStep3" element={<UploadStep3 />} />
      </Routes>
    </div>
  );
};

// Export the App component as the default export
export default App;
