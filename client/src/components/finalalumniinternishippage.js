import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EventPage.css"; // Import CSS for styling
import axios from "axios";

function InternshipCard({ internship, onCancel, formatDate }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date);
  }


  const handleCancel = () => {
    onCancel(internship.iid);
  };

  return (
    <div className="event-card">
      <h3>{internship.title}</h3>
      <p>Role: {internship.roles}</p>
      <p>Domain: {internship.domain_t}</p>
      <p>Applicants: {internship.applicants}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration: {internship.duration_months}</p>
      <button onClick={handleCancel}>Cancel Application</button>
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
          "http://localhost:9000/alumniinternship/api/alumni/internship"
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
    applicants: "",
  });

  

  const handleCancelApplication = async (internshipId) => {
    setInternships(
      internships.filter((internship) => internship.iid !== internshipId)
    );
    try {
      const res = await axios.delete("http://localhost:9000/alumniinternship/api/alumni/internship/${internshipId}"
      );
      console.log("successfully deleted event with id $1",internships.iid);
      console.log(res);
    } catch (error) {
      console.error("Error removing from the database:", error);
    }
  };

  const handleAddInternship = () => {
    setShowModal(true);
  };

  const handleSaveInternship = async () => {
    try {
      const res = await axios.post(
        "http://localhost:9000/alumniinternship/api/alumni/internship",
        newInternship
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
        applicants: "",
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
      applicants: "",
    });
  };

  return (
    <div>
      <div className="container">
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
        <div className="add-internship">
          <button id="addInternshipatn" onClick={handleAddInternship}>
            Add Internship
          </button>
        </div>
        {showModal && (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Add Internship</h2>
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
              <input
                type="number"
                placeholder="Number of Applicants"
                value={newInternship.applicants}
                onChange={(e) =>
                  setNewInternship({
                    ...newInternship,
                    applicants: e.target.value,
                  })
                }
              />
              <button onClick={handleSaveInternship}>Save</button>
              <button onClick={handleCancelModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipPage;