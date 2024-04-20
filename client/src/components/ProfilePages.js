import React, { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";



function ProfilePages() {
<<<<<<< Updated upstream
  const userInfo = useRouteLoaderData('studentData');

  console.log("userInfo:", userInfo);

  return (
    <div>
      <h1>Profile Page</h1>
      {userInfo && (
        <div>
          <p>Email: {userInfo.data.email}</p>
          <p>Username: {userInfo.data.username}</p>
          <p>Role: {userInfo.data.role}</p>
          <p>UID: {userInfo.data.uid}</p>
          <p>SID: {userInfo.data.sid}</p>
        </div>
      )}
=======
  return (
    <div>
      <h1>Profile Page</h1>
>>>>>>> Stashed changes
    </div>
  );
}

export default ProfilePages;


// import React, { useState, useEffect } from "react";
// import { getAuthToken } from "../utils/auth";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import { useRouteLoaderData } from "react-router-dom";

// function ProfilePages() {
//   const [userInfo, setUserInfo] = useState(null);
//   const data=useRouteLoaderData('studentData');
//   setUserInfo(data);
//   console.log(data);
//   // setUserInfo(data);
//   // useEffect(() => {
//   //   const fetchUserInfo = async () => {
//   //     try {
//   //       const token = getAuthToken();
//   //       const decodedToken = jwtDecode(token);
//   //       const email = decodedToken.email;

//   //       const response = await axios.get(
//   //         `http://localhost:9000/profile/api/${email}`
//   //       );
//   //       setUserInfo(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching user information:", error);
//   //       if (error.response) {
//   //         console.error("Error response:", error.response.data);
//   //       }
//   //     }

//   //   };

//   //   fetchUserInfo();
//   //   const data=useLoaderData();
//   //   setUserInfo(data);
//   // }, []);

//   console.log("userInfo:", userInfo);

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       {userInfo && (
//         <div>
    
//           <p>Email: {userInfo.email}</p>
//           <p>Username: {userInfo.username}</p>
//           <p>Role: {userInfo.role}</p>
//           <p>UID: {userInfo.uid}</p>
//           <p>SID: {userInfo.sid}</p>

//         </div>
//       )}
//     </div>
//   );
// }

// export default ProfilePages;
