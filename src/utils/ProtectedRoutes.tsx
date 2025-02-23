import { Outlet, Navigate } from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.ts"

const ProtectedRoutes = () => {
    const {authUser} = useAuthStore();
    return authUser ? <Outlet/> : <Navigate to={"/login"}/>
}

export default ProtectedRoutes;