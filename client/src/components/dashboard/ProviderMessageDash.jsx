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

  return (
    <>
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
                <div className="w-1/4 bg-gray-100 flex flex-col items-center">
                  {userDetails.length > 0 ? (
                    <>
                      {userDetails.map((user) => {
                        const isSelected =
                          selectedUser && selectedUser._id === user._id;
                        return (
                          <div
                            key={user._id}
                            className={`w-full p-4 flex border-b border-purple-300 items-center cursor-pointer ${
                              isSelected ? "main-color" : "messagebg"
                            }`}
                            onClick={() => handleProviderClick(user)}
                          >
                            <img
                              src={user.profilePicture}
                              alt="provider logo"
                              className="size-12 md:size-14 rounded-full mr-4 object-cover"
                            />
                            <div className="flex-grow">
                              <p className="font-bold items-center justify-center text-gray hidden md:block">
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
                <div className="w-3/4 p-4 flex flex-col bg-purple-100 border-l-2 border-slate-400 overflow-hidden">
                  {selectedUser ? (
                    <>
                      <div className="flex flex-row mb-4">
                        <img
                          src={selectedUser.profilePicture}
                          alt="provider logo"
                          className="size-10 rounded-full object-cover"
                        />
                        <h2 className="flex ml-2 capitalize font-semibold border-b-2 pb-2 border-purple-500 w-full">
                          {selectedUser.username}
                        </h2>
                      </div>
                      <div className="flex flex-col flex-grow overflow-y-auto">
                        <div
                          ref={messageContainerRef}
                          className="overflow-y-scroll h-[320px] md:[310px] 2xl:[620px]"
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
                    </>
                  ) : (
                    <>
                      <h2>Select a user</h2>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full max-h-screen p- mx-auto">
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
    </>
  );
}
