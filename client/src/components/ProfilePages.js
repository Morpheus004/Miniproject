import React, { useState,useEffect } from "react";
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ProfilePages() {
    const [userInfo, setUserInfo] = useState(null);
  
    useEffect(() => {
      const token = getAuthToken();
      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;
  
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get(`http://localhost:9000/api/${email}`);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      };
  
      fetchUserInfo();
    }, []);

    return (
        <div>
          <h1>Profile Page</h1>
          {userInfo && (
            <div>
              <p>Name: {userInfo.name}</p>
              <p>Email: {userInfo.email}</p>
              
            </div>
          )}
        </div>
      );
    }

export default ProfilePages;
