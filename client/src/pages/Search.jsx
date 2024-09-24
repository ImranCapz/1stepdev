import CreateSelect from "react-select/creatable";
import PropTypes from "prop-types";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { HiOutlineFilter } from "react-icons/hi";
import ContentLoader from "react-content-loader";
import { Button } from "@material-tailwind/react";
import TopLoadingBar from "react-top-loading-bar";
import { Link, useLocation } from "react-router-dom";
import { suggestions } from "../components/suggestions";
import React, { useEffect, useRef, useState } from "react";
import ProviderItem from "../components/provider/ProviderItem";
import { Checkbox, Spinner, Pagination } from "flowbite-react";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";
import { searchService } from "../redux/user/userSlice";

export default function Search() {
  const searchTermFromHeader = useSelector((state) => state.user.searchService);
  const [searchTerm, setsearchTerm] = useState(searchTermFromHeader || "");
  const [address, setAddress] = useState("");
  const [providerloading, setProviderLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const topLoadingBarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  //checkbox
  const [checkbox, setCheckbox] = useState("");
  const handlecheckbox = (e) => {
    setCheckbox(e.target.id);
  };

  //pageination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [totalCount, setTotalCount] = useState(0);

  //drawer
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const whatoptions = suggestions.map((suggestion) => ({
  //   value: suggestion.value,
  //   label: suggestion.value,
  //   isDisabled: suggestion.isDisabled,
  // }));

  const handleSelect = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setAddress({ city: value });
    } catch (error) {
      console.error("Error occurred in handleSelect:", error);
    }
  };

  const [isDropdown, setDropDown] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(suggestions);

  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setsearchTerm(value);
    setDropDown(true);
    const filteredSuggestion = suggestions.filter((suggestion) =>
      suggestion.value.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (filteredSuggestion.length === 0 && value) {
      setSuggestionsList([{ label: value, value, isDisabled: false }]);
    } else {
      setSuggestionsList(filteredSuggestion);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDown(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("address", address.city);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setCurrentPage(1);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl && searchTermFromUrl !== searchTerm) {
      setsearchTerm(searchTermFromUrl);
    }
    const fetchProvider = async (address) => {
      setLoading(true);
      setProviderLoading(true);
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm", searchTerm);
      urlParams.set("address", address.city);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/server/provider/get?${searchQuery}`);
      const data = await res.json();
      setProviders(data.providers);
      setProviderLoading(false);
      setLoading(false);
    };
    let addressFromUrl = urlParams.get("address");
    if (addressFromUrl) {
      const address = { city: addressFromUrl };
      setAddress(address);
      fetchProvider(address);
    }
    // else {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(async (position) => {
    //       const res = await fetch(
    //         `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=fedcc649cb88412196b0d38073698d71`
    //       );
    //       const data = await res.json();
    //       const city = data.results[0].components.city;
    //       setAddress({ city: city });
    //       fetchProvider(city);
    //     });
    //   } else {
    //     console.log("Geolocation is not supported by this browser.");
    //   }
    // }
    topLoadingBarRef.current.complete();
  }, [location.search]);

  const onPageChange = async (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/provider/get?${searchQuery}`);
    const data = await res.json();
    setProviders(data.providers);
    setTotalCount(data.totalCount);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    onPageChange(1);
  }, []);

  useEffect(() => {
    if (providers && providers.length !== 0) {
      document.title = `${providers.length} BEST ${new URLSearchParams(
        location.search
      ).get("searchTerm")} near ${address.city}`;
    } else {
      document.title = "1Step";
    }
  });

  const getSubmenuNav = (address) => [
    { title: "Overview", path: "/" },
    {
      title: "Diagnostic Evaluation",
      path: `/freescreeners`,
    },
    {
      title: "Occupational Therapy",
      path: `/search?searchTerm=Occupational+Therapy&address=${address.city}`,
    },
    {
      title: "Speech Therapy",
      path: `/search?searchTerm=Speech+Therapy&address=${address.city}`,
    },
    {
      title: "School-Based Service",
      path: `/search?searchTerm=School-Based+Service&address=${address.city}`,
    },
    {
      title: "more",
      submenu: [
        {
          title: "Art As Therapy",
          path: `/search?searchTerm=Art+As+Therapy&address=${address.city}`,
        },
        {
          title: "Music Therapy",
          path: `/search?searchTerm=Music+Therapy&address=${address.city}`,
        },
      ],
    },

    { title: "|" },
    { title: "Learn:" },
    { title: "Early Concerns: Start Here", path: "/early-concerns" },
    { title: "Latest Articles", path: "/latest-articles" },
  ];

  const submenuNav = getSubmenuNav(address);

  return (
    <>
      <div className="obsolute">
        <nav className="border-b">
          <ul className="hidden md:flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4 lg:px-8">
            {submenuNav.map((item, idx) => {
              if (item.title === "Learn:" || item.title === "|") {
                return (
                  <li key={idx} className="py-1">
                    <span className="block text-sm py-2 px-3 rounded-lg text-gray-700">
                      {item.title}
                    </span>
                  </li>
                );
              }
              if (item.title === "more") {
                return (
                  <li key={idx} className="relative py-1">
                    <span className="block py-2 px-3 text-sm rounded-lg cursor-pointer text-slate-700">
                      {item.title}
                    </span>
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
                    onClick={() => {
                      setsearchTerm(item.title);
                    }}
                    className="block md:text-xs 2xl:text-sm py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150 cursor-pointer"
                  >
                    {Array.isArray(item.title) ? item.title : item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="w-full md:p-8 sm:mx-auto overflow-visible min-h-screen chatbgimage">
        <TopLoadingBar
          ref={topLoadingBarRef}
          color="#ff9900"
          height={3}
          speed={1000}
        />{" "}
        <div className="w-full overflow-visible">
          <React.Fragment>
            <Drawer open={open} onClose={closeDrawer} className="p-4 z-50">
              <div className="mb-6 flex items-center justify-between">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="b-2 border-b w-full "
                >
                  Filters
                </Typography>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={closeDrawer}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </div>
              <div className="mb-4">
                <h1 className="mb-4">Care Settings</h1>
                <div className="flex flex-col items-start border p-3 border-slate-300 rounded-lg">
                  <div className="">
                    <div>
                      <Checkbox
                        id="virtual"
                        color="blue"
                        checked={checkbox === "virtual"}
                        className="mr-2"
                        onChange={handlecheckbox}
                      />
                      <label>Virtual</label>
                    </div>
                    <Checkbox
                      id="clinic"
                      color="blue"
                      className="mr-2"
                      checked={checkbox === "clinic"}
                      onChange={handlecheckbox}
                    />
                    <label>In-Clinic</label>
                  </div>
                  <div>
                    <Checkbox
                      id="home"
                      color="blue"
                      className="mr-2"
                      checked={checkbox === "home"}
                      onChange={handlecheckbox}
                    />
                    <label>In-Home</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-center">
                <Button
                  size="sm"
                  variant="outlined"
                  className="flex gap-2 w-full text-center"
                  onClick={closeDrawer}
                >
                  Cancel
                </Button>
                <Button size="sm" className="flex gap-2 w-full">
                  Save
                </Button>
              </div>
            </Drawer>
          </React.Fragment>
        </div>
        <div className="flex items-center justify-center md:mt-10">
          <form
            className="p-4 flex sm:w-[600px] justify-center md:outline outline-offset-2 outline-1 outline-gray-300 md:bg-white rounded-lg md:shadow-lg"
            onSubmit={handlesubmit}
          >
            <div className="flex flex-row md:flex-row space-x-3 items-center overflow-visible">
              <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 z-20">
                <label
                  htmlFor="what"
                  className="font-sans px-2 block mt-1 md:mt-0 text-base text-gray-700 font-bold"
                >
                  What
                </label>
                {/* <CreateSelect
                  id="what"
                  value={
                    whatoptions.find(
                      (option) => option.value === searchTerm
                    ) || {
                      value: searchTerm,
                      label: searchTerm,
                      isDisabled: false,
                    }
                  }
                  onChange={(option) => {
                    setsearchTerm(option ? option.value : "");
                    // Optionally, update other state or perform actions here
                  }}
                  options={whatoptions}
                  onInputChange={(inputValue, { action }) => {
                    if (action === "input-change") {
                      setInputValue(inputValue);
                      console.log(inputValue);
                      dispatch(searchService(inputValue));
                      setsearchTerm(inputValue);
                    }
                  }}
                  placeholder="Service or provider"
                  isSearchable
                  className="md:w-full capitalize trauncate md:text-base text-xs border-slate-800 text-gray-900 px-2 leading-tight"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "transparent",
                      minWidth: windowWidth > 786 ? 210 : 160,
                      width: "auto",
                      margin: 0,
                      border: "0px solid black",
                      boxShadow: state.isFocused ? 0 : 0,
                      "&:hover": {
                        border: "0px solid black",
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      maxWidth: 160,
                      position: "absolute",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected
                        ? "#F9CB5E"
                        : provided.backgroundColor,
                      color: state.isSelected ? "#4D4A45" : provided.color,
                    }),
                    indicatorSeparator: () => ({}),
                    menu: (provided) => ({
                      ...provided,
                      width: windowWidth > 786 ? 290 : 250,
                    }),
                  }}
                  noOptionsMessage={() => null}
                  formatCreateLabel={(inputValue) => (
                    <div className="flex flex-row items-center">
                      <FaSearch className="mr-2 text-slate-500" />
                      <span>{inputValue}</span>
                    </div>
                  )}
                /> */}
                <div ref={dropdownRef}>
                  <div className="flex items-center gap-1 px-2 rounded-lg">
                    <input
                      type="text"
                      id="what"
                      name="what"
                      value={searchTerm}
                      placeholder="Service or Provider"
                      onChange={handleInputChange}
                      onFocus={() => setDropDown(true)}
                      required
                      className="w-full capitalize text-sm md:text-base py-1.5 text-gray placeholder:text-gray-500 bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
                    />
                  </div>
                  {isDropdown && (
                    <ul className="p-3 absolute top-[70px] right-18 w-72 border border-slate-300 bg-white rounded-lg max-h-72 overflow-y-auto">
                      {suggestionsList.map((suggestions, index) => (
                        <li
                          key={index}
                          className={`px-4 py-2 text-base text-gray-800 ${
                            suggestions.isDisabled
                              ? "opacity-50"
                              : "cursor-pointer rounded-lg text-gray transition duration-300 ease-in-out"
                          } ${
                            searchTerm === suggestions.label
                              ? "header-selectOptionbg"
                              : suggestions.isDisabled
                              ? ""
                              : "header-Search"
                          }`}
                          onClick={() => {
                            if (!suggestions.isDisabled) {
                              setsearchTerm(suggestions.label);
                              dispatch(searchService(suggestions.label));
                              setDropDown(false);
                            }
                          }}
                        >
                          {suggestions.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="transform border-b-2 md:mb-1 mt-0.5 md:mt-0 bg-transparent text-lg duration-300 focus-within:border-amber-500">
                <label
                  htmlFor="where"
                  className="block px-2 text-base font-bold text-gray-700"
                >
                  Where
                </label>
                <PlacesAutocomplete
                  id="where"
                  value={address.city || ""}
                  onChange={(value) => setAddress({ city: value })}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    // loading,
                  }) => (
                    <div style={{ position: "relative" }}>
                      <input
                        {...getInputProps({
                          placeholder: "City or Zip Code",
                          className:
                            "w-28 md:w-full appearance-none bg-transparent capitalize md:text-base text-sm border-none text-gray-700 px-3 leading-tight focus:outline-none location-search-input focus:outline-none focus:border-transparent focus:ring-0",
                        })}
                      />
                      <div
                        className="text-base autocomplete-dropdown-container overflow-hidden"
                        style={{ position: "absolute", zIndex: 1000 }}
                      >
                        {/* {loading && <div>Loading...</div>} */}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                              key={suggestion.placeId}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              {/* <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 sm:block hidden">
            <label
              htmlFor="insurance"
              className="block py-1 px-2 text-base font-bold text-gray-700"
            >
              Insurance
            </label>
            <input
              type="text"
              id="insurance"
              placeholder="Not Sure? Skip"
              className="bg-transparent text-base border-none w-full text-gray-700  py-3 px-4 leading-tight focus:outline-none focus:border-transparent focus:ring-0"
            />
          </div> */}
              <button
                type="submit"
                className={`p-3 h-12 w-12 font-medium text-indigo-950 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mt-4 mb-4 focus:outline-none focus:border-transparent focus:ring-0 flex items-center justify-center ${
                  loading ? "bg-primary-50" : "btn-color"
                }`}
              >
                {loading ? (
                  <Spinner
                    color="purple"
                    size="md"
                    className="flex items-center justify-center"
                  />
                ) : (
                  <FaSearch className="h-4 w-6" />
                )}
              </button>
            </div>
          </form>
        </div>
        <hr className="border-gray-300 flex md:hidden" />
        <div className="space-y-3 p-">
          <div className="sm:flex-col lg:flex-row lg:w-1/2"> </div>
          <div>
            <div className="md:py-2 pl-2 md:pl-0 flex items-center">
              <Button
                variant="outlined"
                className="flex flex-row text-gray-800 items-center gap-2 font-bold"
                onClick={openDrawer}
              >
                <HiOutlineFilter />
                Filter
              </Button>
            </div>
            <div className="breadcrumbs flex flex-row font-semibold text-sm mt-2 text-gray-700 md:justify-start justify-center">
              <Link to={"/"} className="hover:underline hover:text-purple-500">
                Home
              </Link>
              &nbsp;&gt;
              <Link
                to={`/${searchTerm}`}
                className="hover:underline hover:text-purple-500"
              >
                &nbsp;{new URLSearchParams(location.search).get("searchTerm")}
              </Link>{" "}
              &nbsp;&gt;
              <p>&nbsp;{new URLSearchParams(location.search).get("address")}</p>
            </div>
          </div>
          {providers && providers.length !== 0 && !providerloading && (
            <>
              <div className="font-bold text-xl md:text-3xl text-gray justify-center md:text-start text-center">
                {providers.length} Best{" "}
                {new URLSearchParams(location.search).get("searchTerm")} near{" "}
                {new URLSearchParams(location.search).get("address")}
              </div>
            </>
          )}
          <div className="md:px-3 2xl:px-40 2xl:mx-auto">
            <div>
              {providerloading ? (
                providers.length > 0 ? (
                  <div className="mx-auto grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 text-center text-xl text-slate-700 w-full">
                    {providers.map((provider) => (
                      <React.Fragment key={provider._id}>
                        <div className="md:hidden block">
                          <ContentLoader
                            viewBox="0 0 320 220"
                            speed={2}
                            height={250}
                            width={360}
                            backgroundColor="#e2e2e2"
                            foregroundColor="#D1BEE0"
                          >
                            <circle cx="40" cy="90" r="36" />
                            <rect
                              x="90"
                              y="64"
                              rx="4"
                              ry="4"
                              width="100"
                              height="9"
                            />
                            <rect
                              x="90"
                              y="86"
                              rx="4"
                              ry="4"
                              width="140"
                              height="13"
                            />
                            <rect
                              x="90"
                              y="110"
                              rx="4"
                              ry="4"
                              width="290"
                              height="9"
                            />
                            <rect
                              x="20"
                              y="150"
                              rx="4"
                              ry="4"
                              width="150"
                              height="9"
                            />
                            <rect
                              x="20"
                              y="135"
                              rx="4"
                              ry="4"
                              width="190"
                              height="9"
                            />
                            <rect
                              x="20"
                              y="170"
                              rx="4"
                              ry="4"
                              width="100"
                              height="9"
                            />
                            (button)
                            <rect
                              x="20"
                              y="190"
                              rx="4"
                              ry="4"
                              width="290"
                              height="34"
                            />
                          </ContentLoader>
                        </div>
                        <div className="lg:block hidden mt-16 ml-2">
                          <ContentLoader
                            viewBox="0 0 300 300"
                            speed={2}
                            height={500}
                            width={400}
                            backgroundColor="#e2e2e2"
                            foregroundColor="#D1BEE0"
                          >
                            <circle cx="150" cy="60" r="56" />
                            <rect
                              x="100"
                              y="125"
                              rx="4"
                              ry="4"
                              width="100"
                              height="9"
                            />
                            <rect
                              x="75"
                              y="146"
                              rx="4"
                              ry="4"
                              width="140"
                              height="13"
                            />
                            <rect
                              x="50"
                              y="170"
                              rx="4"
                              ry="4"
                              width="190"
                              height="9"
                            />
                            <rect
                              x="50"
                              y="190"
                              rx="4"
                              ry="4"
                              width="150"
                              height="9"
                            />
                            <rect
                              x="50"
                              y="210"
                              rx="4"
                              ry="4"
                              width="220"
                              height="9"
                            />
                            <rect
                              x="50"
                              y="253"
                              rx="4"
                              ry="4"
                              width="60"
                              height="9"
                            />
                            (button)
                            <rect
                              x="165"
                              y="240"
                              rx="4"
                              ry="4"
                              width="110"
                              height="34"
                            />
                          </ContentLoader>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : null
              ) : (
                <div className="p-2 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:gap-4 md:gap-8 sm:p-3">
                  {providers && providers.length > 0 ? (
                    providers.map((provider) => {
                      return (
                        <ProviderItem
                          key={provider._id}
                          provider={{
                            ...provider,
                            totalrating: parseFloat(provider.totalrating),
                          }}
                        />
                      );
                    })
                  ) : (
                    <p className="text-xl text-slate-700">
                      We couldn&apos;t find any doctors for you
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {providers &&
            providers.length > 0 &&
            totalCount > itemsPerPage &&
            !providerloading &&
            !loading && (
              <div className="p-4">
                <Pagination
                  totalPages={Math.ceil(totalCount / itemsPerPage)}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                  showIcons
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

Search.propTypes = {
  searchTermFromHeader: PropTypes.string,
};
