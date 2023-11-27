import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import UploadStep1 from './UploadStep1';
import Nav from './Nav';
import Home from './Home';
import UploadStep2 from './UploadStep2';
import UploadStep3 from './UploadStep3';
import useToken from './useToken';
import Login from './Login';
import Profile from './Profile';
import Browser from './Browser';
import ObservationPage from './observationView'; // Note the corrected import
import NotFound from './NotFound';
import FieldGuide from './Fieldguide';
import IndividualFieldGuide from './IndivFieldGuide';
import PublicProfile from './PublicProfile'

const App = () => {
  const { token, removeToken, setToken } = useToken();

  const tokenProps = {
    token,
    removeToken,
    setToken,
  };

  return (
    <div>
      <Nav tokenProps={tokenProps} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/profile"
          element={token ? <Profile token={token} setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route path="/upload" element={token ? <UploadStep1 token={token} setToken={setToken} /> : <Navigate to="/login" />} />
        <Route
          path="/uploadStep2"
          element={token ? <UploadStep2 token={token} setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route
          path="/uploadStep3"
          element={token ? <UploadStep3 token={token} setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route path="/browse" element={<Browser />} />
        <Route path="/observation/:observationID" element={<ObservationPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/fieldGuide" element={<FieldGuide />} />
        <Route path="/fieldGuide/:speciesName" element={<IndividualFieldGuide />} />
        <Route path='/profile/:name' element={<PublicProfile />} />
      </Routes>
    </div>
  );
};

export default App;
