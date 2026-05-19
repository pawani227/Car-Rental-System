const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { name, location, rating, comment, userId, vehicleId } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reviewData = {
      name: name.trim(),
      location: location ? location.trim() : null,
      rating: Number(rating),
      comment: comment.trim(),
    };

    if (userId) reviewData.user = userId;
    if (vehicleId) reviewData.vehicle = vehicleId;

    const review = await Review.create(reviewData);

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    const query = {};
    if (vehicleId) query.vehicle = vehicleId;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name username profileImage")
      .populate("vehicle", "name");

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
};
