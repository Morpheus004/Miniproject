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
import AlumniInvites from './AlumniInvites.js';
import AlumniProfilePublic,{publicAlumniLoader} from './AlumniProfilePublic.js'
import StudentProfilePublic,{publicStudentLoader} from './StudentProfilePublic.js'
import OAuthCallback from './OAuthCallback.js';
import RoleSelection from './roleSelection.js';
import ChatPage from './chat/pages/ChatPage.js';
import FriendsPage from './chat/pages/FriendsPage.js';
import { ToastProvider } from './ui/toast.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path:"/oauth-callback" ,
    element:<OAuthCallback />
  },
  {
    path:'/logout',
    element:<Logout/>
  },
  {
    path: '/role-selection',
    element: <RoleSelection />,
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
          { path: 'profile', element: <AlumniProfile /> },
          { path: 'invites', element: <AlumniInvites /> },
          { path: 'chat', element: <ChatPage /> },
          { path: 'friends', element: <FriendsPage /> }
        ]
      },
    ]
  },
  {
    path: '/alumni/profile/:aid',
    element: <AlumniProfilePublic/>,
    loader :publicAlumniLoader
  },
  {
    path: '/student/profile/:sid',
    element: <StudentProfilePublic/>,
    loader :publicStudentLoader
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
          { path: 'profile', element: <ProfilePages /> },
          { path: 'chat', element: <ChatPage /> },
          { path: 'friends', element: <FriendsPage /> }
        ]
      }
    ]
  },
]
);

function App() {
  
 return (
  <ToastProvider>
      <RouterProvider router={router}/>
  </ToastProvider>
 );
}

export default App;