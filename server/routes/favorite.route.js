import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { favoriteList, favoriteProvider, favoriteStatusProvider } from '../controllers/favorite.controller.js';

const router = express.Router();

router.post("/favorites/:id", verifyToken, favoriteProvider);
router.get("/favoritestatus/:id", verifyToken, favoriteStatusProvider);
router.get("/favoritelist/:id", verifyToken, favoriteList);


export default router;