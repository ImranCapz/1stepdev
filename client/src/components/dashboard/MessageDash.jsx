import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TimeAgo from "timeago-react";

export default function MessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const [providerDetails, setProviderDetails] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  console.log(messages);
  useEffect(() => {
    const fetchProvidermsg = async () => {
      try {
        const res = await fetch(
          `/server/message/getprovider/${currentUser._id}`
        );
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          return;
        }
        setProviderDetails(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvidermsg();
  }, [currentUser._id]);

  const handleProviderClick = async (provider) => {
    setSelectedProvider(provider);
    const roomID = `${currentUser._id}_${provider._id}`;
    try {
      const res = await fetch(`/server/message/getmessage/${roomID}`);
      const data = await res.json();
      setMessages(data);

      if (data.success === false) {
        return;
      }
      setMessages(data);
      // navigate(`/dashboard/message?tag=${provider.fullName}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-96 overflow-hidden">
      <div className="w-1/4 bg-gray-100 p-4">
        <div
          className="flex flex-col gap-5 items-center overflow-y-auto"
          style={{ maxHeight: "90%" }}
        >
          {providerDetails.length > 0 ? (
            <>
              {providerDetails.map((provider, index) => {
                const isSelected =
                  selectedProvider && selectedProvider._id === provider._id;
                return (
                  <div
                    key={index}
                    className={`w-full p-3 rounded-lg flex items-center border-b-4 border-gray-200 pb-2 cursor-pointer ${
                      isSelected ? "bg-purple-200" : ""
                    }`}
                    onClick={() => handleProviderClick(provider)}
                  >
                    <img
                      src={provider.profilePicture}
                      alt="provider logo"
                      className="size-14 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p
                        className="font-bold text-xl text-gray hidden
                      md:block"
                      >
                        {provider.fullName}
                      </p>
                      <p className="text-sm">{messages.message}</p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>no messages found</>
          )}
        </div>
      </div>
      <div className="w-3/4 p-4 flex flex-col bg-purple-100">
        {selectedProvider ? (
          <>
            <div className="flex flex-row">
              <img
                src={selectedProvider.profilePicture}
                alt="provider logo"
                className="size-10 rounded-full"
              />
              <h2 className="flex ml-2 capitalize font-semibold border-b-2 pb-5 border-sky-200 w-full">
                {selectedProvider.fullName}
              </h2>
            </div>
            <div className="flex-grow overflow-y-auto">
              {messages.map((message, index) => (
                <>
                  <div
                    key={index}
                    className={`p-3 rounded-lg m-2 ${
                      message.sender === currentUser._id
                        ? "ml-auto md:w-2/4 w-3/4"
                        : "mr-auto  w-1/4"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg text-sm md:text-base ${
                        message.sender === currentUser._id
                          ? "bg-sky-300"
                          : "bg-gray-100"
                      }`}
                    >
                      {message.message}
                    </div>
                    <TimeAgo
                      datetime={message.createdAt}
                      className="flex justify-end text-xs md:text-base"
                    />
                  </div>
                </>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>Select a Provider</h2>
          </>
        )}
        <div className="flex-grow">
          <h2></h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-3 rounded-lg"
          />
          <Button variant="outlined" className="bg-sky-400 border-gray-400">
            <BiSend className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
