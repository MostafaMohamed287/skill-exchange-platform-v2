
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://skill-exchange-platform-v2.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Skill Exchange API is running...");
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/skills", require("./routes/skillRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/exchanges", require("./routes/exchangeRoutes"));

module.exports = app;
