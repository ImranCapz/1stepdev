import { Button } from "@material-tailwind/react";
import { BiSend } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import toast from "react-hot-toast";
import './Message.css'

// time ago
import ReactTimeAgo from "react-time-ago";

export default function ProviderMessageDash() {
  const { currentUser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [limitedMessages, setLimitedMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const messageContainerRef = useRef(null);

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

  useEffect(() => {
    if (socket) {
      socket.emit("Online", currentUser._id);

      socket.on("UserOnline", ({ userId, isOnline }) => {
        if (userId === selectedUser._id) {
          setIsOnline(isOnline);
        }
      });
    }
  }, []);

  // fetch user and provider details
  useEffect(() => {
    const fetchProvidermsg = async () => {
      try {
        const res = await fetch(
          `/server/message/getuserprovider/${currentUser._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setUserDetails(data.users);
        setProviderId(data.providerId);
      } catch (error) {
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
    <div className="w-full flex max-h-[430px]">
      <div className="w-1/4 bg-gray-100 p-4 h-full overflow-y-auto">
        <div className="flex flex-col gap-5 items-center">
          {userDetails.length > 0 ? (
            <>
              {userDetails.map((user) => {
                const isSelected =
                  selectedUser && selectedUser._id === user._id;
                return (
                  <div
                    key={user._id}
                    className={`w-full p-3 rounded-lg flex items-center border-b-4 border-gray-200 pb-2 cursor-pointer ${
                      isSelected ? "bg-purple-200" : ""
                    }`}
                    onClick={() => handleProviderClick(user)}
                  >
                    <img
                      src={user.profilePicture}
                      alt="provider logo"
                      className="size-12 md:size-14 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-bold items-center justify-center text-gray hidden md:block">
                        {user.username}
                      </p>
                      <p className="text-xs md:text-xs">{messages.message}</p>
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
      <div className="w-3/4 p-4 flex flex-col bg-purple-100 overflow-hidden">
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
                style={{ overflowY: "scroll", height: "400px" }}
              >
                {limitedMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`m-2`}
                  >
                    <div
                      className={`flex items-center ${
                        String(message.sender) === String(currentUser._id)
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
                            ? "bg-sky-300 rounded-l-xl rounded-tr-xl"
                            : "bg-gray-300 rounded-r-xl rounded-tl-xl"
                        }  ${message.message.length > 30 ? "w-2/3" : "w-auto"}`}
                      >
                        {message.message}
                        <span className="ml-2" style={{ fontSize: "10px" }}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
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
            </div>
          </>
        ) : (
          <>
            <h2>Select a user</h2>
          </>
        )}
        <div className="flex-grow">
          <h2></h2>
        </div>
        <div className="flex gap-2 mt-4">
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
            className="bg-sky-400 border-gray-400"
          >
            <BiSend className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
