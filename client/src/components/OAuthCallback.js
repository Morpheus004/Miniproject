// client/src/components/OAuthCallback.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
          throw new Error('No token received');
        }

        // Decode and validate token
        const decodedToken = jwtDecode(token);
        
        // Validate token expiration
        if (decodedToken.exp * 1000 < Date.now()) {
          throw new Error('Token has expired');
        }

        // Store token and expiration
        localStorage.setItem('token', token);
        const expiration = new Date(decodedToken.exp * 1000);
        localStorage.setItem('expiration', expiration.toISOString());

        // Store user data
        localStorage.setItem('userData', JSON.stringify({
          uid: decodedToken.uid,
          email: decodedToken.email,
          role: decodedToken.role,
          name: decodedToken.name
        }));

        // Redirect based on role
        switch (decodedToken.role) {
          case 'student':
            navigate('/student/home', { replace: true });
            break;
          case 'alumni':
            navigate('/alumni/home', { replace: true });
            break;
          default:
            throw new Error('Invalid user role');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login', { 
          replace: true,
          state: { error: error.message }
        });
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing Login...</h2>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default OAuthCallback;