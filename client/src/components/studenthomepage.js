// StudentPage.js
import React, { useState, useEffect } from "react";
import './StudentPage.css'; // Import CSS for styling

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
      <div className="carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={
              index === currentIndex ? "carousel-slide active" : "carousel-slide"
            }
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="content">
        <h2 className="section-title">Welcome to Student-Alumni Connect</h2>
        <p className="section-description">
          Connecting students with alumni for mentorship, networking, and opportunities.
        </p>
        <div className="row">
          <div className="column">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Find Events</h3>
                <p className="card-description">
                  Discover upcoming events organized by alumni or the institution. Attend workshops, seminars, and more.
                </p>
                <button className="button primary">Explore Events</button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Connect with Alumni</h3>
                <p className="card-description">
                  Connect with alumni from your institution. Seek mentorship, guidance, and career advice.
                </p>
                <button className="button primary">Find Alumni</button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Update Profile</h3>
                <p className="card-description">
                  Keep your profile updated with your latest achievements, projects, and interests.
                </p>
                <button className="button primary">Update Profile</button>
              </div>
            </div>
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
      <div className="color-selector">
        <h4>Select Text Color:</h4>
        <button className="color-btn black" onClick={() => handleColorChange("black")}>Black</button>
        <button className="color-btn blue" onClick={() => handleColorChange("blue")}>Blue</button>
        <button className="color-btn red" onClick={() => handleColorChange("red")}>Red</button>
      </div>
    </div>
  );
}

export default StudentPage;
