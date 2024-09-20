import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Profile from "../Profile";
import ParentForm from "../parents/ParentForm";
import { useSelector } from "react-redux";
import UserBooking from "../booking/UserBooking";
import { MdNotificationsActive } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  setHasApprovedBooking,
  setLastSeenBookingId,
} from "../../redux/booking/bookingSlice";
import { useNavigate } from "react-router-dom";
import CreateMenuParent from "../parents/CreateMenuParent";

export default function SubmenuProfile() {
  const [activeComponent, setActiveComponent] = useState("Profile setting");
  const { currentUser } = useSelector((state) => state.user);
  const [isBookingsLinkClicked, setIsBookingsLinkClicked] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleLinkClick = (e, title) => {
    e.preventDefault();
    setActiveComponent(title);
    navigate(`?tag=${title}`);
    if (title === "Bookings") {
      setIsBookingsLinkClicked(false);
      const approvedBookings = bookings.filter(
        (booking) => booking.status === "approved"
      );
      if (approvedBookings.length > 0) {
        const latestBooking = approvedBookings[approvedBookings.length - 1];
        dispatch(setLastSeenBookingId(latestBooking._id));
        dispatch(setHasApprovedBooking(false));
      }
    }
  };

  return (
    <div className="flex flex-col transition-all duration-500 ">
      <div className="flex flex-row">
        {submenuNav.map((item, idx) => (
          <nav key={idx} className="">
            <div
              className={`border-b-2 hover:text-amber-500 hover:bg-amber-100 duration-150 ${
                activeComponent === item.title ? "border-amber-500 " : ""
              }`}
            >
              <ul className="flex max-w-screen-2xl overflow-x-auto lg:px-4">
                <li className={`py-1`}>
                  <Link
                    to={`?tag=${item.title}`}
                    className={`block py-1.5 px-2 rounded-t-lg md:text-base text-sm text-gray-700 `}
                    onClick={(e) => handleLinkClick(e, item.title)}
                  >
                    <span className="flex flex-row items-center gap-1">
                      {item.title}
                      {item.title === "Bookings" && hasApprovedBooking && (
                        <MdNotificationsActive />
                      )}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        ))}
      </div>
      {activeComponent === "Profile setting" && (
        <div className="w-full min-h-screen transition-all duration-500">
          <Profile />
        </div>
      )}
      {activeComponent === "Parent Details" && (
        <div className="items-start">
          {currentUser.isParent ? <ParentForm /> : <CreateMenuParent />}
        </div>
      )}
      {activeComponent === "Bookings" && (
        <div className="w-full p-2 ">
          <UserBooking />
        </div>
      )}
    </div>
  );
}
