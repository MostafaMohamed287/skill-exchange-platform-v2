const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { auth } = require("../middleware/authMiddleware");

// القراءة متاحة للكل
router.get("/", reviewController.getReviews);

router.get("/:id", reviewController.getReviewById);

// الإضافة والتعديل والمسح لازم تسجيل دخول
router.post("/", auth, reviewController.createReview);

router.put("/:id", auth, reviewController.updateReview);

router.delete("/:id", auth, reviewController.deleteReview);

module.exports = router;
