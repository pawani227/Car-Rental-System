const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicles",
      required: false,
    },
    name: { type: String, required: true },
    location: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
