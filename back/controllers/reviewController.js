const mongoose = require("mongoose");
const Review = require("../models/Review");
const Skill = require("../models/Skill");

const populateReview = (query) =>
  query
    .populate("reviewer", "name")
    .populate("reviewee", "name")
    .populate("skill", "title");

const isReviewerOrAdmin = (review, user) =>
  user.role === "Admin" || review.reviewer.toString() === user.id;

const handleError = (res, err) => {
  const status = err.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: err.message });
};

// Create (الـ reviewer هو المستخدم المسجل)
exports.createReview = async (req, res) => {
  try {
    const { reviewee, skill, rating, comment } = req.body;
    const reviewer = req.user.id;

    if (!reviewee || !skill) {
      return res
        .status(400)
        .json({ message: "Reviewee and skill are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewee) || !mongoose.Types.ObjectId.isValid(skill)) {
      return res.status(400).json({ message: "Invalid reviewee or skill ID" });
    }

    if (reviewee === reviewer) {
      return res.status(400).json({ message: "You can't review yourself" });
    }

    const skillDoc = await Skill.findById(skill);

    if (!skillDoc) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skillDoc.owner.toString() !== reviewee) {
      return res
        .status(400)
        .json({ message: "This skill doesn't belong to the reviewed user" });
    }

    const review = await Review.create({
      reviewer,
      reviewee,
      skill,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Get All Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find().sort({ createdAt: -1 })
    );

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Review By ID
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Review ID" });
    }

    const review = await populateReview(Review.findById(id));

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update (صاحب الريفيو بس)
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Review ID" });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!isReviewerOrAdmin(review, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own reviews" });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Delete (صاحب الريفيو بس)
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Review ID" });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!isReviewerOrAdmin(review, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
