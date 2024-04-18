import React from 'react';
import { RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import NavbarAlumni from './NavbarAlumni';
import StudentPage from './studenthomepage';
import EventPage from './event';
import InternshipPage from './InternshipPage';
import ProfilePages from './ProfilePages';
import Login from './loginpage';
import AlumniEvent from './AlumniEvent';
import AlumniInternship from './finalalumniinternishippage';
import AlumniPage from './AlumniPage';
import AlumniProfile from './AlumniProfile';
import NavbarStudent from './NavbarStudent';
import { checkAuthLoader } from '../utils/auth';
import PrivateRoutesStudent from '../utils/PrivateRoutesStudent.js';
import PrivateRoutesAlumni from '../utils/PrivateRoutesAlumni.js';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path:'/alumni',
    element:<PrivateRoutesAlumni/>,
    loader:checkAuthLoader,
    children:[
      {
        path: '/alumni',
        element: <NavbarAlumni />,
        // loader:checkAuthLoader,
        children: [
          { path: 'home', element: <AlumniPage /> },
          { path: 'event', element: <AlumniEvent /> },
          { path: 'internship', element: <AlumniInternship /> },
          { path: 'profile', element: <AlumniProfile /> }
        ]
      },
    ]
  },
  {
    path:'/student',
    element:<PrivateRoutesStudent/>,
    loader:checkAuthLoader,
    children:[  
      {
        path: '/student',
        element: <NavbarStudent />,
        // loader:checkAuthLoader,
        children: [
          { path: 'home', element: <StudentPage /> },
          { path: 'event', element: <EventPage /> },
          { path: 'internship', element: <InternshipPage /> },
          { path: 'profile', element: <ProfilePages /> }
        ]
      }

    ]
  },
]
);

function App() {
 return <RouterProvider router={router}/>
}

export default App;
