const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { name, location, rating, comment, userId } = req.body;

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

    const review = await Review.create(reviewData);

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("user", "name username profileImage");

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviews,
};
