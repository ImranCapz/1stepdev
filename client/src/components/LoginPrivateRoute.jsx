import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

function LoginPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser._id ? <Navigate to="/" /> : <Outlet />;
}

export default LoginPrivateRoute;
