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
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", async ({ sender, reciever,provider }) => {
      try {
        const roomId = `${sender}_${provider}`;
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
        socket.emit('roomJoined',{ roomId : roomId, success: true});
      } catch (error) {
        console.log("Error joining room:", error);
        socket.emit("roomJoined", { success: false });
      }
    });

    socket.on("sendMessage", async ({ message, sender, reciever, provider }) => {
      const roomId = `${sender}_${provider}`;
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
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default socketSetup;
