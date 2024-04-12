import React from 'react';
import { RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import NavbarAlumni from './NavbarAlumni';
import StudentPage from './studenthomepage';
import EventPage from './event';
import InternshipPage from './internshippagealumni';
import ProfilePages from './ProfilePages';
import Login from './loginpage';
import AlumniEvent from './AlumniEvent';
import AlumniInternship from './internshippagealumni';
import AlumniPage from './AlumniPage';
import AlumniProfile from './AlumniProfile';
import NavbarStudent from './NavbarStudent';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/alumni',
    element: <NavbarAlumni />,
    children: [
      { path: 'home', element: <AlumniPage /> },
      { path: 'event', element: <AlumniEvent /> },
      { path: 'internship', element: <AlumniInternship /> },
      { path: 'profile', element: <AlumniProfile /> }
    ]
  },
  {
    path: '/student',
    element: <NavbarStudent />,
    children: [
      { path: 'home', element: <StudentPage /> },
      { path: 'event', element: <EventPage /> },
      { path: 'internship', element: <InternshipPage /> },
      { path: 'profile', element: <ProfilePages /> }
    ]
  }
]
);

function App() {
 return <RouterProvider router={router}/>
}

export default App;
