import React, { useState } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';

function InternshipCard({ internship, onApply, formatDate }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApply(internship.id);
    setApplied(true);
  };

  const handleCancelApplication = () => {
    setApplied(false);
  };

  return (
    <div className={`event-card ${applied ? 'applied' : ''}`}>
      <h3>{internship.title}</h3>
      <p>Role: {internship.role}</p>
      <p>Domain: {internship.domain}</p>
      <p>Applicants: {internship.applicants}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration: {internship.duration}</p>
      {!applied ? (
        <button onClick={handleApply}>Apply</button>
      ) : (
        <button onClick={handleCancelApplication}>Cancel Application</button>
      )}
    </div>
  );
}

function InternshipPage() {
  const [internships, setInternships] = useState([
    {
      id: 1,
      title: "Software Engineering Intern",
      role: "Software Engineer",
      domain: "Engineering",
      applicants: 50,
      date: "2024-06-01",
      location: "Remote",
      description: "Work on exciting projects in a dynamic team environment.",
      duration: "3 months"
    },
    {
      id: 2,
      title: "Marketing Intern",
      role: "Marketing Associate",
      domain: "Marketing",
      applicants: 30,
      date: "2024-07-15",
      location: "New York",
      description: "Assist with marketing campaigns and social media management.",
      duration: "6 weeks"
    },
    {
      id: 3,
      title: "Data Science Intern",
      role: "Data Scientist",
      domain: "Data Science",
      applicants: 20,
      date: "2024-08-10",
      location: "San Francisco",
      description: "Utilize machine learning algorithms to analyze large datasets.",
      duration: "4 months"
    },
    // Add more example internships if needed
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  };

  const handleApplyInternship = (internshipId) => {
    // Logic to apply for internship
    console.log("Applied for internship with ID:", internshipId);
  };

  return (
    <div>
      <div className={classes.container}>
        <h2>Internships</h2>
        <div className="event-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              onApply={handleApplyInternship}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InternshipPage;
