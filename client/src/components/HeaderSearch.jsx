import { useDispatch } from "react-redux";
import { suggestions } from "./suggestions";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { searchService } from "../redux/user/userSlice";

function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdown, setDropDown] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(
    suggestions.slice(0, 5)
  );

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setDropDown(false);
    dispatch(searchService(searchTerm));
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("address", "Chennai");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative`} ref={dropdownRef}>
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-1 px-2 border rounded-lg border-gray-400">
          <input
            type="text"
            name="searchInput"
            value={searchTerm}
            placeholder="Find a therapist"
            onChange={handleInputChange}
            onFocus={() => setDropDown(true)}
            required
            className="w-full px-2 py-2 placeholder:text-gray-300 bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
          />

          <button type="submit">search</button>
        </div>
        {isDropdown && (
          <ul className="p-3 absolute top-12 right-18 w-56 bg-white rounded-lg">
            {suggestionsList.map((suggestions, index) => (
              <li
                key={index}
                className={`px-4 py-2  text-gray-800 ${
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
                    setSearchTerm(suggestions.label);
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
      </form>
    </div>
  );
}

export default HeaderSearch;
