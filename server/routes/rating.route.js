import express from 'express';
import { getRatings, reviewProvider } from '../controllers/rating.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();



router.put("/review", verifyToken, reviewProvider);
router.get("/getreview/:providerId", getRatings);


export default router;