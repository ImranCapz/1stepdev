import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getLastMessages,
  getMessages,
  getRoomMessages,
  getUnreadMessagesCount,
  getUserforProvider,
  markasRead,
} from "../controllers/message.controller.js";

const router = express.Router();
router.get("/getprovider/:userId", verifyToken, getRoomMessages);
router.get("/getmessage/:roomId", verifyToken, getMessages);
router.get("/getuserprovider/:userId", verifyToken, getUserforProvider);
router.get("/getlastmessage/:roomId", verifyToken, getLastMessages);
router.put("/markasread/:messageId", verifyToken, markasRead);
router.get("/getunreadmessagescount/:roomId", verifyToken, getUnreadMessagesCount);

export default router;
