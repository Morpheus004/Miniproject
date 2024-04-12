import React, { useState,useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';
import axios from "axios";

function InternshipCard({ internship, onApply, formatDate,handleApplyInternship,registrationMessage }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApply(internship.iid);
    setApplied(true);
  };

  return (
    <div className={`event-card ${applied ? 'applied' : ''}`}>
      <h3>{internship.title}</h3>
      <p>Role: {internship.roles}</p>
      <p>Domain: {internship.domain_t}</p>
      <p>Applications: {internship.applications}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration(months): {internship.duration_months}</p>
      {!applied ? (
        <button onClick={() => handleApplyInternship(internship.iid)}>Apply</button>
      ) : (
        <>
          <p>{registrationMessage}</p>
        </>
      )}
    </div>
  );
}

function InternshipPage() {
  const [internships, setInternships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9000/internship/api/internships");
      const upcomingInternships = res.data.filter((internship) => new Date(internship.date) > new Date());
      setInternships(upcomingInternships);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  };
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationInternshipId, setRegistrationInternshipId] = useState(null);

  
  const handleApplyInternship = async(internshipId) => {
    try {
      setRegistrationInternshipId(internshipId);
      setRegistrationMessage("Applied successfully!");
      const res=await axios.put(`http://localhost:9000/internship/api/internships/${internshipId}`);
      console.log(res);
      fetchData(); 
    } catch (error) {
      console.error("Error applying for internship:", error);
    }
  };

  return (
    <div>
      <div className={classes.container}>
        <h2>Internships</h2>
        <div className="event-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.iid}
              internship={internship}
              onApply={handleApplyInternship}
              formatDate={formatDate}
              handleApplyInternship={handleApplyInternship}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InternshipPage;