import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
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

export default function ProviderMessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [limitedMessages, setLimitedMessages] = useState([]);
  // const [isOnline, setIsOnline] = useState(false);
  const messageContainerRef = useRef(null);
  const topLoadingBarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(false);
  console.log("selectedUser", selectedUser);

  // socket.io
  const SOCKET_SERVER_URL = "http://localhost:3000";
  const [socket, setSocket] = useState(null);
  const [send, setSend] = useState("");

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("receiveMessage", ({ sender, message }) => {
      setNewMessage((prevMsg) => [
        ...prevMsg,
        { sender, message, createdAt: new Date() },
      ]);
      setLimitedMessages((prevMsg) => [
        ...prevMsg,
        { sender, message, createdAt: new Date() },
      ]);
    });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (send === "") {
      toast.error("Message cannot be empty");
    }
    if (socket) {
      socket.emit("joinRoom", {
        roomId: `${selectedUser._id}_${providerId}`,
        sender: currentUser._id,
        provider: providerId,
        receiver: selectedUser._id,
      });
      socket.emit("sendMessage", {
        roomId: `${selectedUser._id}_${providerId}`,
        message: send,
        sender: currentUser._id,
        provider: providerId,
        receiver: selectedUser._id,
      });
      setSend("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  //Online status

  // useEffect(() => {
  //   if (socket) {
  //     socket.emit("Online", currentUser._id);

  //     socket.on("UserOnline", ({ userId, isOnline }) => {
  //       if (userId === selectedUser._id) {
  //         setIsOnline(isOnline);
  //       }
  //     });
  //   }
  // }, []);

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
        console.log(data.users);
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

  const handleProviderClick = async (user) => {
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
    } catch (error) {
      console.log(error);
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
              height: "80vh",
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
                      {userDetails.map((user) => {
                        const isSelected =
                          selectedUser && selectedUser._id === user._id;
                        return (
                          <div
                            key={user._id}
                            className={`w-full p-4 flex chatbox-color gap-5 border-b-2 items-center cursor-pointer ${
                              isSelected ? "chat-selected" : "messagebg"
                            }`}
                            onClick={() => handleProviderClick(user)}
                          >
                            <img
                              src={user.profilePicture}
                              alt="provider logo"
                              className="size-10 md:size-12 rounded-full object-cover"
                            />
                            <div className="flex-grow">
                              <p className="font-semibold items-center justify-center hidden md:block">
                                {user.username}
                              </p>
                              <p className="text-xs md:text-xs">
                                {messages.message}
                              </p>
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
                            <h2 className="flex ml-2 capitalize font-semibold pb-">
                              {selectedUser.username}
                            </h2>
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
                            className="overflow-y-scroll h-[255px] md:h-[240px] 2xl:h-[550px]"
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
              <div className="flex flex-col w-full max-h-screen p-2 mx-auto">
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
