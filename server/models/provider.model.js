import mongoose from "mongoose";
const providerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    name: {
      type: Array,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      addressLine1: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    therapytype: {
      type: Array,
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
    },
    userRef: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: 0,
    },
    timeSlots: {
      Monday: {
        type: Array,
        default: [],
      },
      Tuesday: {
        type: Array,
        default: [],
      },
      Wednesday: {
        type: Array,
        default: [],
      },
      Thursday: {
        type: Array,
        default: [],
      },
      Friday: {
        type: Array,
        default: [],
      },
      Saturday: {
        type: Array,
        default: [],
      },
      Sunday: {
        type: Array,
        default: [],
      },
    },
  },
  { timestamps: true }
);

const provider = mongoose.model("provider", providerSchema);

export default provider;
