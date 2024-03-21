import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const SearchBar = () => {

  const navigate = useNavigate();
  const [searchTerm,setsearchTerm] = useState('');
  const [address, setAddress] = useState('');


  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    urlParams.set('address',address);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const addressFromUrl = urlParams.get('address');
    if(searchTermFromUrl){
      setsearchTerm(searchTermFromUrl);
    }
    if(addressFromUrl){
      setAddress(addressFromUrl);
    }
  },[location.search])


  return (
    <div className='flex justify-center outline outline-offset-2 outline-1 outline-gray-300 bg-white rounded-lg'>
      <form className="tailwind-search-bar flex flex-col md:flex-row space-x-3  items-center" onSubmit={handlesubmit}>
        <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
          <label htmlFor="what" className="font-sans py-1 px-2 block text-base text-gray-700 font-bold mt-8">
            What
          </label>
          <input
            type="text"
            id="what"
            placeholder="Service or provider name"
            className="bg-transparent text-sm border-slate-800 w-full text-gray-900 py-1 px-2 leading-tight focus:outline-none"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
            required
          />
        </div>
        <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
          <label htmlFor="where" className="block py-1 px-2 text-base font-bold text-gray-700 mt-8">
            Where
          </label>
          <input
            type="address"
            id="address"
            placeholder="City, State, Zip Code"
            value={address}
            onChange={(e)=> setAddress(e.target.value)}
            className="appearance-none bg-transparent text-sm border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
          />
        </div>
        <div className="transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-amber-500 mb-8">
          <label htmlFor="insurance" className="block py-1 px-2 text-base font-bold text-gray-700 mt-8">
            Insurance
          </label>
          <input
            type="text"
            id="insurance"
            placeholder="Not Sure? Skip"
            className=" bg-transparent text-sm border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none "
          />
        </div>
        <button type="submit" className=" py-3 px-4 font-medium  text-indigo-950 bg-sky-300 hover:bg-sky-200 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mt-4 mb-4">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
