import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Room from "./models/room.model.js";

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const OnlineUsers = {};

  io.on("connection", (socket) => {
    socket.on("Online", (userId) => {
      OnlineUsers[userId] = socket.id;
      io.emit("UserOnline", { userId });
    });

    socket.on("joinRoom", async ({ roomId, sender, reciever, provider }) => {
      try {
        let room = await Room.findOne({ roomID: roomId });
        if (!room) {
          room = new Room({
            roomID: roomId,
            sender: sender,
            reciever: reciever,
            provider: provider,
            messages: [],
          });
          await room
            .save()
            .then((room) => console.log("Room created", room))
            .catch((error) => console.error("Error creating room:", error));
        }
        socket.join(roomId);
        socket.emit("roomJoined", { roomId: roomId, success: true });
      } catch (error) {
        console.log("Error joining room:", error);
        socket.emit("roomJoined", { success: false });
      }
    });

    socket.on(
      "sendMessage",
      async ({ roomId, message, sender, reciever, provider, userid }) => {
        const newMessage = new Message({
          sender,
          reciever,
          provider,
          message,
          userid,
        });
        await newMessage
          .save()
          .then(() => console.log("Message saved successfully"))
          .catch((error) => console.error("Error saving message:", error));
        await Room.findOneAndUpdate(
          { roomID: roomId },
          { $push: { messages: newMessage._id } }
        );
        io.to(roomId).emit("receiveMessage", {
          sender,
          message,
          provider,
          userid,
          reciever,
        });
        socket.emit("messageSent", { roomId: roomId, success: true });
      }
    );

    socket.on("messageRead", (messageId, roomId) => {
      Message.findByIdAndUpdate(messageId, { read: true }, (err, message) => {
        if (err) {
          console.log("Error updating message read status", err);
        }
        io.to(roomId).emit("messageRead", { message, read: true });
      });
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(OnlineUsers).find(
        (key) => OnlineUsers[key] === socket.id
      );
      if (userId) {
        delete OnlineUsers[userId];
        io.emit("UserOut", { userId });
      }
    });
  });
};

export default socketSetup;
