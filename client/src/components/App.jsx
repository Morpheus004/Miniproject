import React from 'react';
import { RouterProvider, createBrowserRouter, useRoutes } from 'react-router-dom';
import NavbarAlumni, { alumniDataLoader } from './NavbarAlumni';
import StudentPage from './studenthomepage';
import EventPage from './event';
import InternshipPage from './InternshipPage';
import ProfilePages from './ProfilePages';
import Login from './loginpage';
import AlumniEvent from './AlumniEvent';
import AlumniInternship from './finalalumniinternishippage';
import AlumniPage from './AlumniPage';
import AlumniProfile from './AlumniProfile';
import NavbarStudent, { studentDataLoader } from './NavbarStudent';
import { checkAuthLoader } from '../utils/auth';
import PrivateRoutesStudent from '../utils/PrivateRoutesStudent.js';
import PrivateRoutesAlumni from '../utils/PrivateRoutesAlumni.js';
import Logout from './Logout.js';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path:'/logout',
    element:<Logout/>
  },
  {
    path:'/alumni',
    element:<PrivateRoutesAlumni/>,
    loader:checkAuthLoader,
    children:[
      {
        path: '/alumni',
        element: <NavbarAlumni />,
        id:'alumniData',
        loader:alumniDataLoader,
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
        id:'studentData',
        loader:studentDataLoader,
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
