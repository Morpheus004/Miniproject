import React, { useState, useEffect } from "react";
import "./alumniInvites.css"; 
import { useRouteLoaderData } from "react-router-dom";
import axios from "axios";
import {BACKEND_URL} from '../config.js'
function EventCard({ event, handleAcceptInvitation, handleCancelInvitation }) {
  function formatDate(dateString) {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        return formatter.format(date);
      }
    
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
              <p>Date: {formatDate(event.date)}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
              <p>Seats : {event.seats}</p>
              <p>Registrations:{`${event.registeredstudents}/${event.seats}`}</p>
              {event.acceptance === true ? (
        <p>Event invite accepted!!</p>
      ) : (
        <div>
          <button onClick={() => handleAcceptInvitation(event.eid)}>Accept</button>
          <button onClick={() => handleCancelInvitation(event.eid)}>Decline</button>
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

  const userInfo = useRouteLoaderData('alumniData');
  const aid=userInfo.data.aid;
  useEffect(() => {
    const data = async () => {
      try {
        const response = await axios.get(BACKEND_URL+"/manageevents/api/requests/a/"+aid);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching event requests:", error);
      }
    };
    data();
  }, []);

  const handleAcceptInvitation = (eventId) => {
    const event = events.find(event => event.eid === eventId);
    setEventToAccept(event);
    setShowAcceptModal(true);
  };

  const confirmAcceptInvitation = async() => {
    try {
      await axios.put(`${BACKEND_URL}/manageevents/api/requests/${eventToAccept.eid}`, { acceptance: true,aid:aid });
      
      setEvents(events.map(event => {
        if (event.eid === eventToAccept.eid) {
          return { ...event, acceptance: true }; // Update the acceptance status
        }
        return event;
      }));
      setShowAcceptModal(false);
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const cancelAcceptInvitation = () => {
    setShowAcceptModal(false);
  };

  const handleCancelInvitation = (eventId) => {
      const event = events.find(event => event.eid === eventId);
      setEventToCancel(event);
      setShowCancelModal(true);
  };

  const confirmCancelInvitation = async() => {
    try {
      await axios.put(`${BACKEND_URL}/manageevents/api/requests/${eventToCancel.eid}`, { acceptance: false,aid:aid });
        setEvents(events.filter(event => event.eid !== eventToCancel.eid));
        setShowCancelModal(false);
      } catch (error) {
        console.error("Error cancelling invitation:", error);
      }
  };

  const cancelCancelInvitation = () => {
    setShowCancelModal(false);
  };

  const filteredEvents = events.filter(event => event.acceptance !== false);

  return (
    <div className="page-container">
      <div className="container">
        <h2>Alumni Invitations</h2>
        <div className="event-cards" id="eventCards">
          {filteredEvents.map((event, index) => (
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