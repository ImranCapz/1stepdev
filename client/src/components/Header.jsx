import { useEffect, useRef, useState } from "react";
import logo from "../assets/oneStepLogo.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { providerOut } from "../redux/provider/providerSlice";
import { onlineStatusRemove } from "../redux/user/onlineSlice";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";
import toast from "react-hot-toast";
import { FaRegHeart } from "react-icons/fa";
import { Modal } from "flowbite-react";
import ListModel from "./modal/ListModel";
import ParentModel from "./modal/ParentModel";
import PropTypes from "prop-types";

const Header = ({ showSubMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [state, setState] = useState(false);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const topLoadingBarRef = useRef(null);

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const location = useLocation();

  const handleSignout = async () => {
    try {
      topLoadingBarRef.current.continuousStart(50);
      await fetch("/server/auth/signout");
      dispatch(signOut());
      dispatch(providerOut());
      dispatch(onlineStatusRemove());
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      topLoadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Click outside of the dropdown, close it
        setDropdownVisible(false);
      }
    };

    // Attach the event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      // Remove the event listener when the component is unmounted
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSubmenuClick = (itemTitle) => {
    topLoadingBarRef.current.continuousStart(50);
    if (itemTitle === "Overview") {
      navigate("/");
    } else if (itemTitle === "Early Concerns: Start Here") {
      navigate("/early-concerns");
    } else if (itemTitle === "Read Expert Guides") {
      navigate("/expert-guides");
    } else {
      navigate(`/search?searchTerm=${itemTitle}`);
    }
    topLoadingBarRef.current.complete(50);
  };
  const navigation = [
    { title: "Home", path: "/" },
    {
      title: (
        <p>
          {currentUser ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/dashboard?tag=Parent%20Details");
              }}
            >
              For Parents
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                setParentModal(true);
              }}
            >
              For Parents
            </button>
          )}
        </p>
      ),
    },
    {
      title: "For Providers",
      path: currentUser ? "/dashboard?tab=providers" : "/for-providers",
    },
    {
      title: (
        <p key="heartIcon" style={{ display: "flex", alignItems: "center" }}>
          {currentUser ? (
            <button
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5px",
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/favorite-list");
              }}
              className="gap-1"
            >
              <FaRegHeart /> Lists
            </button>
          ) : (
            <button
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "5px",
              }}
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(true);
              }}
              className="gap-1"
            >
              <FaRegHeart /> Lists
            </button>
          )}
        </p>
      ),
    },
    { title: "About Us", path: "/" },
  ];

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setAddress(data.city))
      .catch((err) => console.log(err));
  }, []);

  const getSubmenuNav = (address) => [
    { title: "Overview", path: "/" },
    {
      title: "Diagnostic Evaluation",
      path: `/freescreeners`,
    },
    {
      title: "Occupational Therapy",
      path: `/search?searchTerm=Occupational+Therapy&address=${address}`,
    },
    {
      title: "Speech Therapy",
      path: `/search?searchTerm=Speech+Therapy&address=${address}`,
    },
    {
      title: "School-Based Service",
      path: `/search?searchTerm=School-Based+Service&address=${address}`,
    },
    // {
    //   title: "Arts as Therapy",
    //   path: `/search?searchTerm=Arts+as+Therapy&address=${address}`,
    // },
    // {
    //   title: "Music Therapy",
    //   path: `/search?searchTerm=Music+Therapy&address=${address}`,
    // },
    { title: "|" },
    { title: "Learn:" },
    { title: "Early Concerns: Start Here", path: "/early-concerns" },
    { title: "Latest Articles", path: "/latest-articles" },
  ];

  const submenuNav = getSubmenuNav(address);

  function onCloseModal() {
    setOpenModal(false);
    setParentModal(false);
  }
  return (
    <header className="text-base lg:text-sm sticky top-0 z-50 bg-white border-b">
      <TopLoadingBar
        ref={topLoadingBarRef}
        color="#ff9900"
        height={3}
        speed={1000}
      />
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <ListModel onClose={onCloseModal} />
        </Modal.Body>
      </Modal>
      <Modal show={parentModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <ParentModel onClose={onCloseModal} />
        </Modal.Body>
      </Modal>
      <div
        className={`main-color items-center gap-x-14 px-4 max-w-screen-4xl mx-auto lg:flex lg:px-8 lg:static ${
          state ? "h-full fixed inset-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between py-3 lg:py-5 lg:block">
          <Link to={"/"}>
            <img src={logo} width={120} height={50} alt="1Step" />
          </Link>
          <div className="lg:hidden">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`nav-menu flex-1 pb-28 mt-8 overflow-y-auto max-h-screen lg:block lg:overflow-visible lg:pb-0 lg:mt-0 ${
            state ? "" : "hidden"
          }`}
        >
          <ul className="items-center space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex-1 items-center justify-start pb-4 lg:flex lg:pb-0"
            >
              <div className="flex items-center gap-1 px-2 border rounded-lg border-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-stone-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Find a therapist"
                  className="w-full px-2 py-2 text-black bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
                />
              </div>
            </form>
            {navigation.map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="block text-gray-700 hover:text-gray-900"
                  onClick={() => setState(false)}
                >
                  {item.title}
                </Link>
              );
            })}

            <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
              {currentUser ? (
                <div>
                  <img
                    id="avatarButton"
                    type="button"
                    data-dropdown-toggle="userDropdown"
                    data-dropdown-placement="bottom-start"
                    className="w-10 h-10 rounded-full cursor-pointer object-cover"
                    src={
                      currentUser.profilePicture ||
                      "https://i.ibb.co/tKQH4zp/defaultprofile.jpg"
                    }
                    alt="User dropdown"
                    onClick={toggleDropdown}
                    ref={dropdownRef}
                  />
                  <div
                    id="userDropdown"
                    className={`z-10 ${
                      isDropdownVisible ? "" : "hidden"
                    } bg-gray-800 divide-y divide-gray-500 rounded-lg shadow w-44 dark:bg-gray-100 dark:divide-gray-600`}
                    style={{ position: "absolute", top: "80px", right: "10px" }}
                  >
                    <div className="px-4 py-3 text-sm text-gray-100 dark:text-white">
                      <div>Hi, {currentUser.username}</div>
                      <div className="font-medium truncate">
                        {currentUser.email}
                      </div>
                    </div>
                    <div
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="avatarButton"
                    >
                      {currentUser.isAdmin && (
                        <li>
                          <Link
                            to="/admin-dashboard?tab=dashboard"
                            className="block px-4 py-2  text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      {currentUser && (
                        <div>
                          <li>
                            <Link
                              to="/dashboard?tab=dashboard"
                              className="block px-4 py-2  text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-600"
                            >
                              My Dashboard
                            </Link>
                            <Link
                              to="/dashboard?tab=providers"
                              className="block px-4 py-2  text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-600"
                            >
                              Providers
                            </Link>
                            <Link
                              to="/dashboard?tab=messages"
                              className="block px-4 py-2  text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-600"
                            >
                              Message
                            </Link>
                            <Link
                              to="/dashboard?tab=profile"
                              className="block px-4 py-2 text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Profile
                            </Link>
                          </li>
                        </div>
                      )}

                      {/* <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Earnings
                        </a>
                      </li> */}
                    </div>
                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={handleSignout}
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // <img src={currentUser.profilePicture} alt='profile' className="h-8 w-8 rounded-full object-cover"/>
                <div className="flex md:flex-row flex-col gap-4 ">
                  <Link
                    to="/signin"
                    onClick={() => setState(false)}
                    className=" block py-3 text-center text-slate-900 hover:text-purple-400 border rounded-lg md:border-none transition-all duration-300 ease-in-out"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setState(false)}
                    className="block py-3 px-4 font-medium text-center text-indigo-950 btn-color active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
      {showSubMenu && (
        <nav className="border-b">
          <ul className="hidden md:flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4 overflow-x-auto lg:px-8">
            {submenuNav.map((item, idx) => {
              if (item.title === "Learn:" || item.title === "|") {
                return (
                  <li key={idx} className="py-1">
                    <span className="block py-2 px-3 rounded-lg text-gray-700">
                      {item.title}
                    </span>
                  </li>
                );
              }

              if (item.title === "For Providers") {
                return (
                  <li
                    key={idx}
                    className={`py-1 transition-colors duration-200 ease-in-out ${
                      item.path === location.pathname
                        ? "border-b-2 border-amber-500"
                        : ""
                    }`}
                  >
                    <Link
                      to={currentUser ? "/create-provider" : "/signin"}
                      onClick={(e) => {
                        setSelectedItem(idx);
                        if (!currentUser) {
                          e.preventDefault();
                          toast.error(
                            "You must be logged in to create a provider."
                          );
                        }
                      }}
                      className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={idx}
                  className={`py-1 transition-colors duration-200 ease-in-out ${
                    location.pathname + location.search === item.path
                      ? "border-b-2 border-amber-500"
                      : ""
                  }`}
                >
                  <Link
                    to={item.path}
                    onClick={() => handleSubmenuClick(item.title)}
                    className="block py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
                  >
                    {Array.isArray(item.title) ? item.title : item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

Header.propTypes = {
  showSubMenu: PropTypes.bool,
};
