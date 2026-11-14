const express = require("express");

const router = express.Router();

const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/exchangeRequestController");
const { auth } = require("../middleware/authMiddleware");

// كل راوتات الـ exchange لازم تسجيل دخول
router.use(auth);

router.get("/", getAllRequests);

router.get("/:id", getRequestById);

router.post("/", createRequest);

router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest);

module.exports = router;
