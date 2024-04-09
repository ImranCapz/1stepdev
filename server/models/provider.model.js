import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    therapytype: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "./src/assets/defaultprofile.jpg",
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    ratings: [
      {
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        star: Number,
      },
    ],
    totalrating: {
      type: Number,
      default: 0,
    },
    numberofratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const provider = mongoose.model("provider", providerSchema);

export default provider;
