import express from "express";
import {
  createProvider,
  deleteProvider,
  updateProvider,
  getProvider,
  getProviders,
  getAdminProviders,
  favoriteProvider,
  favoriteStatusProvider,
  favoriteList,
} from "../controllers/provider.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProvider);
router.delete("/delete/:id", verifyToken, deleteProvider);
router.post("/update/:id", verifyToken, updateProvider);
router.post("/favorite/:id", verifyToken, favoriteProvider);
router.get("/favoritestatus/:id", verifyToken, favoriteStatusProvider);
router.get("/favoritelist/:id", verifyToken, favoriteList);
router.get("/get/:id", getProvider);
router.get("/get", getProviders);
router.get("/getproviders", getAdminProviders);

export default router;
