import React, { useState, useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';
import axios from "axios";
import backgroundImage from './bg.jpg';

function EventCard({ event, onRegister, onCancel }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  }

  // const handleRegister = () => {
  //   onRegister(event.eid);
  // };

  // const handleCancel = () => {
  //   onCancel(event.eid);
  // };


  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {formatDate(event.date)}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Seats : {event.seats}</p>
      <p>Registrations:{`${event.registeredstudents}/${event.seats}`}</p>
      {/* <button onClick={handleRegister}>Register</button>
      <button onClick={handleCancel}>Cancel Event</button> */}
    </div>
  );
}


function AlumniEvent() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationEventId, setRegistrationEventId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:9000/event/api/events");
        const upcomingEvents = res.data.filter((event) => new Date(event.date) > new Date());
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error in useEffect inside AlumniEvent:", error);
      }
    }
    fetchData();
  }, []);

  // const handleRegisterEvent = (eventId) => {
  //   // Logic to register for event
  //   setRegistrationEventId(eventId);
  //   setRegistrationMessage("Registered successfully!");
  // };

  // const handleCancelRegistration = () => {
  //   // Logic to cancel registration for event
  //   console.log("Cancel registration logic here");
  // };

  // const handleCancelEvent = async (eventId) => {
  //   // Logic to cancel the event
  //   setEvents(events.filter((event) => event.eid !== eventId)); // Update UI first (optimistic)

  //   try {
  //     const res = await axios.delete(`http://localhost:9000/event/api/events/${eventId}`);
  //     console.log(res);
  //   } catch (error) {
  //     console.error("Error removing from the database:", error);
  //   }
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  };

  return (
    <div className="page-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", minHeight: "100vh" }}>
      <div className={classes.container}>
        <h2>Upcoming Events</h2>
        <div className="event-cards">
          {events.map((event) => (
            <div className={"event-card" + (registrationEventId === event.id ? " registered" : "")} key={event.eid}>
              <h3>{event.title}</h3>
              <p>Date: {formatDate(event.date)}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
              <p>Seats : {event.seats}</p>
              <p>Registrations:{`${event.registeredstudents}/${event.seats}`}</p>
              <p>Chief Guests: {event.acceptedAlumni &&event.acceptedAlumni.length > 0 ? event.acceptedAlumni.join(", ") : "Will let you know soon!"}</p>
              {/* {registrationEventId !== event.id ? (
                <button onClick={() => handleRegisterEvent(event.eid)}>Register</button>
              ) : (
                <>
                  <p>{registrationMessage}</p>
                  <button onClick={handleCancelRegistration}>Cancel Registration</button>
                </>
              )}
              <button onClick={() => handleCancelEvent(event.eid)}>Cancel Event</button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlumniEvent;
