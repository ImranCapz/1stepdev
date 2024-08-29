import { lazy, Suspense } from "react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/admin/AdminPrivateRoute";
import DashPrivateRoute from "./components/dashboard/DashPrivateRoute";
import ScrolltoTop from "./components/ScrollToTop";

// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { signOut } from "../src/redux/user/userSlice";
// import Cookies from "js-cookie";

const Question = lazy(() => import("./components/Question"));
const Profile = lazy(() => import("./components/Profile"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const CreateProvider = lazy(() => import("./pages/CreateProvider"));
const FavoriteList = lazy(() => import("./components/provider/FavoriteList"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const ProviderReview = lazy(() => import("./components/review/ProviderReview"));
const Provider = lazy(() => import("./pages/Provider"));
const Search = lazy(() => import("./pages/Search"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const DashUsers = lazy(() => import("./components/admin/DashUsers"));
const CreateProfile = lazy(() =>
  import("./pages/providerscreen/CreateProfile")
);
const Features = lazy(() => import("./components/Features"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const ResetPasswordForm = lazy(() => import("./pages/ResetPasswordForm"));

function App() {
  // const dispatch = useDispatch();
  const location = useLocation();

  const pathWithoutSubMenu = ["/dashboard", "/mymessages", "/search"];
  const pathWithOutFooter = ["/dashboard"];

  // useEffect(() => {
  //   const checkToken = () => {
  //     const token = Cookies.get("access_token");
  //     console.log(token);
  //     if (!token) {
  //       dispatch(signOut());
  //     }
  //   };
  //   checkToken();
  // }, [dispatch]);

  return (
    <>
      <Header showSubMenu={!pathWithoutSubMenu.includes(location.pathname)} />
      <ScrolltoTop />
      <Suspense fallback={<div className="min-h-screen"></div>}>
        <Routes>
          <Route path="/:searchTerm/*" element={<Hero />} />
          <Route path="/*" element={<Hero />} />
          <Route path="/freescreeners" element={<Features />} />
          <Route path="/question" element={<Question />} />
          <Route element={<LoginPrivateRoute />}>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route path="/forgetpassword" element={<ResetPasswordForm />} />
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/provider/*" element={<Provider />} />
          <Route path="/for-providers" element={<CreateProfile />} />
          <Route path="/review/:providerId" element={<ProviderReview />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-provider" element={<CreateProvider />} />
            <Route path="/favorite-list" element={<FavoriteList />} />
          </Route>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<DashUsers />} />
          </Route>
          <Route element={<DashPrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Suspense>
      {!pathWithOutFooter.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
