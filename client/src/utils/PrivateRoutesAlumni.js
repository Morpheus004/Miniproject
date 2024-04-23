import { Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { getAuthToken } from "./auth";


const PrivateRoutesAlumni = () => {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    let auth = {'role': role}
    return(
        auth.role ==='alumni' ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutesAlumni;