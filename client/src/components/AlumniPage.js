import React, { useState, useEffect } from "react";
import './StudentPage.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUserFriends, faUserGraduate } from '@fortawesome/free-solid-svg-icons'; // Import solid icons
import { faInstagram, faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Import brand icons
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'; // Import solid icons
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Import solid icons

import backgroundImage from './bg.jpg';
import image1 from './carousel-image-1.jpg.jpeg'; // Import carousel image 1
import image2 from './carousel-image-2.jpg.jpeg'; // Import carousel image 2
import image3 from './carousel-image-3.jpg.jpeg'; // Import carousel image 3

function AlumniPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("black");

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [currentIndex]); // Run useEffect when currentIndex changes

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        paddingTop: "70px", // Add space above for navbar
        color: selectedColor,
      }}
    >
      <div className="content">
        <h1 className="main-title">Alumni Network</h1>
        <p className="main-description">
          Connecting alumni with each other and with current students for mentorship and networking.
        </p>
        <div className="features">
          <div className="feature">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            <h2 className="feature-title">Upcoming Events</h2>
            <p className="feature-description">
              Explore upcoming events organized by the alumni network. Attend seminars, workshops, and networking sessions.
            </p>
            <button className="button primary">View Events</button>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUserFriends} className="icon" />
            <h2 className="feature-title">Connect with Alumni</h2>
            <p className="feature-description">
              Connect with fellow alumni from your institution. Reconnect with old friends and expand your professional network.
            </p>
            <button className="button primary">Find Alumni</button>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUserGraduate} className="icon" />
            <h2 className="feature-title">Mentorship Program</h2>
            <p className="feature-description">
              Join the mentorship program and give back to your alma mater by guiding current students in their career paths.
            </p>
            <button className="button primary">Join Mentorship</button>
          </div>
        </div>
        <div className="about-website">
          <h2>About Alumni Network</h2>
          <p>
            The Alumni Network is dedicated to fostering connections among graduates of our institution. Whether you're seeking career advice, professional networking opportunities, or simply want to reconnect with old classmates, our platform provides the resources to support your journey beyond graduation.
          </p>
          <div className="highlights">
            <div className="highlight">
              <FontAwesomeIcon icon={faBriefcase} className="highlight-icon" />
              <p>Access career resources</p>
            </div>
            <div className="highlight">
              <FontAwesomeIcon icon={faStar} className="highlight-icon" />
              <p>Expand your professional network</p>
            </div>
          </div>
        </div>
        <div className="follow-us">
          <h2>Follow Us</h2>
          <div className="social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} className="social-icon" /></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} className="social-icon" /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
          Student-Alumni Connect &copy; 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AlumniPage;
