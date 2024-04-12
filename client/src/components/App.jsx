import React from 'react';
import { Route,BrowserRouter as Router,Routes } from 'react-router-dom';
import Navbar from './Navbar';
import StudentPage from './studenthomepage';
import EventPage from './event';
import InternshipPage from './internshippage';
import ProfilePages from './ProfilePages';
import Login from './loginpage';

function App() {
  return (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path="/" element={<Navbar/>}>
            <Route path="/" element={<StudentPage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/internship" element={<InternshipPage />} />
            <Route path="/profile" element={<ProfilePages />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
  // return <RouterProvider router={router} />;
}

export default App;
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Navbar />,
//     // errorElement: <ErrorPage />,
//     children: [
//       { path:"/",element:<StudentPage /> },
//       { path:"/event",element:<EventPage /> },
//       { path:"/internship",element:<InternshipPage /> },
//       {path:"/profile",element:<ProfilePages />}
//     ],
//   }
// ]);