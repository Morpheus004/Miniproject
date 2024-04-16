// Login.jsx

import React, { useState } from "react";
import axios from "axios";
import classes from './CSS/login.module.css';
import {jwtDecode} from "jwt-decode";
import {redirect, useNavigate} from "react-router-dom";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate=useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9000/login", {
        username,
        password,
      });

      console.log("login successful:", response.data);

      // Optionally, redirect to a new page or perform other actions upon successful signup
    } catch (error) {
      console.error("login failed:", error);
    }
  };

  // const handleSignupSubmit = (e) => {
  //   e.preventDefault();
  // };
  const [token,setToken]=useState("");

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
      setToken(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      if(token!="undefined"){
        localStorage.setItem('token',response.data.token);
        navigate(`/${decodedToken.role}`);
      }

      // Optionally, redirect to a new page or perform other actions upon successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  return (
    <div className={classes['LOGINPAGE']} style={{ height: "100vh" }}>   
      <div className={classes['container']}>
      <div className={classes['screen']}>
      <div className={classes['screen__content']}>
        <form
          className={classes['login']}
          onSubmit={isLoginMode ? handleLoginSubmit : handleSignupSubmit}
        >
          {!isLoginMode && (
            <div className={classes['login__field']}>
              <i className={classes['login__icon fas fa-user']}></i>
              <input
                type="text"
                className={classes['login__input']}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          {!isLoginMode && (
            <div className={classes['login__field']}>
              <i className={classes['login__icon fas fa-envelope']}></i>
              <input
                type="email"
                className={classes['login__input']}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          {isLoginMode && (
            <div className={classes['login__field']}>
              <i className={classes['login__icon fas fa-user']}></i>
              <input
                type="text"
                className={classes['login__input']}
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className={classes['login__field']}>
            <i className={classes['login__icon fas fa-lock']}></i>
            <input
              type="password"
              className={classes['login__input']}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLoginMode && (
            <div className={classes['login__field']}>
              <i className={classes['login__icon fas fa-user-graduate']}></i>
              <select
                className={classes['login__input']}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
          )}
          <button className={`${classes['button']} ${classes['login__submit']}`}>
            <span className={classes['button__text']}>
              {isLoginMode ? "Log In" : "Sign Up"} Now
            </span>
            <i className={classes['button__icon fas fa-chevron-right']}></i>
          </button>
        </form>
        <div className={classes['login-option']}>
          <p className={classes['login-opt']}>
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button onClick={toggleMode}>
            {isLoginMode ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
      <div className={classes['screen__background']}>
        <span className={`${classes['screen__background__shape']} ${classes['screen__background__shape4']}`}></span>
        <span className={`${classes['screen__background__shape']} ${classes['screen__background__shape3']}`}></span>
        <span className={`${classes['screen__background__shape']} ${classes['screen__background__shape2']}`}></span>
        <span className={`${classes['screen__background__shape']} ${classes['screen__background__shape1']}`}></span>
      </div>
    </div>
      </div>
    </div>

  );
}

export default Login;
