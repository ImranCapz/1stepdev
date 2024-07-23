import Room from "../models/room.model.js";
import Provider from "../models/provider.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getRoomMessages = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const room = await Room.find({ sender: userId }).populate("provider");
    if (!room || room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }
    const providerIds = [
      ...new Set(room.map((room) => room.provider._id.toString())),
    ];
    const providers = await Provider.find({
      _id: { $in: providerIds },
    });
    if (!providers || providers.length === 0) {
      return res
        .status(404)
        .json({ message: "Provider not found", success: false });
    }
    return res.status(200).json(providers);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ roomID: roomId });
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    const messages = (await Message.find({ _id: { $in: room.messages } })).sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getUserforProvider = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await Room.find({ reciever: userId }).populate("sender");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userids = [
      ...new Set(user.map((user) => user.sender._id.toString())),
    ];
    const users = await User.find({ _id: { $in: userids } }).select(
      "-password"
    );
    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const provider = await Provider.findOne({ userRef: userId }).select("_id");
    if (!provider || provider.length === 0) {
      return res
        .status(404)
        .json({ message: "Provider not found", success: false });
    }
    return res.status(200).json({ users, providerId: provider._id });
  } catch (error) {
    next(error);
  }
};

export const getLastMessages = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findOne({ roomID: roomId });
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }
    const lastMessage = await Message.findOne({ _id: { $in: room.messages } })
      .sort({ createdAt: -1 })
      .exec();
    if (!lastMessage) {
      return res.status(404).json({ message: "No messages found" });
    }
    return res.status(200).json(lastMessage);
  } catch (error) {
    next(error);
  }
};

export const getUnreadMessagesCount = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const recieverId = req.query.reciever;
    const room = await Room.findOne({ roomID: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found " });
    }
    const unreadCount = await Message.countDocuments({
      _id: { $in: room.messages },
      read: false,
      reciever: recieverId,
    });
    return res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markasRead = async (req, res, next) => {
  const messageId = req.params.messageId;
  try {
    await Message.updateOne({ _id: messageId }, { read: true });
    return res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    next(error);
  }
};
