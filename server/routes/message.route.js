import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  getMessages,
  getRoomMessages,
  getUserforProvider,
} from "../controllers/message.controller.js";

const router = express.Router();
router.get("/getprovider/:userId", verifyToken, getRoomMessages);
router.get("/getmessage/:roomId", verifyToken, getMessages);
router.get("/getuserprovider/:userId", verifyToken, getUserforProvider);

export default router;
