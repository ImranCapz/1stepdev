import Booking from "../models/booking.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Provider from "../models/provider.model.js";
import mongoose from "mongoose";

export const booking = async (req, res, next) => {
  const { patient, provider } = req.body;
  try {
    const patientExist = await User.findById(patient);
    const providerExist = await Provider.findById(provider);
    if (!patientExist || !providerExist) {
      return next(errorHandler(404, "Patient or provider not found"));
    }
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
};

export const getBookingProvider = async (req, res, next) => {
  try {
    const bookingDetails = await Booking.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetials",
        },
      },
      {
        $unwind: "$patientDetials",
      },
    ]);
    res.status(200).json(bookingDetails[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching booking details" });
  }
};

export const getUserBooking = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const userBookings = await Booking.aggregate([
      {
        $match: { patient: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "providers",
          localField: "provider",
          foreignField: "_id",
          as: "providerDetails",
        },
      },
      {
        $unwind: "$providerDetails",
      },
    ]);
    console.log(userBookings);
    if (!userBookings || userBookings.length === 0) {
      return next(errorHandler(404, "Booking not found"));
    }
    res.status(200).json(userBookings);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
