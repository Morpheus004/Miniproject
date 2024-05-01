import React, { useState, useEffect } from "react";
import './StudentPage.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faUserEdit } from '@fortawesome/free-solid-svg-icons'; // Import solid icons
import { faInstagram, faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Import brand icons
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'; // Import solid icons
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Import solid icons

import backgroundImage from './bg.jpg';
import image1 from './carousel-image-1.jpg.jpeg'; // Import carousel image 1
import image2 from './carousel-image-2.jpg.jpeg'; // Import carousel image 2
import image3 from './carousel-image-3.jpg.jpeg'; // Import carousel image 3

function StudentPage() {
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
        <h1 className="main-title">Student-Alumni Connect</h1>
        <p className="main-description">
          Connecting students with alumni for mentorship, networking, and opportunities.
        </p>
        <div className="features">
          <div className="feature">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
            <h2 className="feature-title">Find Events</h2>
            <p className="feature-description">
              Discover upcoming events organized by alumni or the institution. Attend workshops, seminars, and more.
            </p>
            <button className="button primary">Explore Events</button>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUsers} className="icon" />
            <h2 className="feature-title">Connect with Alumni</h2>
            <p className="feature-description">
              Connect with alumni from your institution. Seek mentorship, guidance, and career advice.
            </p>
            <button className="button primary">Find Alumni</button>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUserEdit} className="icon" />
            <h2 className="feature-title">Update Profile</h2>
            <p className="feature-description">
              Keep your profile updated with your latest achievements, projects, and interests.
            </p>
            <button className="button primary">Update Profile</button>
          </div>
        </div>
        <div className="about-website">
          <h2>About Our Website</h2>
          <p>
            Student-Alumni Connect is a platform designed to bridge the gap between current students and alumni of our institution. We aim to create a vibrant community where students can seek guidance, mentorship, and career opportunities from experienced alumni. Our platform facilitates networking events, workshops, and seminars, fostering meaningful connections that contribute to personal and professional growth.
          </p>
          <div className="highlights">
            <div className="highlight">
              <FontAwesomeIcon icon={faGraduationCap} className="highlight-icon" />
              <p>Access mentorship opportunities</p>
            </div>
            <div className="highlight">
              <FontAwesomeIcon icon={faStar} className="highlight-icon" />
              <p>Discover career prospects</p>
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

export default StudentPage;
