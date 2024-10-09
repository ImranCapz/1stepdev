import Provider from "../models/provider.model.js";
import { Booking } from "../models/booking.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import { BookedSlots } from "../models/booking.model.js";

export const createProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    return res.status(201).json(provider);
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);
  if (!provider) {
    return next(errorHandler(404, "Provider not found"));
  }
  if (req.user.id !== provider.userRef) {
    return next(errorHandler(401, "You can delete only your provider"));
  }

  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.status(200).json("Provider deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (req, res, next) => {
  const provider = await Provider.findById(req.params.id);
  if (!provider) {
    return next(errorHandler(404, "Provider not found"));
  }
  if (req.user.id !== provider.userRef) {
    return next(errorHandler(401, "You can update only your provider"));
  }
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProvider);
  } catch (error) {
    next(error);
  }
};

export const getProvider = async (req, res, next) => {
  try {
    const listing = await Provider.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Provider not found"));
    }
    const bookedSlotsProvider = await BookedSlots.find({
      provider: req.params.id,
    });
    if (!bookedSlotsProvider.length) {
      return res.status(200).json(listing);
    }

    const response = {
      ...listing.toObject(),
      bookedSlot: bookedSlotsProvider,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const fetchProvider = async (req, res, next) => {
  try {
    const fetchprovider = await Provider.findOne({ userRef: req.params.id });
    if (!fetchprovider) {
      return res
        .status(404)
        .json({ message: "Provider not found", status: false });
    } else {
      return res.status(200).json({ status: true, fetchprovider });
    }
  } catch (error) {
    next(error);
  }
};

export const getProviders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || "";

    const address = req.query.address || "";
    let city, pincode;
    if (isNaN(address)) {
      city = address;
    } else {
      pincode = address;
    }

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const providers = await Provider.find({
      $or: [
        {
          name: { $regex: searchTerm, $options: "i" },
        },
        {
          fullName: { $regex: searchTerm, $options: "i" },
        },
      ],
      $and: [
        {
          "address.city": city
            ? { $regex: city, $options: "i" }
            : { $exists: true },
        },
        { "address.pincode": pincode ? pincode : { $exists: true } },
      ],
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    const totalCount = await Provider.countDocuments({
      $or: [
        {
          name: { $regex: searchTerm, $options: "i" },
        },
        {
          fullName: { $regex: searchTerm, $options: "i" },
        },
      ],
      $and: [
        {
          "address.city": city
            ? { $regex: city, $options: "i" }
            : { $exists: true },
        },
        { "address.pincode": pincode ? pincode : { $exists: true } },
      ],
    });

    const providersWithBooking = await Promise.all(
      providers.map(async (provider) => {
        const last48hrs = new Date(Date.now() - 48 * 60 * 60 * 1000);

        const bookings = await Booking.find({
          provider: provider._id,
          createdAt: { $gte: last48hrs },
        }).sort({ createdAt: -1 });

        return {
          ...provider.toObject(),
          totalBookings: bookings.length || null,
        };
      })
    );

    return res
      .status(200)
      .json({ providers: providersWithBooking, totalCount });
  } catch (error) {
    next(error);
  }
};

export const getAdminProviders = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const providers = await Provider.find(
      ...(req.query.userId && { userRef: req.query.userId })
    );
  } catch (error) {
    next(error);
  }
};

let otpStorage = {};

const otpverifyProvider = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "1step.co.in@gmail.com",
        pass: "bdis nazv oxwj oacg",
      },
    });
    await transporter.sendMail({
      from: "1step.co.in@gmail.com",
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
};

export const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    const validemail = await Provider.findOne({ email });
    if (!validemail) {
      return next(errorHandler(404, "Email not found"));
    }
    const generateOtp = Math.floor(Math.random() * 900000) + 100000;

    otpStorage[email] = generateOtp;
    const html = `<b>Your 1Step Verified Provider Otp : <i>${generateOtp}</i></b>`;
    const subject = "Provider OTP Verification";

    const emailSend = await otpverifyProvider(email, subject, html);

    if (emailSend) {
      return res.status(200).json("OTP sent successfully");
    } else {
      return res.status(500).json("Error, cant send email!");
    }
  } catch (error) {
    return res.status(500).json("Error, cant send email!");
  }
};

export const verifyOtpProvider = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = otpStorage[email];
    if (!storedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (storedOtp.toString() === otp) {
      const result = await Provider.updateOne(
        {
          email: email,
        },
        {
          $set: {
            verified: true,
            status: 1,
          },
        }
      );
      delete otpStorage[email];
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    next(error);
  }
};

export const modifiedTimeslot = async (req, res, next) => {
  const id = req.params.id;
  const timeSlots = req.body.timeSlots;
  try {
    const provider = await Provider.findById(id);
    if (!provider) {
      return next(errorHandler(404, "Provider not found"));
    }

    const mergedTimeSlots = {
      ...provider.timeSlots,
      ...timeSlots,
    };

    const updateProvider = await Provider.findByIdAndUpdate(
      id,
      {
        $set: {
          timeSlots: mergedTimeSlots,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: true,
      message: "TimeSlots updated successfully ",
      provider: updateProvider,
    });
  } catch (error) {
    next(error);
  }
};
