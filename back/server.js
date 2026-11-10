const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // أو '*' في التطوير بس مش production
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Skill Exchange API is running...");
});

const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");

app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/exchanges", exchangeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});