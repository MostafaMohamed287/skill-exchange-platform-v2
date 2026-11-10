const express = require("express");

const router = express.Router();

const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/exchangeRequestController");


router.get("/", getAllRequests);

router.get("/:id", getRequestById);

router.post("/", createRequest);

router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest);

module.exports = router;