import React, { useState } from "react";
import "./EventPage.css"; // Import CSS for styling

function InternshipCard({ internship, onCancel, formatDate }) {

  const handleCancel = () => {
    onCancel(internship.id);
  };

  return (
    <div className="event-card">
      <h3>{internship.title}</h3>
      <p>Role: {internship.role}</p>
      <p>Domain: {internship.domain}</p>
      <p>Applicants: {internship.applicants}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration: {internship.duration}</p>
      <button onClick={handleCancel}>Cancel Application</button>
    </div>
  );
}

function InternshipPage() {
  const [internships, setInternships] = useState([
    {
      id: 1,
      title: "Software Engineering Intern",
      date: "June 1, 2024",
      location: "Remote",
      description: "Work on exciting projects in a dynamic team environment.",
      duration: "3 months",
      role: "Software Engineer",
      domain: "Technology",
      applicants: 10 
    }, {
      id: 2,
      title: "Marketing Intern",
      date: "July 15, 2024",
      location: "New York",
      description: "Assist with marketing campaigns and social media management.",
      duration: "6 weeks",
      role: "Marketing Assistant",
      domain: "Marketing",
      applicants: 5
    },
    {
      id: 3,
      title: "Data Science Intern",
      date: "August 10, 2024",
      location: "San Francisco",
      description: "Utilize machine learning algorithms to analyze large datasets.",
      duration: "4 months",
      role: "Data Scientist",
      domain: "Data Science",
      applicants: 8
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newInternship, setNewInternship] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    duration: "",
    role: "", 
    domain: "", 
    applicants: ""
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date);
  };

  const handleCancelApplication = (internshipId) => {
    setInternships(internships.filter((internship) => internship.id !== internshipId));
  };

  const handleAddInternship = () => {
    setShowModal(true);
  };

  const handleSaveInternship = () => {
    const id = internships.length + 1;
    const updatedInternships = [
      ...internships,
      { ...newInternship, id, applicants: parseInt(newInternship.applicants) }
    ];
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
      applicants: ""
    });
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
      applicants: ""
    });
  };

  return (
    <div>
      <div className="container">
        <h2>Internships</h2>
        <div className="event-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onCancel={handleCancelApplication}
              formatDate={formatDate}
            />
          ))}
        </div>
        <div className="add-event">
          <button id="addInternshipBtn" onClick={handleAddInternship}>
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
                  setNewInternship({ ...newInternship, location: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={newInternship.description}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Duration"
                value={newInternship.duration}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, duration: e.target.value })
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
                  setNewInternship({ ...newInternship, applicants: e.target.value })
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
