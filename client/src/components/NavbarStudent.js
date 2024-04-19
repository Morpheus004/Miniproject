import React from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import classes from './CSS/eventcard.module.css';
import axios from 'axios';
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

function NavbarStudent() {
  const data=useLoaderData();
  console.log(data);
  return (
    <div>
    <nav className="navbar">
      <div className={classes.container}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/student/home" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/student/event" className="nav-link">
              Events
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/student/internship" className="nav-link">
              Internships
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/student/profile" className="nav-link">
              Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
    <Outlet/>
    </div>
  );
}

export default NavbarStudent;

export async function studentDataLoader() {
  try {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    try {
      const response = await axios.get(`http://localhost:9000/data/student/${email}`);
      const data = response.data;
      return { data };
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw new Error('Failed to fetch student data');
    }
  } catch (error) {
    console.error('Error decoding auth token:', error);
    throw new Error('Invalid auth token');
  }
}