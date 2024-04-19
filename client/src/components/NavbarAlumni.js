import React from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import classes from './CSS/eventcard.module.css';
import axios from 'axios';
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

function NavbarAlumni() {
  return (
    <div>
    <nav className="navbar">
      <div className={classes.container}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/alumni/home" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/alumni/event" className="nav-link">
              Events
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/alumni/internship" className="nav-link">
              Internships
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/alumni/profile" className="nav-link">
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

export default NavbarAlumni;

export async function alumniDataLoader() {
  try {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    try {
      const response = await axios.get(`http://localhost:9000/data/alumni/${email}`);
      const data = response.data;
      return { data };
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      throw new Error('Failed to fetch alumni data');
    }
  } catch (error) {
    console.error('Error decoding auth token:', error);
    throw new Error('Invalid auth token. You do not have access to this page');
  }
}