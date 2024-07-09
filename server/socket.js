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
    console.log("User connected");

    // socket.on("Online", (userId) => {
    //   OnlineUsers[userId] = socket.id;
    //   io.emit("UserOnline", { userId, isOnline: true });
    // });

    socket.on("joinRoom", async ({ roomId, sender, reciever, provider }) => {
      try {
        console.log(`Joining room ${roomId}`);
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

          console.log(`Room created, ${roomId}`);
        }
        socket.join(roomId);
        console.log(`User ${sender} joined room ${roomId}`);
        socket.emit("roomJoined", { roomId: roomId, success: true });
      } catch (error) {
        console.log("Error joining room:", error);
        socket.emit("roomJoined", { success: false });
      }
    });

    socket.on(
      "sendMessage",
      async ({ roomId, message, sender, reciever, provider }) => {
        const newMessage = new Message({
          sender,
          reciever,
          provider,
          message,
        });
        await newMessage
          .save()
          .then((savedMessage) =>
            console.log("Message saved successfully", savedMessage)
          )
          .catch((error) => console.error("Error saving message:", error));
        await Room.findOneAndUpdate(
          { roomID: roomId },
          { $push: { messages: newMessage._id } }
        );
        io.to(roomId).emit("receiveMessage", { sender, message });
        console.log(`Message sent in room ${roomId}: ${message}`);
        socket.emit("messageSent", { roomId: roomId, success: true });
      }
    );

    socket.on("disconnect", () => {
      const userId = Object.keys(OnlineUsers).find(
        (key) => OnlineUsers[key] === socket.id
      );
      if (userId) {
        delete OnlineUsers[userId];
        io.emit("useOffline", { userId, isOnline: false });
      }
      console.log("User disconnected");
    });
  });
};

export default socketSetup;
