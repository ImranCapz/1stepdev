import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProviderItem from "./ProviderItem";
import SearchBar from "../SearchBar";
import { favoriteList } from "../../redux/favorite/favoriteSlice";
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
    <div className="flex flex-col min-h-screen">
      <div className="h-52vh md:h-72vh bg-listbg bg-cover bg-center flex flex-col justify-center items-center text-white">
        <div className="text-center">
          <h1 className="md:text-2xl text-xl font-semibold text-zinc-600">
            Lists
          </h1>
          <h1 className="md:text-5xl text-3xl font-bold md:mt-4 text-gray-700">
            My Saved Lists
          </h1>
        </div>
      </div>
      <div>
        {favorites.filter(Boolean).length > 0 ? (
          <div className="p-4 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.filter(Boolean).map((provider) => (
              <ProviderItem
                key={provider._id}
                provider={{
                  ...provider,
                  totalBookings: null,
                }}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mt-10">
            <div className="text-2xl font-semibold mb-6 text-zinc-600 text-center">
              No Favorite Providers Not yet saved
            </div>
            <div className="md:flex items-center text-2xl font-semibold mt-6 mb-6">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
