import Room from "../models/room.model.js";
import Provider from "../models/provider.model.js";
import Message from "../models/message.model.js";

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
    const providers = await Provider.find({ _id: { $in: providerIds } });
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
