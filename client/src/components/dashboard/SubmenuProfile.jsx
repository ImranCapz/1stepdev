import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Profile from "../Profile";
import ParentForm from "../parents/ParentForm";
import MessageDash from "./MessageDash";
import { useSelector } from "react-redux";
import UserBooking from "../booking/UserBooking";
import { MdNotificationsActive } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  setHasApprovedBooking,
  setLastSeenBookingId,
} from "../../redux/booking/bookingSlice";

export default function SubmenuProfile() {
  const [activeComponent, setActiveComponent] = useState("Profile setting");
  const { currentUser } = useSelector((state) => state.user);
  const [isBookingsLinkClicked, setIsBookingsLinkClicked] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { bookings, hasApprovedBooking, lastSeenBookingId } = useSelector(
    (state) => state.booking
  );

  const submenuNav = useMemo(
    () => [
      { title: "Profile setting" },
      { title: "Parent Details" },
      { title: "Bookings" },
    ],
    []
  );

  useEffect(() => {
    if (activeComponent !== "Bookings") {
      setIsBookingsLinkClicked(false);
    }
  }, [activeComponent]);

  useEffect(() => {
    if (Array.isArray(bookings)) {
      const approvedBookings = bookings.filter(
        (booking) => booking.status === "approved"
      );
      if (approvedBookings.length > 0) {
        const latestBooking = approvedBookings[approvedBookings.length - 1];
        if (latestBooking._id !== lastSeenBookingId) {
          dispatch(setHasApprovedBooking(true));
          dispatch(setLastSeenBookingId(latestBooking._id));
        }
      }
    }
  }, [bookings, dispatch, lastSeenBookingId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagFromUrl = urlParams.get("tag");
    if (tagFromUrl) {
      const validTag = submenuNav.find((item) => item.title === tagFromUrl);
      if (validTag) {
        setActiveComponent(tagFromUrl);
      }
    }
  }, [location.search, submenuNav]);

  return (
    <div className="flex flex-col w-full transition-all duration-500 ">
      <nav className="block border-b items-start">
        <ul className=" flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4 overflow-x-auto lg:px-8 mt-4">
          {submenuNav.map((item, idx) => (
            <li key={idx} className="py-1">
              <Link
                to={`?tag=${item.title}`}
                className={`block py-2 px-3 rounded-lg md:text-base text-sm text-gray-700 hover:text-amber-500 hover:bg-amber-100 duration-150 ${
                  activeComponent === item.title
                    ? "border-b-2 border-amber-500"
                    : ""
                }`}
                onClick={() => {
                  if (item.title === "Bookings") {
                    setIsBookingsLinkClicked(false);
                    const approvedBookings = bookings.filter(
                      (booking) => booking.status === "approved"
                    );
                    if (approvedBookings.length > 0) {
                      const latestBooking =
                        approvedBookings[approvedBookings.length - 1];
                      dispatch(setLastSeenBookingId(latestBooking._id));
                      dispatch(setHasApprovedBooking(false));
                    }
                  }
                }}
              >
                <span className="flex flex-row items-center gap-1">{item.title}
                {item.title === "Bookings" && hasApprovedBooking && (
                  <MdNotificationsActive />
                )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {activeComponent === "Profile setting" && (
        <div className="w-full min-h-screen transition-all duration-500">
          {/* <h1 className="flex flex-col mt-6 p-2 pl-6 font-bold text-2xl text-zinc-800 ">
            {" "}
            Profile :
          </h1> */}
          <Profile />
        </div>
      )}
      {activeComponent === "Parent Details" && (
        <div className="w-full bg-gray-100">
          <h1 className="flex flex-col mt-6 p-2 pl-6  font-bold md:text-2xl text-xl text-zinc-800">
            {" "}
            {currentUser.isParent
              ? "Your Parent Details :"
              : "Fill the form for Parent Profile :"}
          </h1>
          <ParentForm />
        </div>
      )}
      {activeComponent === "Bookings" && (
        <div className="w-full">
          <h1 className="flex flex-col mt-6 p-2 pl-6 font-bold text-2xl text-zinc-800 "></h1>
          <UserBooking />
        </div>
      )}
    </div>
  );
}
