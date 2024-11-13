import React, { useState, useEffect } from "react";
import "./CSS/all.css"; // Import CSS for styling
import classes from "./CSS/eventcard.module.css";
import axios from "axios";
import backgroundImage from './bg.jpg'
import { useRouteLoaderData } from "react-router-dom";
import {BACKEND_URL} from '../config.js'
function InternshipCard({ internship, onApply, formatDate, applied }) {
  const [registrationMessage, setRegistrationMessage] = useState("");
  const[username,setusername]=useState(false);
  const [apply, setApply] = useState(false);
  let alumniId=0;
  useEffect(() => {
    if (applied === true) {
      setRegistrationMessage("You have already applied for this internship.");
      setApply(true);
    } else {
      setRegistrationMessage("");
      setApply(false);
    }
  }, [applied]);


  const getAlumniUsername = async (iid) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/alumniinternship/api/username/${internship.iid}`
      );
      console.log(res.data);
      const username = res.data.username;
      alumniId=res.data.aid_fk;
      setusername(username);
    } catch (error) {
      console.error("Error in fetching alumni username", error);
    }
  };
  
  useEffect(() => {
    getAlumniUsername(internship.iid);
  }, [internship.iid]);

  const userInfo = useRouteLoaderData('studentData');
  const sid=userInfo.data.sid;
  const handleApply = () => {
    onApply(internship.iid,alumniId);
    setRegistrationMessage("You have already applied for this internship.");
    setApply(true);
  }
    useEffect(() => {
      const getStudentApplicationStatus = async () => {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/apply/api/student/application/${internship.iid}?sid=${sid}`
          );
          const { acceptance } = res.data;
          if (acceptance === true) {
            setRegistrationMessage("Application accepted");
          } else if (acceptance === false) {
            setRegistrationMessage("Application rejected");
          }
        } catch (error) {
          console.error("Error fetching student application status:", error);
        }
      };      
      getStudentApplicationStatus();
    }, [internship.iid]);

  return (

    <div className={`event-card ${apply ? "apply" : ""}`}>

      <h3>{internship.title}</h3>
      <h4>Alumni creating this internship:{username}</h4>
      <p>Role: {internship.roles}</p>
      <p>Domain: {internship.domain_t}</p>
      <p>Applications: {internship.applications}</p>
      <p>Date: {formatDate(internship.date)}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Duration(months): {internship.duration_months}</p>
      {!apply ? (
        <button onClick={() => handleApply(internship.iid)}>Apply</button>
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
  const userInfo = useRouteLoaderData('studentData');
  const sid=userInfo.data.sid;
  const [alumniId,setAlumniId]=useState(false);
  const checkUserApplications = async (iinternships) => {
    try {
      const response = await axios.get(BACKEND_URL+"/apply/api/userapplications");
      const userApplications = response.data;
      console.log(userApplications);
      // Check if user has applied for each internship and update state accordingly
      const updatedInternships = iinternships.map(internship => {
        const hasApplied = userApplications.some(application => (application.iid_fk === internship.iid )&&(application.sid_fk===sid));
        return { ...internship, applied:hasApplied };
      });
      return updatedInternships;
    } catch (error) {
      console.error("Error checking user applications:", error);
    }
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        BACKEND_URL+"/internship/api/internships"
      );
      const upcomingInternships = res.data.filter(
        (internship) => new Date(internship.date) > new Date()
      );
      const upcomingInternshipss=await checkUserApplications(upcomingInternships)
      setInternships(upcomingInternshipss);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date);
  };
  const [registrationInternshipId, setRegistrationInternshipId] =useState("");

  const handleApplyInternship = async (internshipId,aid) => {
    try {
      const internshipss = await checkUserApplications(internships);
      const internship = internshipss.find(internship => internship.iid === internshipId);
      // if (internship.registered) {
      //   setRegistrationMessage("You have already applied for this internship.");
      //   return;
      // }
      const aidd=aid;
      const res = await axios.put(
        `${BACKEND_URL}/internship/api/internships/${internshipId}`,{sid:sid,aid:aidd}
      );
      console.log(res);
      // fetchData();
      // setRegistrationMessage("Applied successfully!");
      // console.log("Application message:", registrationMessage);
      fetchData();
    } catch (error) {
      console.error("Error applying for internship:", error);
    }
  };

  return (
   <div className="page-container" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", minHeight: "100vh" }}>
      <div className={classes.container}>
        <h2>Internships</h2>
        <div className="event-cards">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.iid}
              internship={internship}
              onApply={handleApplyInternship}
              formatDate={formatDate}
              applied={internship.applied}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InternshipPage;
