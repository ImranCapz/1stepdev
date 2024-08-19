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
import { SearchBar } from "./SearchBar";
import Search from "../pages/Search";

const Header = ({ showSubMenu }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [state, setState] = useState(false);
  const [address, setAddress] = useState("");

  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const topLoadingBarRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [parentModal, setParentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [isDrawer, setDrawer] = useState(false);
  const [isMoreVisible, setMoreVisible] = useState(false);
  const [searchWhat, setSearchWhat] = useState("");

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
        setDropdownVisible(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawer(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setDrawer(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmenuItemClick = (submenu) => {
    setSearchWhat(submenu.title);
    setMoreVisible(false);
    setTimeout(() => {
      setDrawer(true);
    }, 0);
  };

  const toggleMore = () => {
    setMoreVisible(!isMoreVisible);
  };

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
    {
      title: "more",
      submenu: [
        {
          title: "Art As Therapy",
          path: `/search?searchTerm=Art+As+Therapy&address=${address}`,
        },
        {
          title: "Music Therapy",
          path: `/search?searchTerm=Music+Therapy&address=${address}`,
        },
      ],
    },

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

  useEffect(() => {
    setDrawer(false);
  }, [location]);

  return (
    <header
      className={`text-base lg:text-sm sticky top-0 z-50 bg-white border-b ${
        isDrawer ? "blur-drawer" : ""
      }`}
    >
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
          className={`nav-menu flex-1 pb-2 mt-8 overflow-y-auto max-h-screen lg:block lg:overflow-visible lg:pb-0 lg:mt-0 ${
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
                  stroke="white"
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
                  className="w-full px-2 py-2 placeholder:text-gray-300 bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
                />
              </div>
            </form>
            {navigation.map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="block text-gray-100"
                  onClick={() => setState(false)}
                >
                  {item.title}
                </Link>
              );
            })}
            <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
              {currentUser ? (
                <>
                  <div className="hidden md:flex">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown();
                      }}
                      ref={dropdownRef}
                    />
                    <div
                      id="userDropdown"
                      onClick={() => setState(false)}
                      className={`z-10 ${
                        isDropdownVisible ? "" : "hidden"
                      } bg-gray-800 divide-y divide-gray-500 rounded-lg shadow w-44 dark:bg-gray-100 dark:divide-gray-600`}
                      style={{
                        position: "absolute",
                        top: "80px",
                        right: "10px",
                      }}
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
                          <li onClick={() => setDropdownVisible(false)}>
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
                            <li onClick={() => setDropdownVisible(false)}>
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
                  <div className="md:hidden flex flex-col fixed bottom-0 left-0 right-0 bg-gray-700 py-4 px-">
                    <div className="flex flex-row gap-2 items-center px-2">
                      <img
                        src={currentUser.profilePicture}
                        alt="user profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="text-base text-white">
                          {currentUser.username}
                        </p>
                        <p className="text-sm text-gray-300">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <li onClick={() => setState(false)}>
                        <Link
                          to="/dashboard?tab=dashboard"
                          className="block px-4 py-2  text-gray-200"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          to="/dashboard?tab=providers"
                          className="block px-4 py-2  text-gray-200"
                        >
                          Providers
                        </Link>
                        <Link
                          to="/dashboard?tab=messages"
                          className="block px-4 py-2  text-gray-200"
                        >
                          Message
                        </Link>
                        <Link
                          to="/dashboard?tab=profile"
                          className="block px-4 py-2 text-gray-200"
                        >
                          Profile
                        </Link>
                      </li>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex md:flex-row flex-col gap-4">
                  <Link
                    to="/signin"
                    onClick={() => setState(false)}
                    className=" block py-3 text-center text-slate-100 hover:text-purple-400 border rounded-lg md:border-none transition-all duration-300 ease-in-out"
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
      {isDrawer && (
        <div
          className={`bg-drawer w-full absolute 2xl:w-full justify-center 2xl:p-20 p-10 z-10 hidden md:flex transition-all duration-300 ease-in-out transform ${
            isDrawer ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          }`}
          ref={drawerRef}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchBar
            defaultSearchTerm={searchWhat}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      {showSubMenu && (
        <nav className="border-b">
          <ul className="hidden md:flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4 lg:px-8">
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
              if (item.title === "more") {
                return (
                  <li key={idx} className="relative py-1">
                    <span
                      className="block py-2 px-3 rounded-lg cursor-pointer text-slate-700"
                      ref={dropdownRef}
                      onClick={toggleMore}
                    >
                      {item.title}
                    </span>
                    {isMoreVisible && (
                      <ul className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg max-h-60 z-20">
                        {item.submenu.map((submenu, subIdx) => (
                          <li
                            key={subIdx}
                            className="block py-2 px-3 hover:bg-purple-100"
                          >
                            <p
                              className="block py-2 px-1 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubmenuItemClick(submenu, e);
                              }}
                            >
                              {submenu.title}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
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
