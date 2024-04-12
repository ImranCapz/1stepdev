import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import ProviderItem from "./ProviderItem";
import SearchBar from "../SearchBar";
import { set } from "mongoose";

export default function FavoriteList() {
  const { currentUser } = useSelector((state) => state.user);
  const [favoriteList, setFavoriteList] = useState(null);
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const fetchFavoriteList = async () => {
      try {
        const res = await fetch(
          `/server/favorite/favoritelist/${currentUser._id}`
        );
        const data = await res.json();
        if (res.success === false) {
          console.log("Error in fetching favorite list");
          return;
        }
        if (Array.isArray(data.favorites)) {
          setFavoriteList(data.favorites);
        }
      } catch (error) {
        console.log("Error in fetching favorite list");
      }
    };
    fetchFavoriteList();
  },[currentUser]);

  return (
    <div className="">
      <div className="h-52vh md:h-72vh bg-listbg bg-cover bg-center flex flex-col justify-center items-center text-white">
        <div className="">
          <h1 className="flex flex-col items-center text-2xl font-semibold text-zinc-600">
            Lists
          </h1>
          <h1 className="flex flex-col items-center text-5xl font-bold mt-6  text-gray-700">
            My Saved Lists
          </h1>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {favoriteList === null ? null : favoriteList.length > 0 ? (
          favoriteList.map((provider) => (
            <ProviderItem
              key={provider._id}
              provider={provider}
              isFavorite={true}
              setFavoriteList={setFavoriteList}
            />
          ))
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col items-center text-2xl font-semibold mb-6 text-zinc-600">
              No Favorite Providers Not yet saved
            </div>
            <div className="flex-col md:flex items-center text-2xl font-semibold mt-6 mb-6 ">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
