const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  loginUser
} = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, deleteUser);

module.exports = router;
