// Login.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
  };

  // const handleSignupSubmit = (e) => {
  //   e.preventDefault();
  // };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9000/signup", {
        username,
        email,
        password,
        role,
      });

      console.log("Signup successful:", response.data);

      // Optionally, redirect to a new page or perform other actions upon successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="screen">
      <div className="screen__content">
        <form
          className="login"
          onSubmit={isLoginMode ? handleLoginSubmit : handleSignupSubmit}
        >
          {!isLoginMode && (
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          {!isLoginMode && (
            <div className="login__field">
              <i className="login__icon fas fa-envelope"></i>
              <input
                type="email"
                className="login__input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          {isLoginMode && (
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="login__field">
            <i className="login__icon fas fa-lock"></i>
            <input
              type="password"
              className="login__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLoginMode && (
            <div className="login__field">
              <i className="login__icon fas fa-user-graduate"></i>
              <select
                className="login__input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
          )}
          <button className="button login__submit">
            <span className="button__text">
              {isLoginMode ? "Log In" : "Sign Up"} Now
            </span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
        </form>
        <div className="login-option">
          <p className="login-opt">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button onClick={toggleMode}>
            {isLoginMode ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
      <div className="screen__background">
        <span className="screen__background__shape screen__background__shape4"></span>
        <span className="screen__background__shape screen__background__shape3"></span>
        <span className="screen__background__shape screen__background__shape2"></span>
        <span className="screen__background__shape screen__background__shape1"></span>
      </div>
    </div>
  );
}

export default Login;
