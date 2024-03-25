import Select from "react-select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProviderItem from "../components/provider/ProviderItem";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

export default function Search() {
  const navigate = useNavigate();
  const [searchTerm, setsearchTerm] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState("false");
  const [providers, setProviders] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const suggestions = [
    "Diagnostic Evaluation",
    "Speech Therapy",
    "ABA Therapy",
    "Occupational Therapy",
  ];
  const whatoptions = suggestions.map((suggestion, index) => ({
    value: suggestion,
    label: suggestion,
  }));

  const options = [
    {
      value: "createdAt_desc",
      label: "Latest",
    },
    {
      value: "createdAt_asc",
      label: "Oldest",
    },
  ];

  const handleSelect = async (value) => {
    try {
      setLoading(true);
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setAddress(value);
    } catch (error) {
      console.error("Error occurred in handleSelect:", error);
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 120, // Reduced width
      height: 40, // Reduced height
      minHeight: 30,
    }),
    menu: (provided) => ({
      ...provided,
      width: "auto",
    }),
  };

  const handleChanges = (e) => {
    e.preventDefault();
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("address", address);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    let addressFromUrl = urlParams.get("address");
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl);
    }

    const fetchProvider = async (address) => {
      setLoading(true);
      setShowMore(false);
      urlParams.set("address", address);
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

    if (addressFromUrl) {
      setAddress(addressFromUrl);
      fetchProvider(addressFromUrl);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=3ff527dd52944833bd64a0290dd8f25b`
          );
          const data = await res.json();
          const city = data.results[0].components.city;
          setAddress(city);
          fetchProvider(city);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
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

  return (
    <div className="p-4 overflow-visible">
      <form
        className="flex justify-center outline outline-offset-2 outline-1 outline-gray-300 bg-white rounded-lg md:w-1/2"
        onSubmit={handlesubmit}
      >
        <div className="flex flex-col md:flex-row space-x-3  items-center overflow-visible">
          <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8 z-10">
            <label
              htmlFor="what"
              className="font-sans py-1 px-2 block text-base text-gray-700 font-bold mt-8"
            >
              What
            </label>
            <Select
              id="what"
              value={whatoptions.find((option) => option.value === searchTerm)}
              onChange={(option) => setsearchTerm(option.value)}
              options={whatoptions}
              placeholder="Select a service or provider"
              isSearchable
              className="capitalize trauncate text-base border-slate-800 w-full text-gray-900 py-1 px-2 leading-tight focus:outline-none overflow-visible"
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "transparent !important",
                  minWidth: 210,
                  width: "auto",
                  border: "none",
                  outline: "none",
                  boxShadow: 'none'
                }),
                singleValue: (provided) => ({
                  ...provided,
                  maxWidth: 160, // This sets the maximum width of the selected option text
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
              }}
            />
          </div>
          <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
            <label
              htmlFor="where"
              className="block py-1 px-2 text-base font-bold text-gray-700 mt-8"
            >
              Where
            </label>
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
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
                      placeholder: "City, State or Zip Code",
                      className:
                        "appearance-none bg-transparent capitalize text-base border-none w-full text-gray-700 py-3 px-4 leading-tight focus:outline-none location-search-input",
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
          <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
            <label
              htmlFor="insurance"
              className="block py-1 px-2 text-base font-bold text-gray-700 mt-8"
            >
              Insurance
            </label>
            <input
              type="text"
              id="insurance"
              placeholder="Not Sure? Skip"
              className=" bg-transparent text-base border-none w-full text-gray-700  py-3 px-4 leading-tight focus:outline-none "
            />
          </div>
          <button
            type="submit"
            className=" py-3 px-4 font-medium  text-indigo-950 bg-sky-300 hover:bg-sky-200 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mt-4 mb-4"
          >
            Search
          </button>
        </div>
      </form>

      <div className="">
        <div className="sm:flex-col lg:flex-row lg:w-1/2"> </div>
        <div>
          {/* <div className="py-2 flex items-center">
            <label className=" font-semibold mr-2">Sort:</label>
            <Select
              id="sort_order"
              options={options}
              styles={customStyles}
              onChange={handleChanges}
              defaultValue={"created_at_dec"}
            />
          </div> */}
        </div>
        <div className="p-7 flex flex-col gap-4">
          {!loading && providers.length === 0 && (
            <p className="text-center text-xl text-slate-700">
              We couldn&apos;t find any doctors for you
            </p>
          )}
          {loading && (
            <p className="text-center text-xl text-slate-700 w-full">
              Loading...
            </p>
          )}
          {!loading &&
            providers &&
            providers.map((provider) => {
              return <ProviderItem key={provider._id} provider={provider} />;
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
