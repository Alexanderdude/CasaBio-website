import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UploadStep1 from './UploadSteps/UploadStep1';
import Nav from './Other/Nav';
import Home from './Other/Home';
import UploadStep2 from './UploadSteps/UploadStep2';
import UploadStep3 from './UploadSteps/UploadStep3';
import useToken from './Other/useToken';
import Login from './Other/Login';
import Profile from './Profiles/Profile';
import Browser from './BrowseSteps/Browser';
import ObservationPage from './BrowseSteps/ObservationView';
import NotFound from './Other/NotFound';
import FieldGuide from './BrowseSteps/Fieldguide';
import IndividualFieldGuide from './BrowseSteps/IndivFieldGuide';
import PublicProfile from './Profiles/PublicProfile'

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
