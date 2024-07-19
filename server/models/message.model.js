import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "provider",
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
