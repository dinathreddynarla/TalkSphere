// src/components/NotFound.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');  // Redirect to the homepage
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px',
        background: 'linear-gradient(to right, #E9F5F2, #f5f5f5)',
        height: '100vh',  // Full height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#2D6A4F',
      }}
    >
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          color: '#2D6A4F', // Logo color
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '2rem',
          color: '#2D6A4F',
          margin: '20px 0',
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '600px',
          textAlign: 'center',
          color: '#2D6A4F',
          marginBottom: '30px',
        }}
      >
        Oops! The page you're looking for doesn't exist or may have been removed. But don't worry, you can always go back to the homepage.
      </p>
      <Button
        type="primary"
        onClick={handleGoHome}
        style={{
          backgroundColor: '#2D6A4F',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          fontSize: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s, transform 0.3s',
        }}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
