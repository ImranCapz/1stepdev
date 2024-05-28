import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import { City } from "country-state-city";
import CreatableSelect from "react-select/creatable";

import PropTypes from "prop-types";

export const SearchBar = ({ defaultSearchTerm }) => {
  const navigate = useNavigate();
  const [searchTerm, setsearchTerm] = useState(defaultSearchTerm || "");
  const [address, setAddress] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [providers, setProviders] = useState([]);

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
    }else{
      urlParams.set("address",address);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    let addressFromUrl = urlParams.get("address");
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl);
    }
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
  }, []);

  return (
    <div className="flex justify-center outline outline-offset-2 outline-1 outline-gray-300 bg-white rounded-lg">
      <form
        className="flex flex-col md:flex-row space-x-3 items-center"
        onSubmit={handlesubmit}
      >
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
            placeholder="Service or provider"
            required
            isSearchable
            className="capitalize trauncate text-sm border-slate-800 w-full text-gray-900 leading-tight focus:outline-none overflow-visible"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "transparent !important",
                minWidth: 210,
                width: "auto",
                border: "none",
                outline: "none",
                boxShadow: "none",
                transition: "all 0.3s ease",
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
          <CreatableSelect
            type="address"
            id="address"
            placeholder="City, Pin Code"
            value={cityOptions.find((option) => option.value === address)}
            onChange={(option) => setAddress(option.value)}
            options={cityOptions}
            isSearchable
            className="capitalize trauncate text-sm border-slate-800 w-full text-gray-900 leading-tight focus:outline-none overflow-visible"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "transparent !important",
                minWidth: 210,
                width: "auto",
                border: "none",
                outline: "none",
                boxShadow: "none",
                transition: "all 0.3s ease",
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
        </div>
        <button
          type="submit"
          data-ripple-light="true"
          className="py-4 px-5 font-medium text-indigo-950 bg-sky-400 hover:bg-sky-300 transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs  rounded-lg shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none mt-4 mb-4 mr-4"
        >
          <FaSearch/>
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes ={
  defaultSearchTerm: PropTypes.string
}

export default SearchBar;
