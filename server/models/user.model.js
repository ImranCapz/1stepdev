import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    favorites:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "provider",
    }],
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "./src/assets/defaultprofile.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isParent: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    weight: {
      type: String,
      default: "",
    },
    bloodGroup: {
      type: String,
      default: "",
    },
    medicalHistory: {
      type: String,
      default: "",
    },
    allergies: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    insurance: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
