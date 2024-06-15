import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { signOut } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export function withAuth(Component) {
  return function ProtectedRoute(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = Cookies.get('access_token');
    useEffect(() => {
      if (!token) {
        dispatch(signOut());
        navigate('/');
      }
    }, [token, navigate,dispatch]);

    return <Component {...props} />;
  }
}