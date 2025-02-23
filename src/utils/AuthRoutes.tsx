import { Outlet, Navigate } from "react-router-dom";
import {useAuthStore} from "../store/useAuthStore.ts"

const AuthRoutes = () => {
    const {authUser} = useAuthStore((state) => state);
    return !authUser ? <Outlet/> : <Navigate to={"/"}/>
}

export default AuthRoutes;