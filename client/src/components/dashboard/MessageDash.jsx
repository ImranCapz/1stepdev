import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import ReactTimeAgo from "react-time-ago";
import io from "socket.io-client";
import toast from "react-hot-toast";
import SearchBar from "../SearchBar";
import TopLoadingBar from "react-top-loading-bar";
import BeatLoader from "react-spinners/BeatLoader";
import { Card, Tooltip } from "flowbite-react";
import { MdLocationOn, MdWorkspacePremium } from "react-icons/md";

//redux
import { useDispatch, useSelector } from "react-redux";
import { userOnline } from "../../redux/user/onlineSlice";
import { userOfflines } from "../../redux/user/onlineSlice";
import { selectProvider } from "../../redux/provider/providerSlice";

//icons
import { PiInfoBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { FcApproval } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";

//loader
import ContentLoader from "react-content-loader";

export default function MessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const { onlineAllUsers } = useSelector((state) => state.online);
  const { id } = useSelector((state) => state.provider);
  const [providerDetails, setProviderDetails] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [limitedMessages, setLimitedMessages] = useState([]);

  //loader
  const [loading, setLoading] = useState(true);
  const [providerLoading, setProviderLoading] = useState(true);
  const messageContainerRef = useRef(null);
  const topLoadingBarRef = useRef(null);
  const [info, setInfo] = useState(false);
  const dispatch = useDispatch();

  //socket
  const SOCKET_SERVER_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [send, setSend] = useState("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("Online", currentUser._id);

    newSocket.on("UserOnline", ({ userId }) => {
      dispatch(userOnline(userId));
    });

    newSocket.on("UserOut", ({ userId }) => {
      dispatch(userOfflines(userId));
    });

    return () => newSocket.close();
  }, [currentUser._id, dispatch]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = ({ sender, message, provider }) => {
      if (provider !== id) {
        toast.success("New message received");
        return;
      }
      const newMessage = { sender, message, provider, createdAt: new Date() };
      setNewMessage((newmessage) => [...newmessage, newMessage]);
      setLimitedMessages((newmessage) => [...newmessage, newMessage]);
      setProviderDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((providers) => {
          if (providers._id === id) {
            return {
              ...providers,
              lastMessage: newMessage,
            };
          }
          return providers;
        });
        return updatedDetails;
      });
    };
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [socket, id]);

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
        userid: currentUser._id,
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
      socket.on("messageRead", (messageId) => {
        setLimitedMessages((prevMsg) =>
          prevMsg.map((msg) =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
      });
      return () => {
        socket.off("messageRead");
      };
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
          setLoading(false);
          setProviderLoading(false);
          return;
        }
        setProviderDetails(data);
        topLoadingBarRef.current.complete(50);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchProvidermsg();
  }, [currentUser._id]);

  const handlekeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

  const handleinfo = () => {
    setInfo(true);
  };

  const handleProviderClick = async (provider) => {
    setSelectedProvider(provider);
    setInfo(false);
    const roomID = `${currentUser._id}_${provider._id}`;
    try {
      const res = await fetch(`/server/message/getmessage/${roomID}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setMessages(data);
      setLimitedMessages(data.slice(-10));
      const unreadMessages = data.filter(
        (msg) => !msg.read && msg.sender !== currentUser._id
      );
      console.log("unreadMessages", unreadMessages);
      await Promise.all(
        unreadMessages.map(async (msg) =>
          fetch(`/server/message/markasread/${msg._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          })
        )
      );
      setLimitedMessages((prevMsg) =>
        prevMsg.map((msg) =>
          msg.sender !== currentUser._id ? { ...msg, read: true } : msg
        )
      );
      setProviderDetails((prevDetails) => {
        const updateDetails = prevDetails.map((providers) => {
          if (
            providers._id === provider._id &&
            providers.lastMessage?.sender !== currentUser._id
          ) {
            return {
              ...providers,
              lastMessage: {
                ...providers.lastMessage,
                read: true,
              },
            };
          }
          return providers;
        });
        return updateDetails;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //fetch last message for each provider
  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        setLoading(true);
        setProviderLoading(true);
        const res = await fetch(
          `/server/message/getprovider/${currentUser._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setProviderLoading(false);
          return;
        }
        const providerLastMessage = await Promise.all(
          data.map(async (provider) => {
            const roomID = `${currentUser._id}_${provider._id}`;
            const [messRes, unreadRes] = await Promise.all([
              fetch(`/server/message/getlastmessage/${roomID}`),
              fetch(
                `/server/message/getunreadmessagescount/${roomID}?reciever=${currentUser._id}`
              ),
            ]);
            const messData = await messRes.json();
            const unreadData = await unreadRes.json();
            console.log("unreadData", unreadData);
            return {
              ...provider,
              lastMessage: messData || "No message yet",
              unreadCount: unreadData.unreadCount,
            };
          })
        );

        const sortedProviderLastMessage = providerLastMessage.sort((a, b) => {
          const DateA = new Date(a.lastMessage.createdAt);
          const DateB = new Date(b.lastMessage.createdAt);
          return DateB - DateA;
        });
        setProviderDetails(sortedProviderLastMessage);
        setProviderLoading(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchLastMessage();
  }, [currentUser._id]);

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
              height: "70vh",
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
              <div className="flex flex-grow h-screen max-h-[460px] 2xl:max-h-[745px]">
                <div className="w-1/4 flex flex-col items-center pt-2 pr-2 gap-2">
                  {providerDetails.length > 0 ? (
                    <>
                      {providerLoading && !loading ? (
                        <>
                          {providerDetails.map((provider) => (
                            <ContentLoader
                              height={80}
                              width={290}
                              speed={2}
                              key={provider._id}
                              viewBox="0 0 250 60"
                              backgroundColor="#f5f5f5"
                              foregroundColor="#D1BEE0"
                              className="2xl:w-[900px] 2xl:h-[110px]"
                            >
                              <circle
                                cx="127"
                                cy="35"
                                r="25"
                                className="md:hidden block"
                              />
                              <circle
                                cx="30"
                                cy="35"
                                r="25"
                                className="hidden md:block"
                              />
                              <rect
                                x="70"
                                y="20"
                                width="140"
                                height="8"
                                rx="4"
                                className="hidden md:block"
                              />
                              <rect
                                x="70"
                                y="40"
                                width="80"
                                height="8"
                                rx="4"
                                className="hidden md:block"
                              />
                            </ContentLoader>
                          ))}
                        </>
                      ) : (
                        <>
                          {providerDetails.map((provider) => {
                            const isSelected =
                              selectedProvider &&
                              selectedProvider._id === provider._id;
                            return (
                              <div
                                key={provider._id}
                                className={`w-full p-4 flex chatbox-color gap-5 border-b-2 items-center cursor-pointer ${
                                  isSelected ? "chat-selected" : "messagebg"
                                }`}
                                onClick={() => {
                                  dispatch(selectProvider(provider._id));
                                  handleProviderClick(provider);
                                }}
                              >
                                <div className="relative">
                                  <img
                                    src={provider.profilePicture}
                                    alt="provider logo"
                                    className="w-10 h-10 2xl:size-20 md:w-12 md:h-12 rounded-full object-cover"
                                  />
                                  {onlineAllUsers[provider._id] ? (
                                    <GoDotFill className="absolute top-0 right-0 text-green-400 transition-all ease-in duration-150" />
                                  ) : (
                                    <GoDotFill className="absolute top-0 right-0 text-red-400 transition-all ease-in duration-150" />
                                  )}
                                </div>
                                <div className="flex-grow hidden md:block">
                                  <p className="font-semibold items-center justify-center">
                                    {provider.fullName.slice(0, 15)}
                                  </p>
                                  <div className="flex flex-row gap-1">
                                    <p
                                      className={`text-sm line-clamp-1 ${
                                        !provider.lastMessage?.read &&
                                        provider.lastMessage?.sender !==
                                          currentUser._id
                                          ? "text-gray-700 font-bold"
                                          : ""
                                      }`}
                                    >
                                      {provider.lastMessage?.message.slice(
                                        0,
                                        20
                                      )}
                                      {provider.lastMessage?.message.length > 20
                                        ? "...."
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    style={{ fontSize: "11px" }}
                                    className="hidden md:block"
                                  >
                                    <span
                                      className="ml-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {(() => {
                                        const messageDate = new Date(
                                          provider.lastMessage?.createdAt || 0
                                        );
                                        const now = new Date();
                                        const timeDiff = now - messageDate;
                                        const oneDay = 24 * 60 * 60 * 1000;
                                        const oneWeek = 7 * oneDay;

                                        const isYesterday = (date) => {
                                          const yesterday = new Date(now);
                                          yesterday.setDate(
                                            yesterday.getDate() - 1
                                          );
                                          return (
                                            date.getDate() ===
                                              yesterday.getDate() &&
                                            date.getMonth() ===
                                              yesterday.getMonth() &&
                                            date.getFullYear() ===
                                              yesterday.getFullYear()
                                          );
                                        };

                                        if (timeDiff < oneDay) {
                                          return messageDate.toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          );
                                        } else if (isYesterday(messageDate)) {
                                          return "Yesterday";
                                        } else if (timeDiff < oneWeek) {
                                          return messageDate.toLocaleDateString(
                                            [],
                                            {
                                              weekday: "long",
                                            }
                                          );
                                        } else {
                                          return messageDate.toLocaleDateString(
                                            [],
                                            {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            }
                                          );
                                        }
                                      })()}
                                    </span>
                                  </div>
                                  <div>
                                    {!provider.lastMessage?.read &&
                                      provider.lastMessage?.sender !==
                                        currentUser._id && (
                                        <div className="bg-purple-400 rounded-full w-4 h-4 flex justify-center items-center">
                                          <p
                                            className="font-bold"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {provider.unreadCount}
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </>
                  ) : (
                    <>no messages found</>
                  )}
                </div>
                <div className="w-3/4 p-4 flex flex-col rightchatbox-color overflow-hidden">
                  {selectedProvider ? (
                    <div className="flex gap-2">
                      <div
                        className={`transition-all ease-in-out duration-200 ${
                          info ? "md:w-3/4" : "w-full"
                        }`}
                      >
                        <div
                          className={`flex flex-row items-center mb-4 justify-between border-b-2 border-purple-500 ${
                            info ? "" : "cursor-pointer"
                          }`}
                          onClick={handleinfo}
                        >
                          <div className="flex items-center mb-2">
                            <img
                              src={selectedProvider.profilePicture}
                              alt="provider logo"
                              className="w-10 h-10 md:h-10 md rounded-full object-cover"
                            />
                            <div className="flex flex-row items-center text-start">
                              <div className="items-center">
                                <h2 className="flex flex-row ml-2 capitalize font-semibold">
                                  {selectedProvider.fullName}
                                </h2>
                                {onlineAllUsers[selectedProvider._id] ? (
                                  <div className="text-xs text-start ml-2 fadeIn">
                                    Online
                                  </div>
                                ) : (
                                  <div className="text-xs text-start  ml-2">
                                    Offline
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <PiInfoBold className="size-6" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-grow h-screen">
                          <div
                            ref={messageContainerRef}
                            className=" overflow-y-scroll h-[320px] md:h-[290px] 2xl:h-[600px]"
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
                                        ? "chat-sender rounded-l-xl rounded-tr-xl"
                                        : "bg-gray-300 rounded-r-xl rounded-tl-xl"
                                    } ${
                                      message.message.length > 30
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
                      </div>
                      {info && (
                        <div className="w-1/3 p-2 pr-2 md:block hidden border-l-2 mt-2">
                          <div className="flex flex-row items-center space-x-2 mb-3">
                            <RxCross2
                              className="size-6 text-gray cursor-pointer"
                              onClick={() => setInfo(false)}
                            />
                            <p className="text-base font-semibold">
                              Contact info
                            </p>
                          </div>
                          <Card>
                            <div className="flex flex-col items-center justify-center">
                              <img
                                src={selectedProvider.profilePicture}
                                alt="user logo"
                                className="size-16 rounded-full object-cover"
                              />
                              <div>
                                <div className="flex flex-row justify-center items-center gap-1">
                                  <h2 className="capitalize font-semibold mt-2 provideritem-name">
                                    {selectedProvider.fullName}
                                  </h2>
                                  {selectedProvider.verified === true && (
                                    <>
                                      <Tooltip
                                        content="Verifed Profile"
                                        animation="duration-500"
                                      >
                                        <FcApproval className="animate-bounce size-4 mt-2" />
                                      </Tooltip>
                                    </>
                                  )}
                                </div>
                                <p className="text-xs text-center provideritem-service">
                                  {Array.isArray(selectedProvider.name) ? (
                                    <>
                                      <p>
                                        {selectedProvider.name
                                          .slice(0, 2)
                                          .join(", ")}
                                      </p>
                                      {selectedProvider.name.length > 2 ? (
                                        <p>
                                          {selectedProvider.name
                                            .slice(2)
                                            .join(", ")}
                                        </p>
                                      ) : null}
                                      {selectedProvider.name.length > 3 ? (
                                        <>
                                          <p>{`+${
                                            selectedProvider.name.length - 2
                                          }more`}</p>
                                        </>
                                      ) : null}
                                    </>
                                  ) : (
                                    <>{selectedProvider.name}</>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 mt-2">
                                <MdWorkspacePremium className="h-4 w-4 icon-color" />
                                <p className="text-sm provideritem-service">
                                  <span className="text-xs provideritem-service">
                                    {selectedProvider.experience}
                                  </span>
                                  &nbsp;years experience
                                </p>
                              </div>
                              {/* <div className="flex items-center text-center gap-1">
                              <RiMedalLine className="h-4 w-4 text-gray-600" />
                              <p className="text-sm">
                                <span className="text-xs">
                                  {selectedProvider.qualification}
                                </span>
                              </p>
                            </div> */}

                              <div className="flex items-center gap-1">
                                <MdLocationOn className="h-4 w-4 icon-color" />
                                <p className="text-sm provideritem-service truncate w-full">
                                  {selectedProvider.address.state},
                                  {selectedProvider.address.city}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col mx-auto items-center justify-center h-full">
                      <img
                        src={currentUser.profilePicture}
                        alt="user logo"
                        className="size-20 object-cover rounded-full border-4 border-purple-300"
                      />
                      <h1 className="text-2xl font-bold text-gray">
                        Hi,<span className="animate-wave">👋🏻</span>Welcome!
                      </h1>
                      <h2 className="text-gray">Select a provider for chat.</h2>
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
