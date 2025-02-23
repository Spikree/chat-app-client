import { Outlet, Navigate } from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.js"

const AuthRoutes = () => {
    const {authUser} = useAuthStore();
    return !authUser ? <Outlet/> : <Navigate to={"/"}/>
}

export default AuthRoutes;