import Provider from "../models/provider.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";

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
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getProviders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === "undefined" || offer === "false") {
      offer = { $in: [false, true] };
    }

    const searchTerm = req.query.searchTerm || "";
    const address = req.query.address || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const providers = await Provider.find({
      name: { $regex: searchTerm, $options: "i" },
      address: { $regex: address, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(providers);
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
    const generateOtp = Math.floor(Math.random() * 1000000);

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
  const { email, otp } = req.body;
  const storedOtp = otpStorage[email];
  if (!storedOtp) {
    return next(errorHandler(404, "Otp not found"));
  }
  const otpNumber = Number(otp.join(''));
  if (storedOtp !== otpNumber) {
    return next(errorHandler(401, "Invalid Otp"));
  }
  if (storedOtp === otpNumber) {
    try {
      const result = await Provider.updateOne(
        {
          email: email,
        },
        {
          $set: {
            verified: true,
          },
        }
      );
      if(result){
        return res.status(200).json({success:true, message:"Provider verified successfully"});
      }else{
        return res.status(500).json({success:false, message:"Error, cant verify provider"});
      } 
    } catch (error) {
      next(error);
    }
  }
};
