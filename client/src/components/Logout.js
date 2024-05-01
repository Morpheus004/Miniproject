import React from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css'; // Import CSS for styling

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token and expiration date from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');

    // Redirect the user to the login page
    navigate('/login');
  };

  return (
    <bodylogout>
    <div className="logout-background">
      <div className="logout-container">
        <div className="logout-content">
          <h1 className="logout-heading">Are you sure you want to logout?</h1>
          <div className="button-container">
            <button className="button logout-button" onClick={handleLogout}>Logout</button>
            <button className="button stay-button" onClick={() => navigate('/')}>Stay</button>
          </div>
        </div>
      </div>
    </div>
    </bodylogout>
  );
};

export default Logout;
