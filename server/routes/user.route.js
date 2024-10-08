import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  test,
  updateUser,
  getUserProvider,
  getUser,
  getUsers,
  deleteUser,
  resetPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", test);
router.post("/update/:id", verifyToken, updateUser);
router.post("/resetpassword/:id", verifyToken, resetPassword);
router.get("/providers/:id", verifyToken, getUserProvider);
router.get("/getusers", verifyToken, getUsers);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);

export default router;
