import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { HiOutlineHandThumbDown } from "react-icons/hi2";
import { LuSmile } from "react-icons/lu";
import { TbMoodSad2 } from "react-icons/tb";
import { BsEmojiExpressionless } from "react-icons/bs";

export default function ProviderReview() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`/server/provider/get/${providerId}`);
        const data = await response.json();
        setProvider(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleClick = (value) => {
    setSelectedButton(value);
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

  if (!provider) {
    return <div>Error on Fetching provider Data</div>;
  }

  return (
    <div className="">
      <div className="h-52vh md:h-72vh bg-listbg bg-cover bg-center flex flex-col justify-center items-center text-white">
        <div className="">
          <h1 className="flex flex-col items-center text-xl font-semibold text-zinc-600">
            YOUR REVIEW FOR
          </h1>
          <h1 className="flex flex-col items-center text-5xl font-bold mt-6  text-gray-700">
            {provider.name}
          </h1>
        </div>
      </div>
      <div className="w-full md:w-2/3 mx-auto mt-4">
        <div className="flex flex-col justify-center outline outline-offset-4 outline-1 outline-gray-300 bg-white rounded-lg">
          <div className="p-4 font-semibold text-slate-700">
            Would you recommend this provider?*
          </div>
          <div className="flex flex-row gap-5 p-2">
            {buttons.map((button) => (
              <button
                key={button.value}
                onClick={() => setSelectedButton(button.value)}
                onMouseEnter={(e) => {
                  e.currentTarget.classList.remove("bg-white", "text-gray-700");
                  e.currentTarget.classList.add(button.color, button.textColor);
                }}
                onMouseLeave={(e) => {
                  if (selectedButton !== button.value) {
                    e.currentTarget.classList.remove(
                      button.color,
                      button.textColor
                    );
                    e.currentTarget.classList.add("bg-white", "text-gray-700");
                  }
                }}
                className={`border p-4 border-gray-300 w-36 h-24 flex flex-col items-center justify-center rounded-lg transition-colors duration-200 ${
                  selectedButton === button.value
                    ? button.color + " " + button.textColor
                    : "bg-white text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center text-xl mt-2 mb-1">
                  {button.icon}
                </div>
                <div className="hidden md:block font-semibold mb-1">
                  {button.value}
                </div>
                <span className="flex items-center flex-col text-xs">
                  {button.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
