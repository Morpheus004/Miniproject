import React, { useState, useEffect } from "react";
import { Link,useRouteLoaderData } from "react-router-dom";
import './CSS/all.css'; // Import CSS for styling
import classes from  './CSS/eventcard.module.css';
import axios from "axios";
import backgroundImage from './bg.jpg';
import Modal from 'react-modal'; 
import profileIcon from "./profile-icon.jpg";
import {BACKEND_URL} from '../config.js'
function InternshipCard({ internship, onCancel, formatDate }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  }

  const handleCancel = () => {
    onCancel(internship.iid);
  };

  const [showModal, setShowModal] = useState(false);
  const[username,setusername]=useState(false);
  const [internshipToAccept, setInternshipToAccept] = useState(null);
  const [internshipToCancel, setInternshipToCancel] = useState(null);
  const [internships, setInternships] = useState([]);
  const [appliedStudents,setAppliedStudents] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]);
  const getAlumniUsername = async (iid) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/alumniinternship/api/username/${internship.iid}`
      );
      console.log(res.data);
      const username = res.data.username;
      setusername(username);
    } catch (error) {
      console.error("Error in fetching alumni username", error);
    }
  };
  
  useEffect(() => {
    getAlumniUsername(internship.iid);
  }, [internship.iid]);

  const updateData = async () => {
    const currentIid=internship.iid;
    try {
    const res = await axios.get(
      `${BACKEND_URL}/apply/api/allapplied/`+currentIid
    );
    setAppliedStudents(res.data);
    console.log(res.data);
  } catch (error) {
    console.error("Error in fetching applied students list", error);
  }
};



useEffect(() => {
  updateData();
}, []);
  const handleApplied = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleProfile = (studentId) => {
    // Logic to handle profile view, maybe navigate to the student's profile page
  };
  const viewStudentProfile = (student) => {
    console.log(`Viewing profile of ${student.name}`);
    window.open(`/student/profile/${student.sid}`, '_blank');
  };

  const handleAcceptApplication = async (studentId) => {
    console.log("Accepting application for student:", studentId);
    try {
      await axios.put(`${BACKEND_URL}/apply/api/internshipapplications/${internship.iid}`, { acceptance: true, sid: studentId });
      
      setInternships(internships.map(iinternship => {
        if (internship.iid === internship.iid) {
          return { ...internship, acceptance: true }; // Update the acceptance status
        }
        return internship;
      }));
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };
  

  const handleDeclineApplication = async(studentId) => {
    console.log(`Declined application for student ${studentId}`);
    try {
      await axios.put(`${BACKEND_URL}/apply/api/internshipapplications/${internship.iid}`, { acceptance: false, sid: studentId });
      
      setInternships(internships.map(iinternship => {
        if (internship.iid === internship.iid) {
          return { ...internship, acceptance: true }; // Update the acceptance status
        }
        return internship;
      }));
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  return (
    <div className="event-card">
      <h3>{internship.title}</h3>
      <h4>Alumni creating this internship:{username}</h4>
      <p>Role: {internship.roles}</p>
      <p>Domain: {internship.domain_t}</p>
      <p>Applications: {internship.applications}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration(months): {internship.duration_months}</p>
      <button onClick={handleCancel}>Cancel Application</button>
      <button onClick={handleApplied}>Students Applied</button>
      <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  contentLabel="Applied Students Modal"
  className={`${classes.modal} modal`} // Add both classes
  overlayClassName={classes.overlay}
  style={{
    content: {
      width: '600px',
      height: 'auto',
      margin: 'auto',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }}
>
  <div className="modal-content"> 
    <div className="modal-header"> 
      <h2 className="modal-title">Students Applied</h2>
      <button className="close" onClick={handleCloseModal}>
        &times;
      </button>
    </div>
    <div className="modal-body"> 
      {appliedStudents.map((student) => (
        <div key={student.sid}>
          <p>Name: {student.username}</p>
          <button className="profile-button" onClick={() => viewStudentProfile(student)}>
            <img src={profileIcon} alt="Profile" className="profile-icon" />
          </button>
          <div>
            <button className="accept-button" onClick={() => handleAcceptApplication(student.sid)}>Accept</button> 
            <button className="deny-button" onClick={() => handleDeclineApplication(student.sid)}>Decline</button> 
          </div>
        </div>
      ))}
    </div>
    <div className="modal-footer"> 
      <button onClick={handleCloseModal}>Close</button>
    </div>
  </div>
</Modal>


    </div>
  );
}

function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function updateData() {
      try {
        const res = await axios.get(
          BACKEND_URL+"/alumniinternship/api/alumni/internship"
        );
          const upcomingInternships = res.data.filter(
          (event) => new Date(event.date) > new Date()
        );
        setInternships(upcomingInternships);
      } catch (error) {
        console.error("Error in useEffect inside InternshipAlumniPage:", error);
      }
    }
    updateData();
  }, []);

  const [newInternship, setNewInternship] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    duration: "",
    role: "",
    domain: "",
    applications: "",
  });

  const handleCancelApplication = async (internshipId) => {
    setInternships(
      internships.filter((internship) => internship.iid !== internshipId)
    );
    try {
      const res = await axios.delete(`${BACKEND_URL}/alumniinternship/api/alumni/internship/${internshipId}`);
      console.log("successfully deleted event with id $1",internships.iid);
      console.log(res);
    } catch (error) {
      console.error("Error removing from the database:", error);
    }
  };

  const handleAddInternship = () => {
    setShowModal(true);
  };

  const userInfo = useRouteLoaderData("alumniData");
  const aid = userInfo.data.aid;
  const handleSaveInternship = async () => {
    try {
      const res = await axios.post(
        BACKEND_URL+"/alumniinternship/api/alumni/internship",
        {...newInternship,aid:aid}
      );
      console.log(res);
      const updatedInternships = [...internships, res.data];
      setInternships(updatedInternships);
      setShowModal(false);
      setNewInternship({
        title: "",
        date: "",
        location: "",
        description: "",
        duration: "",
        role: "",
        domain: "",
        applications: "",
      });
    } catch (error) {
      console.error("Error saving internship:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setNewInternship({
      title: "",
      date: "",
      location: "",
      description: "",
      duration: "",
      role: "",
      domain: "",
      applications: "",
    });
  };

  return (
    <div className="page-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", minHeight: "100vh" }}>
      <div className={classes.container}>
        <h2>Upcoming Internships</h2>
        <div className="event-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.iid}
              internship={internship}
              onCancel={handleCancelApplication} 
            />
          ))}
        </div>
        <div className="add-event">
          <button id="addEventBtn" onClick={handleAddInternship}>
            Add Internship
          </button>
        </div>
        {showModal && (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h2 className="modal-header">Add Internship</h2>
              <div className="modal-body">
              <input
                type="text"
                placeholder="Title"
                value={newInternship.title}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, title: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Date"
                value={newInternship.date}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, date: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                value={newInternship.location}
                onChange={(e) =>
                  setNewInternship({
                    ...newInternship,
                    location: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={newInternship.description}
                onChange={(e) =>
                  setNewInternship({
                    ...newInternship,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Duration"
                value={newInternship.duration}
                onChange={(e) =>
                  setNewInternship({
                    ...newInternship,
                    duration: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={newInternship.role}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, role: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Domain"
                value={newInternship.domain}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, domain: e.target.value })
                }
              />
              </div>
              <div className="modal-footer"><button onClick={handleSaveInternship}>Save</button>
              <button onClick={handleCancelModal}>Cancel</button></div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipPage;