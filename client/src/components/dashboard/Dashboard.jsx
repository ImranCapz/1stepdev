import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./DashSiderbar";
import Overview from "./Overview";
import SubmenuProfile from "./SubmenuProfile";
import SubmenuProvider from "./SubmenuProvider";
import { useSelector } from "react-redux";
import {
  getBookingsStart,
  getBookingSuccess,
  getBookingFailure,
  setTotalUserBooksCount,
} from "../../redux/booking/bookingSlice";
import { useDispatch } from "react-redux";
import MessageDash from "./MessageDash";
import CreateMenuProvider from "../provider/CreateMenuProvider";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("Dashboard");
  const { currentUser } = useSelector((state) => state.user);
  const { currentProvider } = useSelector((state) => state.provider);
  const dispatch = useDispatch();

  document.title = "Dashboard | 1Step";

  useEffect(() => {
    const fetchBooking = async () => {
      const url = `/server/booking/getuserbookings/${currentUser._id}`;
      try {
        dispatch(getBookingsStart());
        const response = await fetch(url);
        const data = await response.json();
        if (data.statusCode === 500) {
          return;
        }
        const sortedData = data.userBookings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch(getBookingSuccess(sortedData));
        dispatch(setTotalUserBooksCount(data.countBookings));
      } catch (error) {
        dispatch(getBookingFailure(error));
      }
    };

    fetchBooking();
  }, [currentUser._id, dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (
      [
        "dashboard",
        "providers",
        "profile",
        "Profile Setting",
        "Parent Details",
        "Bookings",
        "messages",
      ].includes(tabFromUrl)
    ) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagFromUrl = urlParams.get("tag");
    if (
      [
        "dashboard",
        "providers",
        "profile",
        "Profile Setting",
        "Parent Details",
        "Bookings",
        "messages",
      ].includes(tagFromUrl)
    ) {
      setTab(tagFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex flex-col mx-auto w-full">
      <>
        <DashSidebar />
      </>
      {tab === "dashboard" && <Overview />}
      {tab === "providers" &&
        (currentProvider ? <SubmenuProvider /> : <CreateMenuProvider />)}
      {(tab === "profile" ||
        tab === "Profile Setting" ||
        tab === "Parent Details" ||
        tab === "Bookings") && <SubmenuProfile />}
      {tab === "messages" && <MessageDash />}
    </div>
  );
}
