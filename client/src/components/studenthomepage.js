import React, { useState, useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';
import backgroundImage from './bg.jpg';
function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
    </div>
  );
}

function StudentPage() {
  const [upcomingEventsData, setUpcomingEventsData] = useState([]);

  useEffect(() => {
    const data = [
      {
        title: "Hackathon 2024",
        date: "March 15, 2024",
        location: "Online",
      },
      {
        title: "Tech Conference",
        date: "April 20, 2024",
        location: "New York",
      },
      {
        title: "Workshop on Web Development",
        date: "May 10, 2024",
        location: "Chicago",
      },
    ];
    setUpcomingEventsData(data);
  }, []);

  return (
    <div className="page-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", minHeight: "100vh" }}>
    <div className={classes.container}>
      <h2>Student Page</h2>
      <div className="event-cards" id="eventCards">
        {upcomingEventsData.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
      <div className="add-event">
        <button id="addEventBtn">Add Event</button>
      </div>
    </div>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* <Navbar /> */}
      <StudentPage />
    </div>
  );
}


export default App;
