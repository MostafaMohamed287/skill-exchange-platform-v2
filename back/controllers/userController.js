const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// يشيل الباسورد من أي user قبل ما نرجعه
const toSafeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const PUBLIC_FIELDS = "_id name bio location profileImage";

const createUser = async (req, res) => {
  try {
    // بناخد الحقول المسموحة بس (مفيش role من الـ body، فمحدش يقدر يسجل Admin)
    const { name, email, password, bio, location, profileImage } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      bio,
      location,
      profileImage,
    });

    res.status(201).json(toSafeUser(user));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // بحث بدون حساسية لحروف الكابيتال والصغيرة
    const user = await User.findOne({ email: email.trim() }).collation({
      locale: "en",
      strength: 2,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let isMatch = false;

    if (user.password.startsWith("$2")) {
      // باسورد متشفر عادي
      isMatch = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      // باسورد قديم متخزن كنص عادي: نقبله ونحوله لهاش
      isMatch = true;
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// قايمة المستخدمين (للـ dropdowns): بيانات عامة بس من غير إيميل أو باسورد
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(PUBLIC_FIELDS);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const isSelfOrAdmin =
      req.user.id === req.params.id || req.user.role === "Admin";

    const user = await User.findById(req.params.id).select(
      isSelfOrAdmin ? "-password" : PUBLIC_FIELDS
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  loginUser,
};