import React, { useState } from "react";
import axios from "axios";
import classes from './CSS/login.module.css'; // Import CSS module for styling
//import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import image1 from './nice.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {BACKEND_URL,FRONTEND_URL} from '../config.js'

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage(""); // Clear error message when switching modes
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BACKEND_URL+"/login", {
        username,
        password,
      });

      console.log("login successful:", response.data);

      try {
        const decodedToken = jwtDecode(response.data.token);
        console.log("Printing role through Token:", decodedToken.role);

        if (response.data.token !== "undefined") {
          localStorage.setItem("token", response.data.token);
          const expiration = new Date();
          expiration.setHours(expiration.getHours() + 1);
          localStorage.setItem('expiration', expiration.toISOString());
          navigate(`/${decodedToken.role}/home`);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setErrorMessage("Invalid login, please try again");
      }
    } catch (error) {
      console.error("login failed:", error);
      setErrorMessage("Login failed: " + (error.response?.data?.message || "User not found"));
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = BACKEND_URL+'/auth/google';
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BACKEND_URL+"/signup", {
        username,
        email,
        password,
        role,
      });

      console.log("Signup successful:", response.data);
      setToken(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      console.log("Printing role through Token:", decodedToken.role);

      if (token !== "undefined") {
        localStorage.setItem('token', response.data.token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        navigate(`/${decodedToken.role}/home`);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Signup failed: " + (error.response?.data?.message || "Please try again later."));
    }
  };

  return (
    <div className={classes['LOGINPAGE']} style={{ height: "100vh" }}>
      <div className={classes['animated-text-container']}>
        <div className={classes['animated-text']}>
          Student-Alumni Connect
          <div> Welcome to our Student-Alumni Network!</div>
        </div>
      </div>
      <div className={classes['animated-image-container']}>
        <img src={image1} alt="Student-Alumni Connect" className={classes['animated-image']} />
      </div>

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

              {/* Display error message if exists */}
              {errorMessage && (
                <p className={classes['error-message']}>{errorMessage}</p>
              )}
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
              <button type="button" onClick={handleGoogleLogin} className={classes['btnSecondary']}>
                <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
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



/*import React, { useState } from "react";
import axios from "axios";
import classes from './CSS/login.module.css'; // Import CSS module for styling
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import image1 from './nice.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {BACKEND_URL} from '../config.js'
function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BACKEND_URL+"/login", {
        username,
        password,
      });

      console.log("login successful:", response.data);

      try {
        const decodedToken = jwtDecode(response.data.token);
        console.log("Printing role through Token:", decodedToken.role);

        if (response.data.token !== "undefined") {
          localStorage.setItem("token", response.data.token);
          const expiration = new Date();
          expiration.setHours(expiration.getHours() + 1);
          localStorage.setItem('expiration', expiration.toISOString());
          navigate(`/${decodedToken.role}/home`);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle the error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error("login failed:", error);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = BACKEND_URL+'/auth/google';
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(BACKEND_URL+"/signup", {
        username,
        email,
        password,
        role,
      });

      console.log("Signup successful:", response.data);
      setToken(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      console.log("Printing role through Token:", decodedToken.role);

      if (token !== "undefined") {
        localStorage.setItem('token', response.data.token);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
        navigate(`/${decodedToken.role}/home`);
      }

      // Optionally, redirect to a new page or perform other actions upon successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className={classes['LOGINPAGE']}>
    <div className={classes['animated-text-container']}>
        <h1 className={classes['animated-text']}>
          Student-Alumni Connect
          <div>Welcome to our Student-Alumni Network!</div>
        </h1>
      </div>
      
      <div className={classes['animated-image-container']}>
  <img src={image1} alt="Student-Alumni Connect" className={classes['animated-image']} />
</div>

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
              <button type="button" onClick={handleGoogleLogin} className={classes['btnSecondary']}>
                    <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
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
*/
