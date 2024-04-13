import React, { useState, useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';

function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
    </div>
  );
}

function AlumniPage() {
  const [upcomingEventsData, setUpcomingEventsData] = useState([]);

  useEffect(() => {
    const data = [
      {
        title: "Alumni Meetup",
        date: "June 5, 2024",
        location: "Los Angeles",
      },
      {
        title: "Career Fair",
        date: "July 10, 2024",
        location: "San Francisco",
      },
      {
        title: "Panel Discussion",
        date: "August 15, 2024",
        location: "Boston",
      },
    ];
    setUpcomingEventsData(data);
  }, []);

  return (
    <div className={classes.container}>
      <h2>Alumni Page</h2>
      <div className="event-cards" id="eventCards">
        {upcomingEventsData.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* <Navbar /> */}
      <AlumniPage />
    </div>
  );
}

export default App;
