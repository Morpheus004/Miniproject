import React from 'react';
import { NavLink } from 'react-router-dom';
import {Outlet} from 'react-router-dom';
import classes from './CSS/eventcard.module.css';
// import './CSS/all.css';

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
