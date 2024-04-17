import React, { useState } from "react";
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

function ProfilePages() {
    const token=getAuthToken();
    const decodedToken=jwtDecode(token);

    let email=decodedToken.email;
    console.log(email);
    return (
        <div>
            <h1>Profile Page</h1>
            {/* You can include user profile-related content here */}
        </div>
    );
}

export default ProfilePages;
