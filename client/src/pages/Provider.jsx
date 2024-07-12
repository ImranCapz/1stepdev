import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaHome, FaMapMarkerAlt, FaClinicMedical } from "react-icons/fa";
import { useSelector } from "react-redux";
import BookingContact from "../components/BookingContact";
import StarRatings from "react-star-ratings";
import { Button } from "@material-tailwind/react";
import { IoIosStar } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { Modal, Textarea } from "flowbite-react";
import SignupModal from "../components/SignupModal";
import ListModal from "../components/modal/ListModel";
import { useDispatch } from "react-redux";
import { toggleFavorite } from "../redux/favorite/FavoriteSlice";
import { fetchFavoriteStatus } from "../redux/favorite/FavoriteSlice";
import { FcLike } from "react-icons/fc";
import { IoIosShareAlt, IoMdAlert } from "react-icons/io";
import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiHandHeartFill } from "react-icons/pi";
import {
  MdOutlineVideoCameraFront,
  MdWorkspacePremium,
  MdOutlineFileCopy,
} from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FcApproval, FcInfo } from "react-icons/fc";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { Tooltip } from "flowbite-react";
import ContentLoader from "react-content-loader";
import { AiFillThunderbolt } from "react-icons/ai";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function convert12Hrs(time) {
  const [hours, minutes] = time.split(":");
  const hrsin12hrs = (hours % 12 || 12).toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  return `${hrsin12hrs}:${minutes}${period}`;
}

export default function Provider() {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useSelector((state) => state.provider);
  const [provider, setprovider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [message, setMessage] = useState(false);
  const [review, setReview] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [description, setDescription] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const dispatch = useDispatch();
  const urlRef = useRef(null);
  const [otp, setOtp] = useState(0);
  const navigate = useNavigate();

  //socket
  const SOCKET_SERVER_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentUser === null) return;
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (currentUser === null) return;
    if (socket) {
      socket.emit("joinRoom", {
        roomId: `${currentUser._id}_${id}`,
        sender: currentUser._id,
        reciever: provider.userRef,
        provider: id,
      });
      socket.emit("sendMessage", {
        roomId: `${currentUser._id}_${id}`,
        message: sendMessage,
        sender: currentUser._id,
        reciever: provider.userRef,
        provider: id,
      });
      navigate("/dashboard?tab=messages");
    }
  };

  //url searchTerm
  const [searchTerm, setSearchTerm] = useState("urlsearchTerm");
  const searchQuery = new URLSearchParams(location.search);
  const urlsearchTerm = searchQuery.get("service");

  useEffect(() => {
    setSearchTerm(urlsearchTerm);
  }, [urlsearchTerm]);

  //title
  const providerUrlName = location.pathname;
  const extractname = providerUrlName.split("/");
  const provName = extractname[2].replace(/-/g, " ");

  //send message
  const [sendMessage, setSendMessage] = useState();
  useEffect(() => {
    if (currentUser === null) return;
    setSendMessage(
      `Hi ${provName},\nMy name is ${currentUser.username}, and I am seeking a therapist for ${searchTerm}. I would like to start as soon as possible. Are you available? Could you contact me so we can discuss this further?\nHave a great day! Talk to you soon.\nBest regards,\n${currentUser.username}`
    );
  }, [searchTerm, provName]);

  useEffect(() => {
    document.title = `${provName} | ${urlsearchTerm}`;
  }, [provName, urlsearchTerm]);

  // Review URL
  const ProviderName = encodeURIComponent(provider?.fullName).replace(
    /%20/g,
    "-"
  );
  const ProviderAddress = encodeURIComponent(provider?.address?.state).replace(
    /%20/g,
    "-"
  );
  const url = `/review/${ProviderName}-${ProviderAddress}`;

  function onCloseModal() {
    setIsListOpen(false);
    setOpenModal(false);
    setIsShare(false);
    setOtpOpen(false);
  }

  //fetch provider
  useEffect(() => {
    const fetchprovider = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/server/provider/get/${id}`);
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
    };
    fetchprovider();
  }, [id]);

  //fetch provider rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/server/rating/getreview/${id}`);
        const data = await res.json();
        setReview(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRating();
  }, [id]);

  const handleFavorite = async () => {
    if (!currentUser) {
      setIsListOpen(true);
      return;
    }
    try {
      dispatch(
        toggleFavorite({
          userId: currentUser._id,
          providerId: id,
        })
      );
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id && currentUser) {
      const fetchFavoriteHeart = async () => {
        try {
          const favoriteStatus = await dispatch(
            fetchFavoriteStatus({
              userId: currentUser._id,
              providerId: id,
            })
          );
          if (favoriteStatus.payload !== undefined) {
            setIsFavorite(favoriteStatus.payload);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchFavoriteHeart();
    }
  }, [id, currentUser, dispatch]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareClicked(true);
      console.log("Copied to clipboard");
    } catch (error) {
      console.error(error);
    }
  };

  const subMenu = [
    { value: "About", label: "About", offset: 176 },
    { value: "Reviews", label: "Reviews", offset: 140 },
    { value: "Service", label: "Service", offset: 120 },
  ];

  const handleClick = (id, offset) => {
    const element = document.getElementById(id);
    if (element) {
      let adjustedOffset = offset;
      if (window.innerWidth <= 768) {
        adjustedOffset = offset / 0.7;
      }
      window.scrollTo({
        top: element.offsetTop - adjustedOffset,
        behavior: "smooth",
      });
    }
  };

  const handleVerifyProfile = async () => {
    try {
      setOtpOpen(true);
      const res = await fetch("/server/provider/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: provider.email,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/server/provider/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: provider.email,
          otp: otp,
        }),
      });
      const data = await res.json();
      console.log("verified Data", data);
      if (data.success === false) {
        console.log("Error:", data.message);
        toast.error(data.message);
        return;
      }
      if (data.success === true) {
        setprovider((prev) => ({ ...prev, verified: true }));
        toast.success("Profile Verified");
        setOtpOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while verifying the OTP.");
    }
  };

  return (
    <div className="w-full mx-auto flex lg:flex-row flex-col-reverse">
      {loading && (
        <>
          <div className="h-[200px] bg-gray-200 animate-pulse">loading</div>
        </>
      )}
      {error && (
        <p className="text-center my-7 text-2xl">Error fetching provider</p>
      )}
      {provider && !loading && !error && (
        <div>
          {/* <Swiper navigation>
            {provider.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[200px] hidden lg:block w-full"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper> */}
          <div className="lg:flex-row flex-col mx-auto flex md:w-5/6 justify-center">
            <div className="flex flex-col w-full p-2 md:p-10 mx-auto gap-4 overflow-auto">
              <div className="flex lg:flex-row sm:items-center flex-col items-center gap-2">
                <p className="flex flex-col items-start justify-start">
                  <img
                    src={provider.profilePicture}
                    alt="profile"
                    className=" md:h-52 md:w-52 h-36 w-36 rounded-full object-cover border-8 border-gray-100"
                  />
                </p>
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex flex-row text-gray-600 font-semibold text-sm space-x-1">
                    <Link className="capitalize" to={`/${urlsearchTerm}`}>
                      {urlsearchTerm}
                    </Link>
                    {/* <p className="text-gray-400">&gt;</p>
                    <Link className="capitalize">{provider.address.state}&nbsp;</Link> */}
                    <p className="text-gray-400">&gt;</p>
                    <Link
                      className="capitalize"
                      to={`/search?searchTerm=${searchTerm}&address=${provider.address.city}`}
                    >
                      {provider.address.city}
                    </Link>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                    <div className="flex flex-row items-center space-x-2 gap-2 text-2xl md:text-start text-center text-gray font-bold mt-2">
                      {provider.fullName}
                      {provider.verified === true && (
                        <div className="">
                          <Tooltip
                            content="Verifed Profile"
                            animation="duration-500"
                          >
                            <FcApproval />
                          </Tooltip>
                        </div>
                      )}
                      {provider.verified === false && (
                        <div className="">
                          <Tooltip
                            content="Profile is not claimed"
                            animation="duration-500"
                          >
                            <FcInfo />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <p className="flex flex-row space-x-2 text-xs text-center mt-2">
                      <Button
                        onClick={handleFavorite}
                        variant="outlined"
                        className="flex flex-row border-gray-400 text-gray-600 py-1 px-2 gap-1 items-center rounded-full"
                      >
                        {isFavorite ? <FcLike /> : <FaRegHeart />} Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsShare(true)}
                        className="flex flex-row border-gray-400 text-gray-600 py-1 px-2 gap-1 items-center rounded-full"
                      >
                        <IoIosShareAlt />
                        Share
                      </Button>
                    </p>
                    <Modal show={otpOpen} onClose={onCloseModal} popup>
                      <Modal.Header></Modal.Header>
                      <Modal.Body>
                        <div className="flex flex-col text-xl font-semibold text-gray gap-4">
                          OTP Sended to your {provider.email}
                          <div className="flex flex-col gap-4 p-10">
                            <label>Enter OTP</label>
                            <div className="flex flex-row items-center justify-center">
                              <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => (
                                  <input
                                    {...props}
                                    style={{
                                      width: "2.5rem",
                                      height: "3rem",
                                      margin: "0 0.5rem",
                                      fontSize: "1.5rem",
                                      borderRadius: "4px",
                                      border: "1px solid rgba(0,0,0,0.3)",
                                      color: "black",
                                      backgroundColor: "white",
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <Button onClick={handleVerifyOtp}>
                              Verify OTP
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                    <Modal show={isShare} onClose={onCloseModal} popup>
                      <Modal.Header className="p-6 text-2xl">
                        Share Provider Profile
                      </Modal.Header>
                      <Modal.Body>
                        <div className="flex flex-row justify-between">
                          <input
                            ref={urlRef}
                            value={window.location.href}
                            className="w-full p-3 border-2 border-slate-800 focus:border-slate-300 rounded"
                          />
                          <button
                            onClick={copyToClipboard}
                            className="absolute right-6 top-1/2 p-2 rounded"
                          >
                            {shareClicked ? (
                              <div className="flex flex-row items-center gap-1 p-2 text-white bg-green-400 rounded-md">
                                <FaCheck />
                                Copied
                              </div>
                            ) : (
                              <div className="flex flex-row items-center gap-1 p-2 rounded-md bg-gray-300">
                                <MdOutlineFileCopy />
                                Copy
                              </div>
                            )}
                          </button>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                  {/* - ₹{" "}
                {provider.regularPrice.toLocaleString("en-US")} / Appointment */}

                  <p className="text-base text-center text-slate-600 font-bold mt-2">
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
                  </p>
                  <div className="flex flex-col items-start justify-start">
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
                      <FaMapMarkerAlt className="text-gray-600 " />
                      <span className="text-gray-600 font-bold">Addess:</span>
                      {provider.address.addressLine1} {provider.address.city},{" "}
                      {provider.address.state}
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
                    <div className="flex items-center gap-1">
                      <PiHandHeartFill className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-600 truncate w-full">
                        <span className="text-gray-600 font-bold">
                          Care Settings:{" "}
                        </span>
                        {Array.isArray(provider.therapytype)
                          ? `${provider.therapytype.join(", ")}`
                          : provider.therapytype}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 mt-2 border-t border-b p-2 border-gray-300">
                {subMenu.map((item, key) => {
                  return (
                    <button
                      key={key}
                      onClick={() => handleClick(item.value, item.offset)}
                      className="flex gap-4 text-slate-800 duration-200 font-semibold"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <span className="font-bold text-xl text-gray mt-2">
                About {provider.fullName}
              </span>
              <div id="About" className="flex flex-col items-start">
                <div className="overflow-hidden">
                  <p
                    className={`text-slate-800 overflow-ellipsis overflow-hidden ${
                      description ? "" : "line-clamp-3"
                    }`}
                  >
                    {provider.description}
                  </p>
                </div>
                {!description && (
                  <button
                    className="text-sky-500 hover:text-sky-800 underline duration-200"
                    onClick={() => setDescription(true)}
                  >
                    Read More
                  </button>
                )}
              </div>
              <div id="Reviews" className="flex flex-col items-start gap-2">
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
                  <Link to={url}>
                    <Button className="blue-button">Leave Review</Button>
                  </Link>
                </div>
                <div className="p-2">
                  <p className="text-slate-700 text-base font-semibold">
                    MON - SAT
                  </p>
                  <p>
                    {convert12Hrs(provider.availability.morningStart)}
                    {" - "}
                    {convert12Hrs(provider.availability.morningEnd)}
                  </p>
                  <p>
                    {convert12Hrs(provider.availability.eveningStart)}
                    {" - "}
                    {convert12Hrs(provider.availability.eveningEnd)}
                  </p>
                </div>
              </div>
              <div>
                {provider.verified === true && (
                  <div className="mt-2">
                    <h1 className="text-gray font-bold text-2xl">
                      Accreditions
                    </h1>
                    <IoShieldCheckmarkOutline className="size-10 text-gray-600 mt-2" />
                    <h2 className="text-gray font-bold text-base">
                      Claimed Profile
                    </h2>
                    <p className="w-40 text-gray-500">
                      This provider has submitted proof of credentials and has
                      claimed their profile.
                    </p>
                  </div>
                )}
              </div>
              <div
                id="Service"
                className="flex flex-col border-t border-gray-300"
              >
                <h1 className="text-gray text-2xl mt-4 font-bold">Services</h1>
                <div className="flex flex-wrap justify-between">
                  {provider.name.map((service, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row items-center gap-2 mt-2 w-1/2"
                      >
                        <IoMdCheckmarkCircleOutline className="h-5 w-5 text-amber-400" />
                        <p className="font-semibold text-sm md:text-lg text-gray-600">
                          {service}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <h1 className="text-gray text-2xl mt-4 font-bold">
                  Care Settings
                </h1>
                <div className="flex mt-2 flex-warp justify-between">
                  {provider.therapytype.map((type, index) => {
                    return (
                      <div
                        className="flex flex-row items-center gap-2 mt-2 w-1/2"
                        key={index}
                      >
                        {type === "Virtual" && (
                          <>
                            <span className="flex flex-row text-2xl text-gray-600 items-center justify-between">
                              <MdOutlineVideoCameraFront />
                            </span>
                            <p className="text-gray-700 text-sm md:text-lg font-semibold">
                              Virtual
                            </p>
                          </>
                        )}
                        {type === "In-Clinic" && (
                          <>
                            <span className="flex flex-row text-xl text-gray-600 items-center justify-between">
                              <FaClinicMedical />
                            </span>
                            <p className="text-gray-700 text-sm md:text-lg font-semibold">
                              In-Clinic
                            </p>
                          </>
                        )}
                        {type === "In-Home" && (
                          <>
                            <span className="flex flex-row text-2xl text-gray-600 items-center justify-between">
                              <FaHome className="h-5" />
                            </span>
                            <p className="text-gray-700 text-sm md:text-lg font-semibold">
                              In-Home
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="w-full flex flex-col space-y-3 p-3 mt-6 max-w-[460px]"
              style={{
                alignSelf: "flex-start",
                position: "sticky",
                top: "125px",
              }}
            >
              {!message && (
                <div className="w-full border-2 bg-sky-100 rounded-lg">
                  <div className="p-6">
                    <p className="font-bold text-xl text-gray ">
                      Get in touch with {provider.fullName}
                    </p>
                    {/* <div className="video-responsive">
                    <iframe
                      width="300"
                      height="150"
                      src="https://www.youtube.com/embed/sV1-4FTuQRY" // replace YOUR_VIDEO_ID with your YouTube video's ID
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div> */}
                    {!currentUser && (
                      <div className="flex flex-col mt-2 gap-4">
                        <Button
                          onClick={() => {
                            setOpenModal(true);
                          }}
                          className="bg-amber w-full text-gray-900 rounded-lg uppercase hover:opacity-95"
                        >
                          Book A Appointment
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setIsListOpen(true);
                          }}
                          className="flex items-center justify-center gap-3 bg-slate-100 text-gray-600 w-full rounded-lg uppercase hover:opacity-95"
                        >
                          <FaRegHeart /> Save to List
                        </Button>
                        <Modal
                          show={openModal}
                          size="md"
                          onClose={onCloseModal}
                          popup
                        >
                          <Modal.Header></Modal.Header>
                          <Modal.Body>
                            <SignupModal />
                          </Modal.Body>
                        </Modal>
                        <Modal
                          show={isListOpen}
                          size="md"
                          onClose={onCloseModal}
                          popup
                        >
                          <Modal.Header></Modal.Header>
                          <Modal.Body>
                            <ListModal />
                          </Modal.Body>
                        </Modal>
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
                            onClick={handleFavorite}
                            variant="outlined"
                            className="flex items-center justify-center gap-3 bg-slate-100 text-gray-600 w-full rounded-lg uppercase hover:opacity-95"
                          >
                            {isFavorite ? (
                              <>
                                <FcLike className="h-3 w-3" />
                                <p>Saved </p>
                              </>
                            ) : (
                              <>
                                <FaRegHeart className="h-3 w-3" />
                                <p>Save to List </p>
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    {contact && <BookingContact provider={provider} />}
                  </div>
                </div>
              )}
              <div className="w-full border-2 bg-sky-100 rounded-lg">
                <div className="p-6">
                  <p className="font-bold text-xl text-gray ">
                    Get a Quick Response
                  </p>
                  {!currentUser && (
                    <div className="flex flex-col mt-2 gap-4">
                      <Button
                        onClick={() => {
                          setOpenModal(true);
                        }}
                        className="bg-sky-400 w-full text-gray-900 rounded-lg uppercase hover:opacity-95"
                      >
                        Send a Message
                      </Button>
                    </div>
                  )}
                  {currentUser &&
                    provider.userRef !== currentUser._id &&
                    !message && (
                      <div className="flex flex-col mt-2 gap-4">
                        <Button
                          onClick={() => setMessage(true)}
                          className="w-full bg-sky-400 text-gray-900 rounded-lg uppercase hover:opacity-95"
                        >
                          Send a Message
                        </Button>
                      </div>
                    )}
                  {message && (
                    <div className="mt-2 text-sm font-semibold">
                      <Textarea
                        rows={8}
                        className="text-gray-700 border-gray-400"
                        onChange={(e) => setSendMessage(e.target.value)}
                        value={sendMessage}
                      />
                      <div className="flex flex-row gap-2 mt-4">
                        <Button
                          onClick={() => setMessage(false)}
                          variant="outlined"
                          className="w-full"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          className="w-full bg-sky-400 text-gray-800"
                        >
                          Send a Message
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <>
                {currentUser &&
                  provider.userRef === currentUser._id &&
                  provider.verified === false && (
                    <div className="flex justify-center border border-slate-200 p-4 rounded-lg bg-sky-100">
                      <button
                        className="flex flex-row space-x-2 items-center"
                        onClick={handleVerifyProfile}
                      >
                        <IoMdAlert className="text-amber-500" />
                        <span className="text-slate-700">
                          is this your profile
                        </span>
                        <p className="flex flex-row items-center underline text-gray font-semibold">
                          Claim Your Profile
                        </p>
                      </button>
                    </div>
                  )}
              </>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
