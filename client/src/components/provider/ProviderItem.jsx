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
import ContentLoader from "react-content-loader";

//icon
import { MdCurrencyRupee } from "react-icons/md";

export default function ProviderItem({ provider }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [review, setReview] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("urlsearchTerm");
  const [loading, setLoading] = useState(true);
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
    window.scrollTo({ top: 0 });
  }, [urlsearchTerm]);

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
      setLoading(false);
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
      setLoading(false);
    };
    fetchRating();
  }, [provider._id]);

  return (
    <>
      {loading ? (
        <>
          <div className="text-center text-xl text-slate-700 w-full">
            <div key={provider._id} className="md:hidden block mb-2">
              <ContentLoader
                viewBox="0 0 320 220"
                speed={2}
                height={240}
                width={370}
                backgroundColor="#f5f5f5"
                foregroundColor="#D1BEE0"
              >
                <circle cx="40" cy="60" r="36" />
                <rect x="90" y="34" rx="4" ry="4" width="100" height="9" />
                <rect x="90" y="56" rx="4" ry="4" width="140" height="13" />
                <rect x="90" y="80" rx="4" ry="4" width="290" height="9" />
                <rect x="20" y="110" rx="4" ry="4" width="150" height="9" />
                <rect x="20" y="130" rx="4" ry="4" width="190" height="9" />
                <rect x="20" y="150" rx="4" ry="4" width="100" height="9" />
                (button)
                <rect x="20" y="180" rx="4" ry="4" width="290" height="34" />
              </ContentLoader>
            </div>
          </div>
        </>
      ) : (
        <div className="group mt-4 w-full relative border pr-card shadow-md hover:shadow-lg overflow-hidden rounded-lg transition-all hover:-translate-y-2 duration-500 ease-in-out">
          {provider.totalBookings === null ? (
            <div className="md:flex flex-col items-center bg-white text-sm p-1.5 hidden">
              <p className="text-white">No Recent Bookings</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center bg-green-300 text-sm p-1.5">
                {provider.totalBookings !== null && (
                  <>
                    {provider.totalBookings.length === 1 ? (
                      <p>Got Booking in Recently</p>
                    ) : (
                      <p>{provider.totalBookings} Bookings in Recent Times</p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          <button
            onClick={toggleFavoriteStatus}
            className="p-2 absolute top-0 right-0 md:top-9 md:right-2 z-10"
          >
            {isFavorite ? (
              <IoHeartSharp className="text-pink-600 size-6 lg:size-7 hover:bg-pink-100 rounded-md transition duration-300" />
            ) : (
              <IoHeartSharp className="text-zinc-400 size-6 lg:size-7 hover:bg-zinc-200 rounded-md transition duration-300" />
            )}
          </button>
          <div className="hidden md:flex flex-col p-2 absolute top-9 left-2 z-10 justify-center items-center ">
            <IoIosStar className="h-4 w-4 lg:size-5 star" />
            <p className="text-sm lg:text-base text-gray-600 font-bold truncate w-full">
              {review &&
              review.totalrating !== undefined &&
              (review.totalrating === "0.00" ||
                review.totalrating === "0" ||
                isNaN(parseFloat(review.totalrating)))
                ? "No reviews"
                : `${parseFloat(review?.totalrating).toFixed(2)} (${
                    review?.totalratings || 0
                  })`}
            </p>
          </div>
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
          <div className="flex flex-col gap-2 p-3 w-full items-start md:items-center">
            <div className="flex flex-col items-start">
              <div className="hidden w-full md:flex flex-col items-center">
                <div className="relative w-40 h-40 items-center rounded-full overflow-hidden md:border-4 border-gray-100 lg:mt-4 group-hover:-translate-y-2 duration-700 ease-in-out">
                  <img
                    src={provider.profilePicture}
                    alt="provider profile"
                    className="absolute w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <Link
                  to={{
                    pathname: pathName,
                    search: search,
                    state: { searchTerm: searchTerm },
                  }}
                  onClick={() => dispatch(selectProvider(provider._id))}
                >
                  <div className="flex flex-row items-center gap-2 truncate text-2xl font-semibold provideritem-name hover:underline mt-2">
                    {provider.fullName}
                    {provider.verified === true && (
                      <>
                        <Tooltip
                          content="Verifed Profile"
                          animation="duration-500"
                          placement="bottom"
                        >
                          <FcApproval />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </Link>
                <div className="flex flex-row items-center text-xs md:text-base 2xl:text-lg provideritem-service font-semibold truncate">
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
                                  {filteredNames[1].slice(0, 14)}
                                  {filteredNames[1].slice(14) ? "..." : ""}
                                </Link>
                              </>
                            ) : null}
                            {filteredNames.length > 2
                              ? ` +${filteredNames.length - 2}more`
                              : ""}
                          </>
                        );
                      })()
                    : provider.name}
                </div>
                <div className="md:flex flex-col items-center hidden">
                  <div className="items-start">
                    <div className="flex items-center gap-1 mt-1">
                      <MdLocationOn className="h-4 w-4 lg:size-5 icon-color" />
                      <p className="text-sm lg:text-base provideritem-service truncate w-full">
                        {provider.address.addressLine1} {provider.address.city},{" "}
                        {provider.address.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdWorkspacePremium className="h-4 w-4 lg:size-5 icon-color" />
                      <p className="text-sm lg:text-base provideritem-service truncate w-full">
                        {provider.experience} years experience overall
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiHandHeartFill className="h-4 w-4 lg:size-5 icon-color" />
                      <p className="text-sm lg:text-base provideritem-service truncate w-full">
                        {Array.isArray(provider.therapytype)
                          ? `${provider.therapytype.slice(0, 4).join(", ")}`
                          : `${provider.therapytype}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex md:hidden">
                <div className="relative h-16 w-16 md:w-28 md:h-28 rounded-full overflow-hidden border-gray-100">
                  <img
                    src={provider.profilePicture}
                    alt="provider profile"
                    className="absolute w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-1">
                    <IoIosStar className="h-4 w-4 star" />
                    <p className="text-sm text-gray-600 font-bold truncate w-full">
                      {review &&
                      review.totalrating !== undefined &&
                      (review.totalrating === "0.00" ||
                        review.totalrating === "0" ||
                        isNaN(parseFloat(review.totalrating)))
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
                    <div className="flex flex-row items-center gap-2 truncate text-xl font-semibold provideritem-name hover:underline">
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
                  <div className="text-xs md:text-sm provideritem-service font-semibold truncate w-full">
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
                      <MdLocationOn className="h-4 w-4 icon-color" />
                      <p className="text-sm provideritem-service truncate w-full">
                        {provider.address.addressLine1} {provider.address.city},{" "}
                        {provider.address.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdWorkspacePremium className="h-4 w-4 icon-color" />
                      <p className="text-sm provideritem-service truncate w-full">
                        {provider.experience} years experience overall
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiHandHeartFill className="h-4 w-4 icon-color" />
                      <p className="text-sm provideritem-service truncate w-full">
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
                  <MdLocationOn className="h-4 w-4 icon-color" />
                  <p className="text-sm provideritem-service truncate w-full">
                    {provider.address.addressLine1},{provider.address.city}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <MdWorkspacePremium className="h-4 w-4 icon-color" />
                  <p className="text-sm provideritem-service truncate w-full">
                    {provider.experience} years experience overall
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <PiHandHeartFill className="h-4 w-4 icon-color" />
                  <p className="text-sm provideritem-service truncate w-full">
                    {Array.isArray(provider.therapytype)
                      ? `${provider.therapytype.slice(0, 4).join(", ")}`
                      : `${provider.therapytype}`}
                  </p>
                </div>
              </div>
            </div>
            <hr className="w-full border-gray-200" />
            <div className="flex flex-row items-center justify-between w-full">
              <div className="md:flex hidden provideritem-name items-center pl-2 md:text-xl 2xl:text-2xl">
                <MdCurrencyRupee className="pt-0.5" />
                {Math.floor(provider.regularPrice)}
              </div>
              <div className="p-1.5 flex flex-col w-full md:items-end">
                <Link
                  to={{
                    pathname: pathName,
                    search: search,
                    state: { searchTerm: searchTerm },
                  }}
                >
                  <button
                    onClick={() => dispatch(selectProvider(provider._id))}
                    className=" card-btn w-full md:w-auto p-2 lg:p-2 rounded-md font-semibold transition duration-300"
                  >
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
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
    totalBookings: PropTypes.number,
    numberofratings: PropTypes.number,
    description: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    regularPrice: PropTypes.number.isRequired,
    verified: PropTypes.bool,
  }).isRequired,
};
