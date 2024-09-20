import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "provider",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    scheduledTime: {
      slot: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
    note: {
      type: String,
      required: true,
    },
    service: {
      type: Array,
      required: true,
    },
    sessionType: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
