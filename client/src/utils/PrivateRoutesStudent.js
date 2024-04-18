import { Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { getAuthToken } from "./auth";


const PrivateRoutesStudent = ({children}) => {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    let auth = {'role': role}
    return(
        auth.role==='student' ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutesStudent;