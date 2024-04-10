import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  star: Number,

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "provider",
  },
},{ timestamps: true });


const Rating = mongoose.model("Rating",ratingSchema);

export default Rating;
