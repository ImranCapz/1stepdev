import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import CreateSelect from "react-select/creatable";
import { FaSearch } from "react-icons/fa";
import { City } from "country-state-city";
import { suggestions } from "./suggestions";
import { useDispatch } from "react-redux";
import { searchService } from "../redux/user/userSlice";

import PropTypes from "prop-types";

export const SearchBar = ({ defaultSearchTerm }) => {
  const navigate = useNavigate();
  const [searchTerm, setsearchTerm] = useState(defaultSearchTerm || "");
  const [address, setAddress] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [providers, setProviders] = useState([]);
  const [windowwidth, setWindowWidth] = useState(window.innerWidth);

  const [isDropdown, setDropDown] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(suggestions);

  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setsearchTerm(value);
    dispatch(searchService(value));
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

  const fetchProvider = async (address) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("address", address);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/provider/get?${searchQuery}`);
    const data = await res.json();
    setProviders(data);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    if (!address) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then(async (location) => {
          const city = location.city;
          setAddress(city);
          urlParams.set("address", city);
          const searchQuery = urlParams.toString();
          navigate(`/search?${searchQuery}`);
        });
    } else {
      urlParams.set("address", address);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    let addressFromUrl = urlParams.get("address");
    if (addressFromUrl) {
      setAddress(addressFromUrl);
      fetchProvider(addressFromUrl);
    } else {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((location) => {
          const state = location.region_code;
          const cities = City.getCitiesOfState("IN", state);
          setCityOptions(
            cities.map((city) => ({
              value: city.name,
              label: city.name,
            }))
          );
          setAddress(location.city);
        });
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("Resize", handleResize);
  }, []);

  return (
    <div className="pl-5 pr-5 flex max-w-[750px] max-h-[300px] justify-center outline outline-offset-2 outline-1 outline-gray-300 bg-white rounded-lg">
      <form
        className="flex flex-row space-x-3 items-center"
        onSubmit={handlesubmit}
      >
        <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8 z-10">
          <label
            htmlFor="what"
            className="font-sans mb-1.5 md:mb-0 py-1 px-2 block text-base text-gray-700 font-bold mt-8"
          >
            What
          </label>
          <div ref={dropdownRef}>
            <div className="flex items-center gap-1 px-2 rounded-lg">
              <input
                type="text"
                name="searchInput"
                value={searchTerm}
                placeholder="Service or Provider"
                onChange={handleInputChange}
                onFocus={() => setDropDown(true)}
                required
                className="w-full text-xs md:text-base text-gray placeholder:text-gray-500 bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
              />
            </div>
            {isDropdown && (
              <ul className="p-3 absolute top-[110px] right-18 w-72 border border-slate-300 bg-white rounded-lg max-h-72 overflow-y-auto">
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
        <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8 z-10">
          <label
            htmlFor="address"
            className="block py-1 px-2 md:mb-0.5 text-base font-bold text-gray-700 mt-8"
          >
            Where
          </label>
          <CreateSelect
            type="address"
            id="address"
            placeholder="City, Pin Code"
            value={cityOptions.find((option) => option.value === address)}
            onChange={(option) => setAddress(option.value)}
            onInputChange={(inputValue, { action }) => {
              if (action === "input-change") {
                setAddress(inputValue);
              }
            }}
            options={cityOptions}
            isSearchable
            className="capitalize trauncate text-xs md:text-sm border-slate-800 w-full text-gray-900 leading-tight focus:outline-none overflow-visible"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "transparent !important",
                minWidth: windowwidth < 786 ? 110 : 260,
                width: "auto",
                border: "none",
                outline: "none",
                boxShadow: "none",
                transition: "all 0.3s ease",
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
              menu: (provided) => ({
                ...provided,
                width: windowwidth < 768 ? 189 : 290,
                textAlign: "left",
              }),
            }}
            formatCreateLabel={(inputValue) => (
              <div className="flex flex-row items-center">
                <FaSearch className="mr-2 text-slate-500" />
                <span>{inputValue}</span>
              </div>
            )}
          />
        </div>
        {/* <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
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
            className="appearance-none bg-transparent capitalize text-sm border-none w-full text-gray-700 py-2 px-3 leading-tight focus:outline-none focus:border-transparent focus:ring-0 "
          />
        </div> */}
        <button
          type="submit"
          data-ripple-light="true"
          className="py-4 px-5 font-medium text-indigo-950 btn-color transition ease-in-out duration-300 disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs  rounded-lg shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none mt-4 mb-4 mr-4"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  defaultSearchTerm: PropTypes.string,
};

export default SearchBar;
