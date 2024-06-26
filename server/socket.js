import { Server } from "socket.io";
import Message from "./models/message.model.js";

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173/",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("sendMessage", async ({ message, user, provider }) => {
      const newMessage = new Message({
        user,
        provider,
        message,
      });
      await newMessage.save();
      io.to(provider).emit("receiveMessage", { user, message });
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default socketSetup;
