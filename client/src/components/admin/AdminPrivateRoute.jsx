import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function AdminPrivateRoute() {

    const { currentUser } = useSelector((state) => state.user);


  return currentUser && currentUser.isAdmin ?  <Outlet/> : <Navigate to ='/'/>
}
