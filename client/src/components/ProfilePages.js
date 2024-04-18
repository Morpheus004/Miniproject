import React, { useState, useEffect } from "react";
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ProfilePages() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getAuthToken();
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;

        const response = await axios.get(
          `http://localhost:9000/profile/api/${email}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      }
    };

    fetchUserInfo();
  }, []);

  console.log("userInfo:", userInfo);

  return (
    <div>
      <h1>Profile Page</h1>
      {userInfo && (
        <div>
          <p>Email: {userInfo.email}</p>
          <p>Username: {userInfo.username}</p>
          <p>Role: {userInfo.role}</p>
          <p>UID: {userInfo.uid}</p>
          <p>SID: {userInfo.sid}</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePages;
