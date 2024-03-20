import React from 'react';

const SuccessfulLogin = ({ username }) => {
  return (
    <div className="successful-login">
      <h2>Welcome, {username}!</h2>
      <p>You have successfully logged in.</p>
      {/* Add any additional content or features as needed */}
    </div>
  );
}

export default SuccessfulLogin;
