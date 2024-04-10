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
import { useParams } from "react-router-dom";

export default function ProviderItem({ provider }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [review, setReview] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  const toggleFavorite = async () => {
    if (!currentUser) {
      toast.error("Please login to favorite a provider");
      return;
    }
    try {
      const response = await fetch(
        `/server/provider/favorite/${currentUser._id}?providerId=${provider._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId: provider._id,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update favorite status");
      }
      setIsFavorite(data.isFavorite);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `/server/provider/favoritestatus/${currentUser._id}?providerId=${provider._id}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch favorite status");
        }
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavoriteStatus();
  });

  useEffect(()=>{
    const fetchRating = async ()=>{
      try {
        const res = await fetch(`/server/rating/getreview/${provider._id}`);
        const data = await res.json();
        setReview(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchRating();
  },[provider._id])

  return (
    <div className="relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[700px]">
      <button
        onClick={toggleFavorite}
        className="p-2 absolute top-2 right-2 z-10"
      >
        {isFavorite ? (
          <FcLike size={25} />
        ) : (
          <span style={{ color: "white" }}>
            <GoHeartFill size={25} />
          </span>
        )}
      </button>
      <Link to={`/provider/${provider._id}`}>
        <img
          src={provider.imageUrls[0]}
          alt="provider cover"
          className="h-[200px] md:h-[120px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {provider.name}
          </p>
          <div className="flex items-center">
            <img
              src={provider.profilePicture}
              alt="provider profile"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="ml-4">
              <div className="flex items-center gap-1">
                <IoIosStar className="h-4 w-4 text-amber-400" />
                <p className="text-sm text-gray-600 font-bold truncate w-full">
                {review && (review.totalrating === "0.00" || review.totalrating ==="0") ? "No reviews" : `${parseFloat(review?.totalrating).toFixed(2)} (${review?.totalratings || 0})`} 
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MdLocationOn className="h-4 w-4 text-sky-300" />
                <p className="text-sm text-gray-600 truncate w-full">
                  {provider.address}
                </p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {provider.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ProviderItem.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    totalrating: PropTypes.number,
    numberofratings: PropTypes.number,
    description: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }).isRequired,
};
