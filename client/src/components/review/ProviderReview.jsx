import { useEffect, useState } from "react";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { HiOutlineHandThumbDown } from "react-icons/hi2";
import { LuSmile } from "react-icons/lu";
import { TbMoodSad2 } from "react-icons/tb";
import { BsEmojiExpressionless } from "react-icons/bs";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TiStarFullOutline } from "react-icons/ti";
import { MdLocationOn } from "react-icons/md";

export default function ProviderReview() {
  const [provider, setProvider] = useState("");
  const [selectedButton, setSelectedButton] = useState(null);
  const [review, setReview] = useState(0);
  const [reviewBtn, setReviewBtn] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { id } = useSelector((state) => state.provider);
  const providerId = id;

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/server/provider/get/${providerId}`);
        const data = await response.json();
        setProvider(data);
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };
    fetchProvider();
  }, [providerId]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/server/rating/getreview/${providerId}`);
        const data = await res.json();
        setReview(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchRating();
  }, [providerId]);

  const handleSubmit = async () => {
    if (!selectedButton) {
      toast.error("Please Select a Review");
      return;
    }
    if (!currentUser) {
      toast.error("Please Login to Post Review");
      return;
    }
    const ratingMaping = {
      "Strong No": 1,
      No: 2,
      Maybe: 3,
      Yes: 4,
      "Strong Yes": 5,
    };
    try {
      setReviewBtn(true);
      const res = await fetch("/server/rating/review", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: currentUser._id,
          star: ratingMaping[selectedButton],
          providerId: providerId,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success("Review Posted Successfully");
      }
      setReviewBtn(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const buttons = [
    {
      value: "Strong No",
      icon: <HiOutlineHandThumbDown />,
      text: "1 star",
      color: "bg-red-100",
      textColor: "text-red-600",
    },
    {
      value: "No",
      icon: <TbMoodSad2 />,
      text: "2 star",
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      value: "Maybe",
      icon: <BsEmojiExpressionless />,
      text: "3 star",
      color: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      value: "Yes",
      icon: <LuSmile />,
      text: "4 star",
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      value: "Strong Yes",
      icon: <HiOutlineHandThumbUp />,
      text: "5 star",
      color: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="">
      {loading ? (
        <></>
      ) : (
        <>
          <div className="h-52vh md:h-72vh bg-listbg bg-cover bg-center flex flex-col justify-center items-center text-white">
            <div className="">
              <h1 className="flex flex-col items-center text-xl font-semibold text-zinc-600">
                YOUR REVIEW FOR
              </h1>
              <h1 className="flex flex-col items-center text-5xl font-bold mt-6  text-gray-700">
                {provider.fullName}
              </h1>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row justify-center items-center">
            <div className="md:w-2/3 mx-auto flex flex-col-reverse md:flex-row justify-center items-start">
              <div className="w-full md:w-2/3 p-4">
                <div className="flex flex-col justify-center outline outline-offset-4 outline-1 outline-gray-300 bg-white rounded-lg">
                  <div className="p-3 font-semibold text-slate-700">
                    Would you recommend this provider?*
                  </div>
                  <div className="flex flex-row gap-5 p-2">
                    {buttons.map((button) => (
                      <button
                        key={button.value}
                        onClick={() => setSelectedButton(button.value)}
                        onMouseEnter={(e) => {
                          e.currentTarget.classList.remove(
                            "bg-white",
                            "text-gray-700"
                          );
                          e.currentTarget.classList.add(
                            button.color,
                            button.textColor
                          );
                        }}
                        onMouseLeave={(e) => {
                          if (selectedButton !== button.value) {
                            e.currentTarget.classList.remove(
                              button.color,
                              button.textColor
                            );
                            e.currentTarget.classList.add(
                              "bg-white",
                              "text-gray-700"
                            );
                          }
                        }}
                        className={`border p-6 border-gray-300 sm:w-full sm:pb-full relative md:w-36 md:h-24 flex flex-col items-center justify-center rounded-lg transition-colors duration-200 ${
                          selectedButton === button.value
                            ? button.color + " " + button.textColor
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="flex items-center  justify-center md:text-xl mt-2 mb-1">
                            {button.icon}
                          </div>
                          <div className="hidden md:block font-semibold mb-1">
                            {button.value}
                          </div>
                          <span className="flex items-center flex-col text-xs">
                            {button.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t mt-2 mb-2 border-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-sky-300 rounded-lg md:p-4 p-3 text-gray-700 font-bold"
                    >
                      {reviewBtn ? "Posting Review..." : "Post Review"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col md:w-2/3 items-center mt-4 mb-4">
                <div className="flex items-center justify-center">
                  <img
                    src={provider.profilePicture}
                    alt="profile"
                    className="rounded-full size-32 object-cover shadow-sm "
                  />
                </div>
                <p className="text-2xl text-slate-700  mt-2 font-semibold">
                  {provider.fullName}
                </p>
                <div className="md:text-sm text-xs text-slate-700 mt-2 text-center font-semibold">
                  {Array.isArray(provider.name) ? (
                    <>
                      <p>{provider.name.slice(0, 2).join(", ")}</p>
                      {provider.name.length > 2 ? (
                        <p>{provider.name.slice(2).join(", ")}</p>
                      ) : null}
                      {provider.name.length > 3 ? (
                        <p>{`+${provider.name.length - 2}more`}</p>
                      ) : null}
                    </>
                  ) : (
                    <p>{provider.name}</p>
                  )}
                </div>
                <div className="flex mt-2">
                  <MdLocationOn className="h-4 w-4 items-center text-sky-300" />
                  <p className="flex flex-col text-sm text-gray-700 truncate w-full md:w-auto">
                    {provider.address &&
                      `${provider.address.city}, ${provider.address.pincode}`}
                    <span className="block md:inline text-center"></span>
                  </p>
                </div>
                <div className="flex flex-row items-center justify-center mt-2 gap-2">
                  <div className="text-slate-700">
                    <TiStarFullOutline />
                  </div>
                  <h1 className="text-slate-700 text-sm">
                    {review.totalrating}
                  </h1>
                  <h1 className="text-slate-700">
                    ({review.totalratings} Reviews)
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
