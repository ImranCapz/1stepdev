import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ProviderItem from "../components/provider/ProviderItem";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import TopLoadingBar from "react-top-loading-bar";
import { FaSearch } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import { HiOutlineFilter } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import ContentLoader from "react-content-loader";

export default function Search() {
  const navigate = useNavigate();
  const [searchTerm, setsearchTerm] = useState("");
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState("false");
  const [providers, setProviders] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const topLoadingBarRef = useRef(null);
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const suggestions = [
    { value: "Popular Search", label: "Popular Services", isDisabled: true },
    { value: "Diagnostic Evaluation", label: "Diagnostic Evaluation" },
    { value: "Speech Therapy", label: "Speech Therapy" },
    { value: "ABA Therapy", label: "ABA Therapy" },
    { value: "Occupational Therapy", label: "Occupational Therapy" },
    { value: "School-Based Service", label: "School-Based Service" },
    { value: "A-Z Services", label: "Popular Services", isDisabled: true },
    { value: "Dance Movement", label: "Dance Movement" },
    { value: "Art as Therapy", label: "Art as Therapy" },
    { value: "Counselling", label: "Counselling" },
  ];

  const whatoptions = suggestions.map((suggestion) => ({
    value: suggestion.value,
    label: suggestion.value,
    isDisabled: suggestion.isDisabled,
  }));

  const handleSelect = async (value) => {
    try {
      setLoading(true);
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setAddress({ city: value });
    } catch (error) {
      console.error("Error occurred in handleSelect:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("address", address.city);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl);
    }

    const fetchProvider = async (address) => {
      setLoading(true);
      setShowMore(false);
      urlParams.set("address", address.city);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/server/provider/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setProviders(data);
      setLoading(false);
    };
    let addressFromUrl = urlParams.get("address");
    if (addressFromUrl) {
      const address = { city: addressFromUrl };
      setAddress(address);
      fetchProvider(address);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=fedcc649cb88412196b0d38073698d71`
          );
          const data = await res.json();
          const city = data.results[0].components.city;
          setAddress({ city: city });
          fetchProvider(city);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } 
    topLoadingBarRef.current.complete();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const numberofproviders = providers.length();
    const startIndex = numberofproviders;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/provider/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 8) {
      setShowMore(false);
    }
    setProviders([...providers, ...data]);
  };

  useEffect(() => {
    if (providers.length !== 0) {
      document.title = `${providers.length} BEST ${new URLSearchParams(
        location.search
      ).get("searchTerm")} near ${address.city}`;
    } else {
      document.title = "1Step";
    }
  });

  return (
    <div className="p-4 md:p-8 overflow-visible">
      <TopLoadingBar
        ref={topLoadingBarRef}
        color="#ff9900"
        height={3}
        speed={1000}
      />{" "}
      <form
        className="p-4 flex sm:w-[750px] justify-center outline outline-offset-2 outline-1 outline-gray-300 bg-white rounded-lg shadow-lg"
        onSubmit={handlesubmit}
      >
        <div className="flex flex-row md:flex-row space-x-3 items-center overflow-visible">
          <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 z-10">
            <label
              htmlFor="what"
              className="font-sans py-1 px-2 block text-base text-gray-700 font-bold"
            >
              What
            </label>
            <Select
              id="what"
              value={whatoptions.find((option) => option.value === searchTerm)}
              onChange={(option) => setsearchTerm(option.value)}
              options={whatoptions}
              placeholder="Service or provider"
              isSearchable
              className=" md:w-full capitalize trauncate md:text-base text-sm border-slate-800 text-gray-900 py-1 px-2 leading-tight"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "transparent",
                  minWidth: windowWidth > 786 ? 210 : 140,
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
              }}
            />
          </div>
          <div className="transform border-b-2 md:mb-1 bg-transparent text-lg duration-300 focus-within:border-amber-500  ">
            <label
              htmlFor="where"
              className="block py-1 px-2 text-base font-bold text-gray-700"
            >
              Where
            </label>
            <PlacesAutocomplete
              value={address.city || ""}
              onChange={(value) => setAddress({ city: value })}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div style={{ position: "relative" }}>
                  <input
                    {...getInputProps({
                      placeholder: "City or Zip Code",
                      className:
                        "w-28 md:w-full appearance-none bg-transparent capitalize md:text-base text-sm border-none text-gray-700 py-3 px-4 leading-tight focus:outline-none location-search-input focus:outline-none focus:border-transparent focus:ring-0",
                    })}
                  />
                  <div
                    className="text-base autocomplete-dropdown-container overflow-hidden"
                    style={{ position: "absolute", zIndex: 1000 }}
                  >
                    {loading && <div>Loading...</div>}
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
          <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 sm:block hidden">
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
              className=" bg-transparent text-base border-none w-full text-gray-700  py-3 px-4 leading-tight focus:outline-none focus:border-transparent focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="py-3 px-4 font-medium  text-indigo-950 bg-sky-300 hover:bg-sky-200 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mt-4 mb-4 focus:outline-none focus:border-transparent focus:ring-0"
          >
            <span className="lg:inline hidden">Search</span>
            <FaSearch className="lg:hidden inline" />
          </button>
        </div>
      </form>
      <div className="space-y-3">
        <div className="sm:flex-col lg:flex-row lg:w-1/2"> </div>
        <div>
          <div className="py-2 flex items-center">
            <Button
              variant="outlined"
              className="flex flex-row text-gray-800 items-center gap-2 font-bold"
            >
              <HiOutlineFilter />
              Filter
            </Button>
          </div>
          <div className="breadcrumbs font-semibold text-sm mt-2 text-gray-700">
            <Link to={"/"}>Home</Link> &gt;
            <Link
              to={`/search?searchTerm=${searchTerm}&address=${address.city}`}
            >
              &nbsp;{new URLSearchParams(location.search).get("searchTerm")}
            </Link>{" "}
            &gt;
            <Link
              to={`/search?searchTerm=${searchTerm}&address=${address.city}`}
            >
              &nbsp;{new URLSearchParams(location.search).get("address")}
            </Link>
          </div>
        </div>
        {providers.length !== 0 && (
          <>
            <div className="font-bold text-xl md:text-3xl text-gray">
              {providers.length} Best{" "}
              {new URLSearchParams(location.search).get("searchTerm")} near{" "}
              {address.city}
            </div>
          </>
        )}
        <div className="flex flex-col gap-4">
          {!loading && providers.length === 0 && (
            <p className="text-center text-xl text-slate-700">
              We couldn&apos;t find any doctors for you
            </p>
          )}
          {loading && (
            <p className="text-center text-xl text-slate-700 w-full">
              <ContentLoader
                viewBox="0 0 500 475"
                height={475}
                width={500}
              >
                <circle cx="70.2" cy="73.2" r="41.3" />
                <rect x="129.9" y="29.5" width="125.5" height="17" />
                <rect x="129.9" y="64.7" width="296" height="17" />
                <rect x="129.9" y="97.8" width="253.5" height="17" />
                <rect x="129.9" y="132.3" width="212.5" height="17" />

                <circle cx="70.7" cy="243.5" r="41.3" />
                <rect x="130.4" y="199.9" width="125.5" height="17" />
                <rect x="130.4" y="235" width="296" height="17" />
                <rect x="130.4" y="268.2" width="253.5" height="17" />
                <rect x="130.4" y="302.6" width="212.5" height="17" />

                <circle cx="70.7" cy="412.7" r="41.3" />
                <rect x="130.4" y="369" width="125.5" height="17" />
                <rect x="130.4" y="404.2" width="296" height="17" />
                <rect x="130.4" y="437.3" width="253.5" height="17" />
                <rect x="130.4" y="471.8" width="212.5" height="17" />
              </ContentLoader>
            </p>
          )}
          {!loading &&
            providers &&
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
            })}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
