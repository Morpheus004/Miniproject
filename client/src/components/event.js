import React, { useState, useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from './CSS/eventcard.module.css';
import axios from "axios";


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

  const handleRegister = () => {
    onRegister(event.eid);
  };

  const handleCancel = () => {
    onCancel(event.eid);
  };


  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {formatDate(event.date)}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Seats : {event.seats}</p>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleCancel}>Cancel Event</button>
    </div>
  );
}


function EventPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect( ()=>{
    async function updateData(){
      try {
        const res=await axios.get("http://localhost:9000/event/api/events");
        const upcomingEvents = res.data.filter((event) => new Date(event.date) > new Date());
        setEvents(upcomingEvents);
  
      } catch (error) {
        console.error("Error in useEffect inside EventPage:",error);
      }
    }
    updateData();
  },[]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    description:"",
    seats:""
  });
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationEventId, setRegistrationEventId] = useState(null);

  const handleRegisterEvent = (eventId) => {
    // Logic to register for event
    setRegistrationEventId(eventId);
    setRegistrationMessage("Registered successfully!");
  };

  const handleCancelRegistration = () => {
    // setRegistrationEventId(null);
    // setRegistrationMessage(""); Did not work as db was not implemented
    console.log("Did not work as db was not implemented");
  };

  const handleCancelEvent = async (eventId) => {
    setEvents(events.filter((event) => event.eid !== eventId)); // Update UI first (optimistic)
  
    try {
      const res = await axios.delete(`http://localhost:9000/event/api/events/${eventId}`);
      console.log(res);
    } catch (error) {
      console.error("Error removing from the database:", error);

      // setEvents(events.filter((event) => event.eid === eventId)); 
    }
  };
  
  const handleAddEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveEvent = async () => {
    //Sending newEvent object to Backend
    const res= await axios.post("http://localhost:9000/event/api/events",newEvent);
    console.log(res);
    const eid = events.length-1 + 1;
    const updatedEvents = [...events, { ...newEvent, eid }];
    setEvents(updatedEvents);
    setShowModal(false);
    setNewEvent({
      title: "",
      date: "",
      location: "",
      description:"",
      seats:""
    });
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setNewEvent({
      title: "",
      date: "",
      location: "",
      description: "",
      seats: ""
    });
  };

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
    <div>
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
              {registrationEventId !== event.id ? (
                <button onClick={() => handleRegisterEvent(event.eid)}>Register</button>
              ) : (
                <>
                  <p>{registrationMessage}</p>
                  <button onClick={handleCancelRegistration}>Cancel Registration</button>
                </>
              )}
              <button onClick={() => handleCancelEvent(event.id)}>Cancel Event</button>
            </div>
          ))}
        </div>
        <div className="add-event">
          <button id="addEventBtn" onClick={handleAddEvent}>
            Add Event
          </button>
        </div>
        {showModal && (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>&times;</span>
              <h2>Add Event</h2>
              <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
              <input type="date" placeholder="Date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
              <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
              <input type="text" placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
              <input type="number" placeholder="Seats" value={newEvent.seats} onChange={(e) => setNewEvent({ ...newEvent, seats: e.target.value })} />
              <button onClick={handleSaveEvent}>Save</button>
              <button onClick={handleCancelModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPage;


