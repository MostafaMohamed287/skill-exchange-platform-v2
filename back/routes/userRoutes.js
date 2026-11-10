const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  loginUser
} = require("../controllers/userController");
const { auth, authorize } = require("../middleware/authMiddleware");


router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, deleteUser);
router.post("/login", loginUser);

module.exports = router;