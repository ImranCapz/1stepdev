import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: Array,
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
    fullName: {
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
    availability:{
      morningStart: {
        type: String,
        required: true,
      },
      morningEnd: {
        type: String,
        required: true,
      },
      eveningStart: {
        type: String,
        required: true,
      },
      eveningEnd: {
        type: String,
        required: true,
      },
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
  },
  { timestamps: true }
);

const provider = mongoose.model("provider", providerSchema);

export default provider;
