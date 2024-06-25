import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser._id ? <Outlet /> : <Navigate to="/" />;
}
