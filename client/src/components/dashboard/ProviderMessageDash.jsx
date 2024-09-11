import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import TopLoadingBar from "react-top-loading-bar";

// time ago
import ReactTimeAgo from "react-time-ago";
import BeatLoader from "react-spinners/BeatLoader";

//icons
import { Card } from "flowbite-react";
import { PiInfoBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
// import { BiCheckDouble } from "react-icons/bi";
// import { FaCheck } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

//redux
import { selectUser } from "../../redux/provider/providerSlice";
import { userOnline, userOfflines } from "../../redux/user/onlineSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

//loader
import ContentLoader from "react-content-loader";

export default function ProviderMessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const { currentProvider } = useSelector((state) => state.provider);
  const { user } = useSelector((state) => state.provider);
  const { onlineAllUsers } = useSelector((state) => state.online);
  const [userDetails, setUserDetails] = useState([]);
  // console.log("UserDetails", userDetails);
  const [providerId, setProviderId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [limitedMessages, setLimitedMessages] = useState([]);

  const messageContainerRef = useRef(null);
  const topLoadingBarRef = useRef(null);

  //loading
  const [loading, setLoading] = useState(true);
  const [userloading, setUserLoading] = useState(true);
  const [info, setInfo] = useState(false);
  const dispatch = useDispatch();

  // socket.io
  const SOCKET_SERVER_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [send, setSend] = useState("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.emit("Online", currentProvider._id);

    newSocket.on("UserOnline", ({ userId }) => {
      // console.log("User online", userId);
      dispatch(userOnline(userId));
    });

    newSocket.on("UserOut", ({ userId }) => {
      // console.log("User offline", userId);
      dispatch(userOfflines(userId));
    });

    return () => {
      newSocket.close();
    };
  }, [currentProvider._id, dispatch]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = ({ sender, message, provider, userid }) => {
      if (user !== userid) {
        toast.success(`new message from ${sender}`);
        return;
      }
      const newMessage = {
        sender,
        message,
        provider,
        userid,
        createdAt: new Date(),
      };
      setNewMessage((newmessage) => [...newmessage, newMessage]);
      setLimitedMessages((newmessage) => [...newmessage, newMessage]);
      setUserDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((users) => {
          if (users._id === user) {
            return {
              ...users,
              lastMessage: newMessage,
            };
          }
          return users;
        });
        return updatedDetails;
      });
    };
    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [socket, user]);

  const handleSendMessage = () => {
    if (send === "") {
      toast.error("Message cannot be empty");
    }
    if (socket) {
      socket.emit("joinRoom", {
        roomId: `${selectedUser._id}_${providerId}`,
        sender: currentUser._id,
        provider: providerId,
        reciever: selectedUser._id,
      });
      socket.emit("sendMessage", {
        roomId: `${selectedUser._id}_${providerId}`,
        message: send,
        sender: currentUser._id,
        provider: providerId,
        userid: selectedUser._id,
        reciever: selectedUser._id,
      });
      setSend("");
    }
  };

  useEffect(() => {
    if (selectedUser && socket) {
      const roomId = `${selectedUser._id}_${providerId}`;
      socket.emit("joinRoom", {
        roomId,
        sender: currentUser._id,
        provider: providerId,
        receiver: selectedUser._id,
      });
    }
  }, [selectedUser, socket, currentUser._id, providerId]);

  // fetch user and provider details
  useEffect(() => {
    const fetchProvidermsg = async () => {
      try {
        setLoading(true);
        topLoadingBarRef.current.continuousStart(50);
        const res = await fetch(
          `/server/message/getuserprovider/${currentUser._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setUserDetails(data.users);
        setProviderId(data.providerId);
        setLoading(false);
        topLoadingBarRef.current.complete(50);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchProvidermsg();
  }, [currentUser._id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  //effecive scroll
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 50;
      if (
        messageContainerRef.current &&
        messageContainerRef.current.scrollTop <= threshold
      ) {
        loadPreviousMessages();
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

  const loadPreviousMessages = () => {
    const numberofMsgToShow = 10;
    const currentLength = limitedMessages.length;
    const addMsg = messages.slice(
      Math.max(0, messages.length - currentLength - numberofMsgToShow),
      messages.length - currentLength
    );
    setLimitedMessages([...addMsg, ...limitedMessages]);
  };

  //scrolltoBottom

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
  }, [messages, newMessage]);

  const handleinfo = () => {
    setInfo(true);
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setInfo(false);
    const roomID = `${user._id}_${providerId}`;
    try {
      const res = await fetch(`/server/message/getmessage/${roomID}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setMessages(data);
      setLimitedMessages(data.slice(-9));
      const unreadMessages = data.filter(
        (msg) => !msg.read && msg.sender !== currentUser._id
      );
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
      setUserDetails((prevDetails) => {
        const updatedDetails = prevDetails.map((users) => {
          if (
            users._id === user._id &&
            users.lastMessage?.sender !== currentUser._id
          ) {
            return {
              ...users,
              lastMessage: {
                ...users.lastMessage,
                read: true,
              },
            };
          }
          return users;
        });
        return updatedDetails;
      });
    } catch (error) {
      console.log(error);
    }
  };

  //last message fetch
  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        setUserLoading(true);
        const res = await fetch(
          `/server/message/getuserprovider/${currentUser._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        const userLastMessage = await Promise.all(
          data.users.map(async (user) => {
            const roomID = `${user._id}_${data.providerId}`;
            const [messRes, unreadRes] = await Promise.all([
              fetch(`/server/message/getlastmessage/${roomID}`),
              fetch(
                `/server/message/getunreadmessagescount/${roomID}?reciever=${currentUser._id}`
              ),
            ]);
            const messData = await messRes.json();
            const unreadData = await unreadRes.json();
            // console.log("unreadData", unreadData);
            return {
              ...user,
              lastMessage: messData,
              unreadCount: unreadData.unreadCount,
            };
          })
        );
        const sortedUser = userLastMessage.sort((a, b) => {
          const DateA = new Date(a.lastMessage.createdAt);
          const DateB = new Date(b.lastMessage.createdAt);
          return DateB - DateA;
        });
        setUserDetails(sortedUser);
        setUserLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLastMessage();
  }, [currentUser._id]);

  return (
    <div className="flex flex-col">
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
          {userDetails.length > 0 ? (
            <>
              <div className="flex flex-grow h-screen max-h-[390px] 2xl:max-h-[700px]">
                <div className="w-1/4 chatbg flex flex-col items-center pt-2 pr-2 gap-2">
                  {userDetails.length > 0 ? (
                    <>
                      {userloading ? (
                        <>
                          {userDetails.map((user) => (
                            <ContentLoader
                              height={80}
                              width={290}
                              speed={2}
                              key={user._id}
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
                          {userDetails.map((user) => {
                            const isSelected =
                              selectedUser && selectedUser._id === user._id;
                            return (
                              <div
                                key={user._id}
                                className={`w-full p-4 flex chatbox-color gap-5 border-b-2 items-center cursor-pointer ${
                                  isSelected ? "chat-selected" : "messagebg"
                                }`}
                                onClick={() => {
                                  dispatch(selectUser(user._id));
                                  handleUserClick(user);
                                }}
                              >
                                <div className="relative">
                                  <img
                                    src={user.profilePicture}
                                    alt="provider logo"
                                    className="w-9 h-9 2xl:size-20 md:w-12 md:h-12 rounded-full object-cover"
                                  />
                                  {onlineAllUsers[user._id] ? (
                                    <GoDotFill className="absolute text-green-400 top-0 right-0 transition-all ease-in duration-150" />
                                  ) : (
                                    <GoDotFill className="absolute text-red-400 top-0 right-0  transition-all ease-in duration-150" />
                                  )}
                                </div>
                                <div className="flex-grow hidden md:block">
                                  <p className="font-semibold items-center justify-center">
                                    {user.username}
                                  </p>

                                  <div className="flex flex-row gap-1">
                                    {/* {user.lastMessage?.read ? (
                                  <>
                                    <div className="flex items-center">
                                      <BiCheckDouble className="text-green-400 justify-start" />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      <FaCheck className="text-gray-400 text-xs" />
                                    </div>
                                  </>
                                )} */}
                                    <p
                                      className={`text-xs md:text-xs line-clamp-1 ${
                                        !user.lastMessage?.read &&
                                        user.lastMessage?.sender !==
                                          currentUser._id
                                          ? "text-gray-700 font-bold"
                                          : ""
                                      }`}
                                    >
                                      {user.lastMessage?.message.slice(0, 20)}
                                      {user.lastMessage?.message.length > 20
                                        ? "....."
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    style={{ fontSize: "9px" }}
                                    className="hidden md:block"
                                  >
                                    <span
                                      className="ml-2"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {(() => {
                                        const messageDate = new Date(
                                          user.lastMessage?.createdAt
                                        );
                                        const now = new Date();
                                        const timeDiff = now - messageDate;
                                        const oneDay = 24 * 60 * 60 * 1000;
                                        const oneWeek = 7 * oneDay;

                                        const isYesterday = (date) => {
                                          const yesterday = new Date(now);
                                          yesterday.setDate(now.getDate() - 1);
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
                                    {!user.lastMessage?.read &&
                                      user.lastMessage?.sender !==
                                        currentUser._id && (
                                        <div className="bg-purple-400 rounded-full w-4 h-4 flex justify-center items-center">
                                          <p
                                            className="font-bold"
                                            style={{ fontSize: "10px" }}
                                          >
                                            {user.unreadCount}
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
                  {selectedUser ? (
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
                          <div className="flex item-center mb-4">
                            <img
                              src={selectedUser.profilePicture}
                              alt="provider logo"
                              className="size-10 rounded-full object-cover"
                            />
                            <div className="flex flex-row items-center text-start">
                              <div className="items-center">
                                <h2 className="flex flex-row ml-2 capitalize font-semibold">
                                  {selectedUser.username}
                                </h2>
                                {onlineAllUsers[selectedUser._id] ? (
                                  <div className="text-xs text-start ml-2 transition-all ease-in duration-150">
                                    Online
                                  </div>
                                ) : (
                                  <div className="text-xs text-start ml-2 transition-all ease-in duration-150">
                                    Offline
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <PiInfoBold
                              className="size-6 text-gray"
                              onClick={handleinfo}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col flex-grow h-screen">
                          <div
                            ref={messageContainerRef}
                            className="overflow-y-scroll h-[245px] md:h-[240px] 2xl:h-[550px]"
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
                                      src={selectedUser.profilePicture}
                                      alt="user logo"
                                      className="size-8 rounded-full mr-2 object-cover"
                                    />
                                  )}
                                  <div
                                    className={`p-2 text-xs md:text-base ${
                                      message.sender === currentUser._id
                                        ? "chat-sender rounded-l-xl rounded-tr-xl"
                                        : "bg-gray-300 rounded-r-xl rounded-tl-xl"
                                    }  ${
                                      message.message.length > 30
                                        ? "w-2/3"
                                        : "w-auto"
                                    }`}
                                  >
                                    <div className="flex items-center ml-2">
                                      {message.message}
                                      <span
                                        className="ml-2 mt-1"
                                        style={{ fontSize: "10px" }}
                                      >
                                        {new Date(
                                          message.createdAt
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                      {/* {message.sender === currentUser._id && (
                                        <span
                                          className="ml-1 mt-1"
                                          style={{ fontSize: "20px" }}
                                        >
                                          {message.read ? (
                                            <BiCheckDouble className="text-green-400 justify-start" />
                                          ) : (
                                            <FaCheck className="text-gray-400 text-sm" />
                                          )}
                                        </span>
                                      )} */}
                                    </div>
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
                                  className={`md:text-sm ${
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
                              required
                              placeholder="Type a message..."
                              className="w-full p-3 rounded-lg"
                              value={send}
                              onKeyDown={handleKeyDown}
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
                            <div className="flex flex-col items-center">
                              <img
                                src={selectedUser.profilePicture}
                                alt="user logo"
                                className="size-10 rounded-full object-cover"
                              />
                              <h2 className="capitalize font-semibold mt-2">
                                {selectedUser.username}
                              </h2>
                              <p className="text-xs mt-2">
                                {selectedUser.email}
                              </p>
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
                      <h2 className="text-gray">Select a people for chat.</h2>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full max-h-screen mx-auto">
                <div className="h-52vh md:h-72vh bg-provmsgbg bg-cover bg-center flex flex-col justify-center items-center text-white">
                  <div>
                    <h1 className="flex flex-col items-center text-4xl font-bold  text-gray-700">
                      No messages yet
                    </h1>
                    <h1 className="flex flex-col items-center text-2xl font-semibold mt-6 text-zinc-600">
                      You don&apos;t have any messages from client yet.
                    </h1>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
