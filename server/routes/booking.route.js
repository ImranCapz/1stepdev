import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { booking, getBookingProvider, getUserBooking } from "../controllers/booking.controller.js";


const router = express.Router();

router.post("/bookings",verifyToken, booking);
router.get("/getbookings/:id",verifyToken, getBookingProvider)
router.get("/getuserbookings/:id",verifyToken,getUserBooking)



export default router;