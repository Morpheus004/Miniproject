import React from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import classes from './CSS/eventcard.module.css';
import axios from 'axios';
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import {BACKEND_URL} from '../config.js'

function NavbarAlumni() {
  return (
    <div>
      <style>
        {`
          /* Pull right animation */
          .pullRight a {
            position: relative;
            display: inline-block;
            padding-right: 20px; /* Add padding for the pseudo-element */
          }

          .pullRight a:before {
            position: absolute;
            content: '';
            width: 0;
            height: 2px; /* Adjust line thickness */
            background-color: #fff;
            bottom: 0;
            left: 0;
            transition: width 0.3s ease; /* Add transition for width */
          }

          .pullRight a:hover:before {
            width: 100%; /* Expand the line on hover */
          }

          .navbar {
            background-color: #1b095a; /* Blue color */
            padding: 10px 0;
          }

          .navbar-nav {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
          }

          .nav-item {
            margin-right: 20px;
          }

          .nav-link {
            text-decoration: none;
            color: #fff; /* White color */
            padding: 10px 20px;
            border-radius: 5px;
          }

          .nav-link.active {
            background-color: #13021d; /* Darker shade of blue */
          }

          /* Additional styling for logout button */
          .navbar-nav.ml-auto {
            display: flex;
            align-items: center;
          }

          .navbar-nav.ml-auto .nav-item {
            margin-left: 10px; /* Adjust margin between logout button and other navbar items */
          }

          /* Push the logout button to the extreme right */
          .navbar-nav.ml-auto .nav-item:last-child {
            margin-left: auto;
          }

          /* Highlighted text links */
          .highlightTextOut a {
            color: rgba(255, 255, 255, 0.3);
          }

          .highlightTextOut a:before,
          .highlightTextIn a:before {
            position: absolute;
            color: #fff;
            top: 0;
            left: 0;
            padding: 10px;
            overflow: hidden;
            content: attr(alt);
            transition: all 0.3s;
            transform: scale(0.8);
            opacity: 0;
          }

          .highlightTextOut a:hover:before,
          .highlightTextIn a:hover:before {
            transform: scale(1);
            opacity: 1;
          }
        `}
      </style>
      <nav className="navbar">
        <div className={classes.container}>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item pullRight">
              <NavLink to="/alumni/home" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/event" className="nav-link">
                Events
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/internship" className="nav-link">
                Internships
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/profile" className="nav-link">
                Profile
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/invites" className="nav-link">
                Invites
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/chat" className="nav-link">
                Chat
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/alumni/news" className="nav-link">
                News
              </NavLink>
            </li>
            <li className="nav-item pullRight">
              <NavLink to="/logout" className="nav-link">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
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
      const response = await axios.get(`${BACKEND_URL}/data/alumni/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      return { data };
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      if (error.response && error.response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      throw new Error('Failed to fetch alumni data');
    }
  } catch (error) {
    console.error('Error decoding auth token:', error);
    throw new Error('Invalid auth token. You do not have access to this page');
  }
}