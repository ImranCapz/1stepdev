import Hero from "./components/Hero";
import Features from "./components/Features";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Question from "./components/Question";
import {ResetPasswordForm} from './pages/ResetPasswordForm'
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import VerifyOtp from "./pages/VerifyOtp";
import CreateProvider from "./pages/CreateProvider";
import UpdateProvider from "./pages/UpdateProvider";
import Provider from "./pages/Provider";
import Search from "./pages/Search";
import AdminPrivateRoute from "./components/admin/AdminPrivateRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import DashUsers from "./components/admin/DashUsers";
import CreateProfile from "./pages/providerscreen/CreateProfile";
import DashPrivateRoute from "./components/dashboard/DashPrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import ParentForm from "./components/parents/ParentForm";




 
function App() {


  return (
    <>

      <BrowserRouter>
        <Header />
        
        <Routes>

          <Route path="/" element={<Hero />} />
          <Route path="/freescreeners" element={<Features />} />
          <Route path="/question" element={<Question />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetpassword" element={<ResetPasswordForm />} /> 
          <Route path="/verifyotp" element={<VerifyOtp />} />
          <Route path='/search' element={<Search />} />
          <Route path="/provider/:providerId" element={<Provider />} />
          <Route path="/for-providers" element={<CreateProfile />} />
          <Route element={<PrivateRoute/>}>
             <Route path="/profile" element={<Profile/>} />
             <Route path="/create-parentprofile" element={<ParentForm/>} />
             <Route path="/create-provider"element={<CreateProvider />} />
             <Route path="/update-provider/:providerId"element={<UpdateProvider />} />
          </Route>
          <Route element={<AdminPrivateRoute/>}>
            <Route path="/admin-dashboard" element={<AdminDashboard/>} />
            <Route path="/users" element={<DashUsers/>} />
            </Route>
          <Route element={<DashPrivateRoute/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>

        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App
