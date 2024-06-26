import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProviderItem from "./ProviderItem";
import SearchBar from "../SearchBar";
import { favoriteList } from "../../redux/favorite/FavoriteSlice";
import { useDispatch } from "react-redux";

export default function FavoriteList() {
  const { currentUser } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.favorite);
  const dispatch = useDispatch();
  console.log("favorite", favorites);

  useEffect(() => {
    const fetchFavoriteList = async () => {
      if (!currentUser) {
        return;
      }
      dispatch(favoriteList(currentUser._id));
    };
    fetchFavoriteList();
  }, [currentUser, dispatch]);

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
        {favorites === undefined || favorites === null ? (
          <div>Loading...</div>
        ) : favorites.filter(Boolean).length > 0 ? (
          favorites
            .filter(Boolean)
            .map((provider) => (
              <ProviderItem
                key={provider._id}
                provider={provider}
                isFavorite={true}
              />
            ))
        ) : (
          <div className="flex flex-col mt-4">
            <div className="flex flex-col items-center text-2xl font-semibold mb-6 text-zinc-600">
              No Favorite Providers Not yet saved
            </div>
            <div className="flex-col md:flex items-center text-2xl font-semibold mt-6 mb-6">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
