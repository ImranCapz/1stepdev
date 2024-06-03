import { Link, useLocation } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosStar } from "react-icons/io";
import { MdWorkspacePremium } from "react-icons/md";
import ListModel from "../modal/ListModel";
import { Modal } from "flowbite-react";
import { toggleFavorite } from "../../redux/favorite/FavoriteSlice";
import { fetchFavoriteStatus } from "../../redux/favorite/FavoriteSlice";
import { selectProvider } from "../../redux/provider/providerSlice";
import { IoHeartSharp } from "react-icons/io5";
import { PiHandHeartFill } from "react-icons/pi";
import { Tooltip } from "flowbite-react";

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

  const providerName = encodeURIComponent(provider.fullName).replace(
    /%20/g,
    "-"
  );
  const providerCity = encodeURIComponent(provider.address.city);
  const providerState = encodeURIComponent(provider.address.state).replace(
    /%20/g,
    "-"
  );
  const pincode = encodeURIComponent(provider.address.pincode);

  const pathName = `/provider/${providerName}`;
  const search = `?city=${providerCity}?state=${providerState}&service=${searchTerm}&pincode=${pincode}`;

  useEffect(() => {
    setSearchTerm(urlsearchTerm);
    window.scrollTo({ top:0 })
  },[urlsearchTerm]);

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
      toast.success(
        `Provider ${isFavorite ? "removed from" : "added to"} favorites`
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
    <>
      <div className="w-full relative border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[750px]">
        <button
          onClick={toggleFavoriteStatus}
          className="p-2 absolute top-2 right-2 z-10"
        >
          {isFavorite ? (
            <IoHeartSharp className="text-pink-600 size-6 hover:bg-pink-100 rounded-md transition duration-300" />
          ) : (
            <IoHeartSharp className="text-zinc-400 size-6 hover:bg-zinc-200 rounded-md transition duration-300" />
          )}
        </button>
        <Modal show={listOpen} size="md" onClose={OnCloseModal} popup>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <ListModel />
          </Modal.Body>
        </Modal>
        {/* <Link to={`/provider/${provider._id}`}> */}
        {/* <img
        src={provider.imageUrls[0]}
        alt="provider cover"
        className="h-[200px] md:h-[120px] w-full object-cover hover:scale-105 transition-scale duration-300"
      /> */}
        <div className="flex flex-col gap-2 p-3 w-full md:flex-row items-start md:items-center">
          <div className="flex flex-col items-start">
            <div className="w-full flex">
              <div className="relative h-16 w-16 md:w-28 md:h-28 rounded-full overflow-hidden md:border-8 border-gray-100">
                <img
                  src={provider.profilePicture}
                  alt="provider profile"
                  className="absolute w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-1">
                  <IoIosStar className="h-4 w-4 text-amber-400" />
                  <p className="text-sm text-gray-600 font-bold truncate w-full">
                    {review &&
                    (review.totalrating === "0.00" ||
                      review.totalrating === "0")
                      ? "No reviews"
                      : `${parseFloat(review?.totalrating).toFixed(2)} (${
                          review?.totalratings || 0
                        })`}
                  </p>
                </div>
                <Link
                  to={{
                    pathname: pathName,
                    search: search,
                    state: { searchTerm: searchTerm },
                  }}
                  onClick={() => dispatch(selectProvider(provider._id))}
                >
                  <div className="flex flex-row items-center gap-2 truncate text-xl font-bold text-slate-700 hover:underline">
                    {provider.fullName}
                    {provider.verified === true && (
                      <>
                        <Tooltip
                          content="Verifed Profile"
                          animation="duration-500"
                          placement="right"
                        >
                          <FcApproval />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </Link>
                <div className="text-xs md:text-sm text-gray-600 font-semibold truncate w-full">
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
                                  )}&address=${provider.address.city}`}
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
                </div>
                <div className="md:inline hidden">
                  <div className="flex items-center gap-1 mt-1">
                    <MdLocationOn className="h-4 w-4 text-gray-600" />
                    <p className="text-sm text-gray-600 truncate w-full">
                      {provider.address.addressLine1} {provider.address.city},{" "}
                      {provider.address.state}
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
                      {Array.isArray(provider.therapytype)
                        ? `${provider.therapytype.slice(0, 4).join(", ")}`
                        : `${provider.therapytype}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:hidden">
              <div className="flex items-center gap-1 mt-2">
                <MdLocationOn className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-600 truncate w-full">
                  {provider.address.addressLine1},{provider.address.city}
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
                  {Array.isArray(provider.therapytype)
                    ? `${provider.therapytype.slice(0, 4).join(", ")}`
                    : `${provider.therapytype}`}
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 flex flex-col w-full md:ml-auto md:pr-10 md:items-end">
            <Link
              to={{
                pathname: pathName,
                search: search,
                state: { searchTerm: searchTerm },
              }}
            >
              <button
                onClick={() => dispatch(selectProvider(provider._id))}
                className="w-full md:w-auto p-2 bg-sky-100 rounded-md font-semibold text-sky-600 hover:bg-sky-200 transition duration-300"
              >
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

ProviderItem.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.arrayOf(PropTypes.string),
    therapytype: PropTypes.arrayOf(PropTypes.string).isRequired,
    fullName: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    address: PropTypes.shape({
      addressLine1: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      pincode: PropTypes.number.isRequired,
    }).isRequired,
    totalrating: PropTypes.number,
    numberofratings: PropTypes.number,
    description: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    verified: PropTypes.bool,
  }).isRequired,
};
