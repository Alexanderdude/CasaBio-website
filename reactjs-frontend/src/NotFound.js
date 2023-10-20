import React from 'react';

const NotFound = () => {
  const notFoundStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyles = {
    fontSize: '3rem',
    marginBottom: '20px',
  };

  const messageStyles = {
    fontSize: '1.5rem',
  };

  return (
    <div style={notFoundStyles}>
      <h1 style={headerStyles}>Page Not Found</h1>
      <p style={messageStyles}>The page you are looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
