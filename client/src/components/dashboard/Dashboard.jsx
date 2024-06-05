import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./DashSiderbar";
import Overview from "./Overview";
import SubmenuProfile from "./SubmenuProfile";
import SubmenuProvider from "./SubmenuProvider";
import { useSelector } from "react-redux";
import { getBookingsStart, getBookingSuccess, getBookingFailure } from "../../redux/booking/bookingSlice";
import { useDispatch } from "react-redux";


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
 
  // useEffect(() => {
  //   const fetchBooking = async () => {
  //     const url = `/server/booking/getuserbookings/${currentUser._id}`;
  //     console.log("Fetching bookings from URL:", url);
  //     try {
  //       dispatch(getBookingsStart());
  //       const response = await fetch(url);
  //       console.log("Response status:", response.status);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       dispatch(getBookingSuccess(data));
  //       console.log("Booking data:", data);
  //     } catch (error) {
  //       dispatch(getBookingFailure(error));
  //       console.error(
  //         "An error occurred while fetching booking details:",
  //         error
  //       );
  //     }
  //   };

  //   fetchBooking();
  // }, [currentUser._id,dispatch]);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (["dashboard", "providers", "profile", "Profile Setting", "Parent Details", "Bookings"].includes(tabFromUrl)) {
      setTab(tabFromUrl);
    }
  }, [location.search]); 
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagFromUrl = urlParams.get("tag");
    if (["dashboard", "providers", "profile", "Profile Setting", "Parent Details", "Bookings"].includes(tagFromUrl)) {
      setTab(tagFromUrl);
    }
  }, [location.search]); 
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        <DashSidebar />
      </div>
        {tab === "dashboard" && <Overview /> }
        {tab === "providers" && <SubmenuProvider />}
        {(tab === "profile" || tab === "Profile Setting" || tab === "Parent Details" || tab === "Bookings" ) && < SubmenuProfile/>}
       
    </div>
  );
}
