import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import io from "socket.io-client";
import toast from "react-hot-toast";
import SearchBar from "../SearchBar";
import TopLoadingBar from "react-top-loading-bar";
import BeatLoader from "react-spinners/BeatLoader";

export default function MessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const [providerDetails, setProviderDetails] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [limitedMessages, setLimitedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageContainerRef = useRef(null);
  const topLoadingBarRef = useRef(null);
  console.log(limitedMessages);

  //socket
  const SOCKET_SERVER_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [send, setSend] = useState("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("receiveMessage", ({ sender, message }) => {
      setNewMessage((newmessage) => [
        ...newmessage,
        { sender, message, createdAt: new Date() },
      ]);
      setLimitedMessages((newmessage) => [
        ...newmessage,
        { sender, message, createdAt: new Date() },
      ]);
    });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (send === "") return toast.error("Message cannot be empty");
    if (socket) {
      socket.emit("joinRoom", {
        roomId: `${currentUser._id}_${selectedProvider._id}`,
        sender: currentUser._id,
        provider: selectedProvider._id,
        reciever: selectedProvider.userRef,
      });
      socket.emit("sendMessage", {
        roomId: `${currentUser._id}_${selectedProvider._id}`,
        message: send,
        sender: currentUser._id,
        provider: selectedProvider._id,
        reciever: selectedProvider.userRef,
      });
      setSend("");
    }
  };

  useEffect(() => {
    if (selectedProvider && socket) {
      const roomId = `${currentUser._id}_${selectedProvider._id}`;
      socket.emit("joinRoom", {
        roomId: roomId,
        sender: currentUser._id,
        provider: selectedProvider._id,
        reciever: selectedProvider.userRef,
      });
    }
  }, [selectedProvider, socket, currentUser._id]);

  useEffect(() => {
    const fetchProvidermsg = async () => {
      setLoading(true);
      topLoadingBarRef.current.continuousStart();
      try {
        const res = await fetch(
          `/server/message/getprovider/${currentUser._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        console.log("data", data);
        setProviderDetails(data);
        setLoading(false);
        topLoadingBarRef.current.complete(50);
      } catch (error) {
        setLoading(false);
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
      if (data.success === false) {
        return;
      }
      setMessages(data);
      setLimitedMessages(data.slice(-10));
    } catch (error) {
      console.log(error);
    }
  };

  const handlekeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const countWords = (message) => {
    return message.split(" ").length;
  };

  //scroll up load message

  useEffect(() => {
    const handleScroll = () => {
      const theshold = 10;
      if (
        messageContainerRef.current &&
        messageContainerRef.current.scrollTop <= theshold
      ) {
        loadPreviousMessage();
      }
    };
    if (messageContainerRef.current) {
      const messageContainer = messageContainerRef.current;
      messageContainer.addEventListener("scroll", handleScroll);

      return () => {
        if (messageContainer) {
          messageContainer.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [limitedMessages]);

  const loadPreviousMessage = () => {
    const numofMsgShow = 10;
    const currentLength = limitedMessages.length;
    const scrollUpMsg = messages.slice(
      Math.max(0, messages.length - currentLength - numofMsgShow),
      messages.length - currentLength
    );
    setLimitedMessages((prev) => [...scrollUpMsg, ...prev]);
  };

  //scroll to bottom

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const { scrollHeight, clientHeight } = messageContainerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      messageContainerRef.current.scrollTop =
        maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [newMessage, messages]);

  return (
    <div className="full-height flex flex-col">
      <TopLoadingBar
        color="#722a88"
        ref={topLoadingBarRef}
        height={3}
        speed={1000}
      />
      {loading ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: '70vh',
            }}
          >
            <BeatLoader color="#AFDBD8" loading={loading} size={20} />
          </div>
        </>
      ) : (
        <>
          <TopLoadingBar
            color="#ff9900"
            ref={topLoadingBarRef}
            height={3}
            speed={1000}
          />
          {providerDetails.length > 0 ? (
            <>
              <div className="flex flex-grow h-screen max-h-[440px] 2xl:max-h-[745px]">
                <div className="w-1/4 bg-gray-100 flex flex-col items-center">
                  {providerDetails.length > 0 ? (
                    <>
                      {providerDetails.map((provider) => {
                        const isSelected =
                          selectedProvider &&
                          selectedProvider._id === provider._id;
                        return (
                          <div
                            key={provider._id}
                            className={`w-full p-4 flex border-b-2 border-purple-300 items-center cursor-pointer  ${
                              isSelected ? "main-color" : "messagebg"
                            }`}
                            onClick={() => handleProviderClick(provider)}
                          >
                            <img
                              src={provider.profilePicture}
                              alt="provider logo"
                              className="size-12 md:size-14 rounded-full mr-4 object-cover"
                            />
                            <div className="flex-grow">
                              <p className="font-bold items-center justify-center text-gray hidden md:block">
                                {provider.fullName}
                              </p>
                              <p className="text-sm">{messages.message}</p>
                              {/* <hr className="w-full mt-6 border-purple-800 hidden md:block" /> */}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>no messages found</>
                  )}
                </div>

                <div className="w-3/4 p-4 flex flex-col bg-slate-200 border-l-2 border-slate-400 overflow-hidden ">
                  {selectedProvider ? (
                    <>
                      <div className="flex flex-row">
                        <img
                          src={selectedProvider.profilePicture}
                          alt="provider logo"
                          className="w-12 h-10 md:h-12 md rounded-full object-cover "
                        />
                        <h2 className="flex ml-2 capitalize font-semibold border-b-2 pb-5 border-purple-500 w-full">
                          {selectedProvider.fullName}
                        </h2>
                        <div className=""></div>
                      </div>
                      <div className="flex flex-col flex-grow h-screen">
                        <div
                          ref={messageContainerRef}
                          className=" overflow-y-scroll h-[320px] md:h-[310px] 2xl:h-[620px]"
                        >
                          {limitedMessages.map((message) => (
                            <div key={message._id} className={`m-2`}>
                              <div
                                className={`flex items-center ${
                                  String(message.sender) ===
                                  String(currentUser._id)
                                    ? "justify-end"
                                    : ""
                                }`}
                              >
                                {message.sender !== currentUser._id && (
                                  <img
                                    src={selectedProvider.profilePicture}
                                    alt="provider logo"
                                    className="size-9 rounded-full mr-2 object-cover"
                                  />
                                )}
                                <div
                                  className={`p-2 text-xs md:text-base ${
                                    message.sender === currentUser._id
                                      ? "bg-sky-300 rounded-l-xl rounded-tr-xl"
                                      : "bg-gray-300 rounded-r-xl rounded-tl-xl"
                                  } ${
                                    countWords(message.message) > 10
                                      ? "w-2/3"
                                      : "w-max"
                                  }`}
                                >
                                  {message.message}
                                  <span
                                    className="ml-2"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {new Date(
                                      message.createdAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                {message.sender === currentUser._id && (
                                  <img
                                    src={currentUser.profilePicture}
                                    alt="user logo"
                                    className="size-9 rounded-full ml-2 object-cover"
                                  />
                                )}
                              </div>
                              <div
                                className={`${
                                  message.sender === currentUser._id
                                    ? "mr-10 text-right"
                                    : "ml-10 text-left"
                                }`}
                                style={{ fontSize: "12px" }}
                              >
                                <ReactTimeAgo
                                  locale="en-US"
                                  date={new Date(message.createdAt)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-3 rounded-lg"
                            value={send}
                            onKeyDown={handlekeydown}
                            onChange={(e) => setSend(e.target.value)}
                          />
                          <Button
                            onClick={handleSendMessage}
                            variant="outlined"
                            className="btn-color border-gray-400"
                          >
                            <BiSend className="size-5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full">
                      <h2 className="">Select a Provider</h2>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full max-h-screen p- mx-auto">
                <div className="h-52vh md:h-72vh bg-nomsgbg bg-cover bg-center flex flex-col justify-center items-center text-white">
                  <div>
                    <h1 className="flex flex-col items-center text-4xl font-bold  text-gray-700">
                      No Messages yet
                    </h1>
                    <h1 className="flex flex-col items-center text-2xl font-semibold mt-6 text-zinc-600">
                      To begin, search for a provider and send them a message.
                    </h1>
                  </div>
                </div>
                {/* <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray mt-2">No Message, yet</h1>
            <h2 className="text-xl mt-4 ">Find a best therapy for you need </h2>
          </div> */}
                <div className="flex items-center justify-center mt-6">
                  <SearchBar />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
