import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import BookingContact from "../components/BookingContact";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { Button } from "@material-tailwind/react";
import { MdWorkspacePremium } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import ProviderBooking from "../components/booking/ProviderBooking";

function convert12Hrs(time) {
  const [hours, minutes] = time.split(":");
  const hrsin12hrs = (hours % 12 || 12).toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  return `${hrsin12hrs}:${minutes}${period}`;
}

export default function Provider() {
  SwiperCore.use([Navigation]);
  const [provider, setprovider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [review, setReview] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchprovider = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/server/provider/get/${params.providerId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setprovider(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
      }
    };0
    fetchprovider();
  }, [params.providerId]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(
          `/server/rating/getreview/${params.providerId}`
        );
        const data = await res.json();
        setReview(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRating();
  }, [params.providerId]);

  return (
    <div className="lg:flex-row flex-col-reverse mx-auto flex w-full">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Error fetching provider</p>
      )}
      {provider && !loading && !error && (
        <div>
          <Swiper navigation>
            {provider.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[200px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[24%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="lg:flex-row flex-col flex p-3">
            <div className="flex flex-col w-full p-10 mx-auto gap-4">
              <div className="flex lg:flex-row sm:items-center flex-col items-center gap-2">
                <p className="flex flex-col items-start justify-start">
                  <img
                    src={provider.profilePicture}
                    alt="profile"
                    className="h-40 w-40 rounded-full object-cover border-8 border-gray-100"
                  />
                </p>
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-2xl md:text-start text-center text-gray font-bold mt-2">
                    {provider.fullName}
                    {/* - ₹{" "}
                {provider.regularPrice.toLocaleString("en-US")} / Appointment */}
                  </p>
                  <p className="text-base text-center text-slate-600 font-semibold mt-2">
                    {Array.isArray(provider.name)
                      ? `${provider.name.slice(0, 2).join(", ")} ${
                          provider.name.length > 2
                            ? `+${provider.name.length - 2}more`
                            : ""
                        }`
                      : `${provider.name}`}
                  </p>

                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1 mt-2">
                      <IoIosStar className="h-4 w-4 text-slate-600" />
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-600 font-bold">
                          Rating:{" "}
                        </span>
                        {review &&
                        (review.totalrating === "0.00" ||
                          review.totalrating === "0")
                          ? "No reviews"
                          : `${parseFloat(review?.totalrating).toFixed(2)} (${
                              review?.totalratings || 0
                            } ${
                              review?.totalratings === 1 ? "review" : "reviews"
                            })`}
                      </p>
                    </div>
                    <p className="flex items-center gap-1 text-slate-600 text-sm truncate">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <span className="text-gray-600 font-bold">Addess:</span>
                      {provider.address}
                    </p>
                    <div className="flex items-center gap-1">
                      <MdWorkspacePremium className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-600 truncate w-full">
                        <span className="text-gray-600 font-bold">
                          Experience:{" "}
                        </span>
                        {provider.experience} years experience overall
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {provider.description}
              </p>
              <div className="flex flex-col items-start">
                <div>
                  <span className="w-full flex justify-center font-bold text-slate-700 text-2xl">
                    Reviews
                  </span>
                  <div className="w-full flex justify-center">
                    <span className="font-bold text-slate-800 text-5xl">
                      {parseFloat(review.totalrating).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full flex justify-center">
                    <StarRatings
                      rating={Number(review.totalrating) || 0}
                      starRatedColor="#56c3fc"
                      numberOfStars={5}
                      name="rating"
                      starDimension="18px"
                      starSpacing="2px"
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <span className="text-slate-800 font-semibold">
                      {review.totalratings} Reviews
                    </span>
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-4">
                  <Button variant="outlined">View Review</Button>
                  <Button className="blue-button">
                    <Link
                      to={{
                        pathname: `/review/${provider._id}`,
                        state: { provider: provider },
                      }}
                    >
                      Leave Review
                    </Link>
                  </Button>
                </div>
                <div className="p-2">
                  <p className="text-slate-700 text-base font-semibold">
                    MON - SAT
                  </p>
                  <p>
                    {convert12Hrs(provider.availability.morningStart)}{" - "}
                    {convert12Hrs(provider.availability.morningEnd)} 
                  </p>
                  <p>
                    {convert12Hrs(provider.availability.eveningStart)}{" - "}
                    {convert12Hrs(provider.availability.eveningEnd)}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex w-full p-3 lg:w-1/2 lg:sticky lg:top-0"
              style={{ alignSelf: "flex-start" }}
            >
              <div className="border-2 bg-sky-100 rounded-lg lg:sticky lg:top-0">
                <div className="p-6">
                  <p className="font-bold text-xl text-gray ">
                    Get in touch with {provider.fullName}
                  </p>

                  {!currentUser && (
                    <div className="flex flex-col mt-2 gap-4">
                      <Button
                        onClick={() => navigate("/signup")}
                        className="bg-amber w-full text-gray-900 rounded-lg uppercase hover:opacity-95"
                      >
                        Book A Appointment
                      </Button>
                      <Button
                        variant="outlined"
                        className="flex items-center justify-center gap-3 bg-slate-100 text-gray-600 w-full rounded-lg uppercase hover:opacity-95"
                      >
                        <FaRegHeart /> Save to List
                      </Button>
                    </div>
                  )}
                  {currentUser &&
                    provider.userRef !== currentUser._id &&
                    !contact && (
                      <div className="flex flex-col mt-2 gap-4">
                        <Button
                          onClick={() => setContact(true)}
                          className="bg-amber w-full text-gray-900 rounded-lg uppercase hover:opacity-95"
                        >
                          Contact FOR BOOKING
                        </Button>
                        <Button
                          variant="outlined"
                          className="flex items-center justify-center gap-3 bg-slate-100 text-gray-600 w-full rounded-lg uppercase hover:opacity-95"
                        >
                          <FaRegHeart /> Save to List
                        </Button>
                      </div>
                    )}
                  {contact && <BookingContact provider={provider} />}
                  {provider && <ProviderBooking provider={provider} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
