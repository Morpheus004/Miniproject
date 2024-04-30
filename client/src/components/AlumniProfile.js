import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import backgroundImage from './bg.jpg';
import FileUpload from "./FileUpload";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function AlumniProfile() {
  const [showModal, setShowModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editedLink, setEditedLink] = useState("");
  const userInfo = useRouteLoaderData('alumniData');
  const uid = userInfo.data.uid;
  console.log(userInfo);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo.data });

  const handleEdit = (field) => {
    setShowModal(true);
    setEditField(field);
    switch (field) {
      case "LinkedIn":
        setEditedLink(updatedUserInfo.website);
        break;
      case "Github":
        setEditedLink(updatedUserInfo.github);
        break;
      case "X":
        setEditedLink(updatedUserInfo.twitter);
        break;
      case "instagram":
        setEditedLink(updatedUserInfo.instagram);
        break;
      default:
        setEditedLink("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditField("");
    setEditedLink("");
  };

  const handleSaveChanges = async () => {
    const updatedUserData = { ...updatedUserInfo };
    switch (editField) {
      case "LinkedIn":
        updatedUserData.linkedin = editedLink;
        break;
      case "Github":
        updatedUserData.github = editedLink;
        break;
      case "X":
        updatedUserData.x = editedLink;
        break;
      case "instagram":
        updatedUserData.instagram = editedLink;
        break;
      default:
        break;
    }
    setUpdatedUserInfo(updatedUserData);
    try {
      const response = await axios.put(`http://localhost:9000/links/api/${uid}`, updatedUserData);
      if (response.status === 200) {
        setShowModal(false);
        console.log(updatedUserData);
      } else {
        console.error('Error updating user data:', response.data);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    handleCloseModal();
  };

  console.log("userInfo:", userInfo);

  return (
    // ... (same as before, just replace userInfo.data with updatedUserInfo)
    <div
    style={{
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
    }}
  >
    <div style={{ margin: "auto", maxWidth: "800px", padding: "110px" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            flex: "1",
            marginRight: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "20px",
            border: "1px solid #ddd",
          }}
        >
          <div style={{ padding: "20px", textAlign: "center" }}>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar6.png"
              alt="Admin"
              style={{
                borderRadius: "50%",
                padding: "10px",
                backgroundColor: "#007bff",
                width:'100px'
              }}
              width="110"
            />
            <div style={{ marginTop: "15px" }}>
              <h4>Username: {userInfo.data.username}</h4>
              <p style={{ color: "#868e96", fontSize: "14px" }}>
                Email: {userInfo.data.email}
              </p>
              <p style={{ color: "#868e96", fontSize: "14px" }}>
                Role: {userInfo.data.role}
              </p>
              <p style={{ color: "#868e96", fontSize: "14px" }}>
                UID: {userInfo.data.uid}
              </p>
              <p style={{ color: "#868e96", fontSize: "14px" }}>
                SID: {userInfo.data.sid}
              </p>
            </div>
          </div>
          <hr style={{ margin: '20px 0' }} />
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#007bff' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span style={{ color: '#6c757d' }}>LinkedIn: {userInfo.data.linkedin}</span>
              <Button variant="link" onClick={() => handleEdit("website")}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#6c757d' }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span style={{ color: '#6c757d' }}>Github: {userInfo.data.github}</span>
              <Button variant="link" onClick={() => handleEdit("github")}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#1da1f2' }}>
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              <span style={{ color: '#1da1f2' }}>X: {userInfo.data.x}</span>
              <Button variant="link" onClick={() => handleEdit("twitter")}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#e4405f' }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span style={{ color: '#e4405f' }}>Instagram: {userInfo.data.instagram}</span>
              <Button variant="link" onClick={() => handleEdit("instagram")}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </li>
          </ul>
          <FileUpload userInfo={userInfo} />
        </div>
        {/* Additional columns */}
      </div>
    </div>
    <Modal show={showModal} onHide={handleCloseModal} centered style={{ zIndex: '1050' }}>
      <Modal.Header closeButton>
        <Modal.Title>Edit {editField}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={editedLink}
          onChange={(e) => setEditedLink(e.target.value)}
          className="form-control"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  );
}

export default AlumniProfile;