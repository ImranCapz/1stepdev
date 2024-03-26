import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";



export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id, isAdmin : newUser.isAdmin }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};   

// PASSWORD RESET

let otpStorage = {}; // Temporary storage for generated OTPs
let hashedPasswords = {};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '1step.co.in@gmail.com',
        pass: 'bdis nazv oxwj oacg',
      },
    });

    await transporter.sendMail({
      from: '1step.co.in@gmail.com',
      to,
      subject,
      html,
    });

    return true; // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Email sending failed
  }
};



export const resetPassword = async (req, res,next) => {
  const { email } = req.body;

  try {

    const validUser = await User.findOne({ email });
    if (!validUser) {
      
      return next(errorHandler(404, 'User not found'));
    }
    const generateOtp = Math.floor(Math.random() * 1000000);

    otpStorage[email] = generateOtp;

    // Send the OTP to the user's email
    const html = `<b>Your 1Step Reset Password Otp is : <i>${generateOtp}</i></b>`;
    const subject = "New OTP Generated";

    const emailSent = await sendEmail(email, subject, html);

    if (emailSent) {
      return res.json({ status: true, message: "Email sent, check your inbox.", otp: generateOtp });
    } else {
      return res.status(500).json({ message: "Error, can't send email!" });
    }
  } catch (err) {
    next(err);
  }
};

export const verifyOtpPassword = async (req, res) => {
  try {
    const { email, userEnteredOtp, newPassword } = req.body;

    const storedOtp = otpStorage[email];

    if (!storedOtp) {
      return res.status(400).json({ message: "Recheck email and OTP" });
    }

    if (userEnteredOtp === storedOtp.toString()) {
      
      const hashedPassword = await updatePassword(email, newPassword);

      delete otpStorage[email];

      return res.status(200).json({ status:true ,message: "Password updated Successfully" });
    } else {
      return res.status(400).json({ status:false ,message: "Incorrect OTP Check your OTP Again" });
    }
  } catch (error) {
    console.error('Error in verifyOtpAndUpdatePassword:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updatePassword = async (email, newPassword) => {
  try {
    
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    
    await updatePasswordInDatabase(email, hashedPassword);

    return; // Don't return the hashed password
  } catch (error) {
    console.error('Error in updatePassword:', error);
    throw error; 
  }
};


async function updatePasswordInDatabase(email, hashedPassword) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Handle the case where the user is not found
      throw new Error('User not found.');
    }

    // Update the password field in the user document
    user.password = hashedPassword;

    // Save the updated user document
    await user.save();

    // Optionally, you can return the updated user document or any other response
    return 
  } catch (error) {
    console.error('Error in Password Updating', error);
    throw error;
  }
}