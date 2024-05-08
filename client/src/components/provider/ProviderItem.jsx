import { useState } from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import PropTypes from "prop-types";
import { GoHeartFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoIosStar } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { MdWorkspacePremium } from "react-icons/md";
import ListModel from "../modal/ListModel";
import { Modal } from "flowbite-react";
import { toggleFavorite } from "../../redux/favorite/FavoriteSlice";
import { fetchFavoriteStatus } from "../../redux/favorite/FavoriteSlice";
import { useDispatch } from "react-redux";
import { PiHandHeartFill } from "react-icons/pi";


export default function ProviderItem({ provider }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [review, setReview] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("urlsearchTerm");
  const [listOpen, setListOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlsearchTerm = queryParams.get("searchTerm");
  const dispatch = useDispatch();

  useEffect(() => {
    setSearchTerm(urlsearchTerm);
  }, []);

  function OnCloseModal() {
    console.log("close modal");
    setListOpen(false);
  }


  const toggleFavoriteStatus = async () => {
    if (!currentUser) {
      setListOpen(true);
      return;
    }
    try {
      dispatch(
        toggleFavorite({ userId: currentUser._id, providerId: provider._id })
      );
      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorite status");
    }
  };

  useEffect(() => {
    const fetchFavoriteHeart = async () => {
      if (!currentUser) {
        return;
      }
      try {
        const favoriteStatus = await dispatch(
          fetchFavoriteStatus({
            userId: currentUser._id,
            providerId: provider._id,
          })
        );
        if (favoriteStatus.payload !== undefined) {
          setIsFavorite(favoriteStatus.payload);
          console.log(favoriteStatus.payload);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavoriteHeart();
  }, [currentUser, dispatch, provider._id]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/server/rating/getreview/${provider._id}`);
        const data = await res.json();
        setReview(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRating();
  }, [provider._id]);

  return (
    <div className="relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[700px]">
      <button
        onClick={toggleFavoriteStatus}
        className="p-2 absolute top-2 right-2 z-10"
      >
        {isFavorite ? (
          <FcLike size={25} />
        ) : (
          <GoHeartFill size={25} className="text-white" />
        )}
      </button>
      <Modal show={listOpen} size="md" onClose={OnCloseModal} popup>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <ListModel />
        </Modal.Body>
      </Modal>
      {/* <Link to={`/provider/${provider._id}`}> */}
      <img
        src={provider.imageUrls[0]}
        alt="provider cover"
        className="h-[200px] md:h-[120px] w-full object-cover hover:scale-105 transition-scale duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full">
        <div className="flex items-center">
          <img
            src={provider.profilePicture}
            alt="provider profile"
            className="h-24 w-24 rounded-full object-cover"
          />

          <div className="ml-4">
            <div className="flex items-center gap-1">
              <IoIosStar className="h-4 w-4 text-amber-400" />
              <p className="text-sm text-gray-600 font-bold truncate w-full">
                {review &&
                (review.totalrating === "0.00" || review.totalrating === "0")
                  ? "No reviews"
                  : `${parseFloat(review?.totalrating).toFixed(2)} (${
                      review?.totalratings || 0
                    })`}
              </p>
            </div>
            <div className="">
              <Link to={`/provider/${provider._id}`}>
                <p className="truncate text-xl font-bold text-slate-700 hover:underline">
                  {provider.fullName}
                </p>
              </Link>
              <p className="text-sm text-gray-600 font-semibold truncate w-full">
                {Array.isArray(provider.name)
                  ? (() => {
                      const searchTermIndex = provider.name.findIndex(
                        (name) =>
                          searchTerm &&
                          name.toLowerCase() === searchTerm.toLowerCase()
                      );
                      let filteredNames = [...provider.name];
                      if (searchTermIndex !== -1) {
                        filteredNames = [
                          provider.name[searchTermIndex],
                          ...provider.name.slice(0, searchTermIndex),
                          ...provider.name.slice(searchTermIndex + 1),
                        ];
                      }
                      return (
                        <>
                          {filteredNames.slice(0, 1)}
                          {filteredNames.length > 1 ? (
                            <>
                              ,{" "}
                              <Link
                                className="hover:underline"
                                to={`/search?searchTerm=${encodeURIComponent(
                                  filteredNames[1]
                                )}`}
                              >
                                {filteredNames[1]}
                              </Link>
                            </>
                          ) : null}
                          {filteredNames.length > 2
                            ? ` +${filteredNames.length - 2} more`
                            : ""}
                        </>
                      );
                    })()
                  : provider.name}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <MdLocationOn className="h-4 w-4 text-gray-600" />
              <p className="text-sm text-gray-600 truncate w-full">
                {provider.address}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <MdWorkspacePremium className="h-4 w-4 text-gray-600" />
              <p className="text-sm text-gray-600 truncate w-full">
                {provider.experience} years experience overall
              </p>
            </div>
            <div className="flex items-center gap-1">
              <PiHandHeartFill className="h-4 w-4 text-gray-600" />
              <p className="text-sm text-gray-600 truncate w-full">
                {Array.isArray(provider.therapytype) ? `${provider.therapytype.slice(0,4).join(", ")}` : `${provider.therapytype}`}
              </p>
            </div>
            {/* <p className="text-sm text-gray-600 line-clamp-3">
                {provider.description}
              </p> */}
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}

ProviderItem.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.arrayOf(PropTypes.string),
    therapytype: PropTypes.arrayOf(PropTypes.string).isRequired,
    fullName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    totalrating: PropTypes.number,
    numberofratings: PropTypes.number,
    description: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }).isRequired,
};
