import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { approveBooking, booking, bookingemail, getBookingProvider, getUserBooking, rejectBooking } from "../controllers/booking.controller.js";


const router = express.Router();

router.post("/bookings",verifyToken, booking);
router.post("/approve/:id",verifyToken,approveBooking)
router.post("/reject/:id",verifyToken,rejectBooking)
router.post("/emailbookingAccept",verifyToken,bookingemail)
router.get("/getbookings/:id",verifyToken, getBookingProvider)
router.get("/getuserbookings/:id",verifyToken,getUserBooking)




export default router;