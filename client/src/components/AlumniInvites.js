import React, { useState, useEffect } from "react";
import "./alumniInvites.css"; 

function EventCard({ event, handleAcceptInvitation, handleCancelInvitation }) {
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      {event.invited && (
        <div>
          <button onClick={() => handleAcceptInvitation(event.id)}>Accept</button>
          <button onClick={() => handleCancelInvitation(event.id)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function ConfirmationModal({ show, title, message, onCancel, onConfirm }) {
  if (!show) return null;
  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AlumniInvites() {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [eventToAccept, setEventToAccept] = useState(null);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Alumni Meetup",
        date: "June 5, 2024",
        location: "Los Angeles",
        invited: true
      },
      {
        id: 2,
        title: "Career Fair",
        date: "July 10, 2024",
        location: "San Francisco",
        invited: false
      },
      {
        id: 3,
        title: "Panel Discussion",
        date: "August 15, 2024",
        location: "Boston",
        invited: true
      },
    ];
    setEvents(data);
  }, []);

  const handleAcceptInvitation = (eventId) => {
    const event = events.find(event => event.id === eventId);
    setEventToAccept(event);
    setShowAcceptModal(true);
  };

  const confirmAcceptInvitation = () => {
    setEvents(events.map(event => {
      if (event.id === eventToAccept.id) {
        return { ...event, invited: false }; // Mark the event as accepted
      }
      return event;
    }));
    setShowAcceptModal(false);
  };

  const cancelAcceptInvitation = () => {
    setShowAcceptModal(false);
  };

  const handleCancelInvitation = (eventId) => {
    const event = events.find(event => event.id === eventId);
    setEventToCancel(event);
    setShowCancelModal(true);
  };

  const confirmCancelInvitation = () => {
    setEvents(events.filter(event => event.id !== eventToCancel.id));
    setShowCancelModal(false);
  };

  const cancelCancelInvitation = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="page-container">
      <div className="container">
        <h2>Alumni Invitations</h2>
        <div className="event-cards" id="eventCards">
          {events.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              handleAcceptInvitation={handleAcceptInvitation}
              handleCancelInvitation={handleCancelInvitation}
            />
          ))}
        </div>
        <ConfirmationModal
          show={showAcceptModal}
          title="Confirm Acceptance"
          message={`Are you sure you want to accept the invitation to ${eventToAccept?.title}?`}
          onCancel={cancelAcceptInvitation}
          onConfirm={confirmAcceptInvitation}
        />
        <ConfirmationModal
          show={showCancelModal}
          title="Confirm Cancellation"
          message={`Are you sure you want to cancel the invitation to ${eventToCancel?.title}?`}
          onCancel={cancelCancelInvitation}
          onConfirm={confirmCancelInvitation}
        />
      </div>
    </div>
  );
}

export default AlumniInvites;
