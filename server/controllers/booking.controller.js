import Booking from "../models/booking.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Provider from "../models/provider.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const booking = async (req, res, next) => {
  const {
    patient,
    provider,
    scheduledTime: { date, slot },
  } = req.body;
  try {
    const patientExist = await User.findById(patient);
    const providerExist = await Provider.findById(provider);
    if (!patientExist || !providerExist) {
      return next(errorHandler(404, "Patient or provider not found"));
    }
    const newBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);

    const bookingSlot = `${date}-${slot}`;
    if (providerExist.bookedSlots.has(bookingSlot)) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    providerExist.bookedSlots.set(bookingSlot, "booked");
    await providerExist.save();
  } catch (error) {
    next(error);
  }
};

export const getBookingProvider = async (req, res, next) => {
  try {
    const bookingDetails = await Booking.aggregate([
      {
        $match: { provider: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientDetails",
        },
      },
      {
        $unwind: "$patientDetails",
      },
    ]);
    res.status(200).json(bookingDetails);
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
    if (!userBookings || userBookings.length === 0) {
      return next(errorHandler(404, "Booking not found"));
    }
    res.status(200).json(userBookings);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const approveBooking = async (req, res, next) => {
  const { id: bookingId } = req.params;

  try {
    const bookingApprove = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "approved" },
      { new: true }
    );
    if (!bookingApprove) {
      return next(errorHandler(404, "Booking not found"));
    }
    res.status(200).json(bookingApprove);
  } catch (error) {
    next(error);
  }
};

export const rejectBooking = async (req, res, next) => {
  const { id: bookingId } = req.params;

  try {
    const bookingReject = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "rejected" },
      { new: true }
    );
    if (!bookingReject) {
      return next(errorHandler(404, "Booking not found"));
    }
    res.status(200).json(bookingReject);
  } catch (error) {
    next(error);
  }
};

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "1step.co.in@gmail.com",
    pass: "bdis nazv oxwj oacg",
  },
});

export const bookingemail = async (req, res, next) => {
  const { email, subject, providerName, providerProfile, service, name, time } =
    req.body;

  try {
    let info = await transporter.sendMail({
      to: email,
      subject: subject,
      html: `
      <div style="font-family: Arial, sans-serif; padding:30px; background-color:#d4f9fa">
      <div>
      <a href="https://1step.co.in">
      <img src="https://i.ibb.co/XkLWHsZ/logo.png" alt="1step" />
      </a>
      </div>
      <p style="color: #333; font-size: 18px;">Hi, <span style="">${name}</span></p>
      <div style="text-align:center;">
      <img src="${providerProfile}" alt="Provider Profile Picture" width="100" height="100"style="border-radius:50%;"/>
      <h1 style="color: #333; font-size: 28px;">${providerName}</h1>
      <h1 style="color: #333; font-size: 18px; text-align:center;">APPOINTMENT APPROVED</h1>
      <p style="color: #333; font-size: 18px;">Service: ${service}</p>
      <p style="font-size: 18px;">Please arrive 10 minutes early to your appointment.</p>
      <p style="font-size: 18px;">Thank you for choosing our services.</p>
      </div>
      </div>
      `,
    });
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    next(error);
  }
};
