import { useState, useRef, useEffect } from "react";
import { suggestions } from "./suggestions";
import { useNavigate } from "react-router-dom";

function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdown, setDropDown] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(suggestions);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("address", "chennai");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
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
            value={searchTerm}
            placeholder="Find a therapist"
            onChange={handleInputChange}
            onFocus={() => setDropDown(true)}
            className="w-full px-2 py-2 placeholder:text-gray-300 bg-transparent rounded-md outline-none border-none focus:outline-none focus:border-transparent focus:ring-0"
          />
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
