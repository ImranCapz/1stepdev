import express from "express";
import {
  createProvider,
  deleteProvider,
  updateProvider,
  getProvider,
  getProviders,
  getAdminProviders,
  sendOtp,
  verifyOtpProvider,
  fetchProvider,
  modifiedTimeslot,
} from "../controllers/provider.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProvider);
router.delete("/delete/:id", verifyToken, deleteProvider);
router.post("/update/:id", verifyToken, updateProvider);
router.post("/sendotp", verifyToken, sendOtp);
router.post("/verifyotp", verifyToken, verifyOtpProvider);
router.get("/fetchprovider/:id", verifyToken, fetchProvider);
router.get("/get/:id", getProvider);
router.get("/get", getProviders);
router.get("/getproviders", getAdminProviders);

//timeslot
router.post("/timeslots/:id", verifyToken, modifiedTimeslot);

export default router;
