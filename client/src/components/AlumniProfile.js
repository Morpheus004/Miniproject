import React, { useState } from "react";
import { getAuthToken } from "../utils/auth";
import { jwtDecode } from "jwt-decode";

function AlumniProfile() {
    const token=getAuthToken();
    const decodedToken=jwtDecode(token);

    let email=decodedToken.email;
    console.log(email);
    return (
        <div>
            <h1>Alumni Profile Page</h1>
            {/* You can include alumni profile-related content here */}
        </div>
    );
}

export default AlumniProfile;
