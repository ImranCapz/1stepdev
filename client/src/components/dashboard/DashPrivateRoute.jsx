import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function DashPrivateRoute() {

    const { currentUser } = useSelector((state) => state.user);


  return currentUser ?  <Outlet/> : <Navigate to ='/'/>
}
