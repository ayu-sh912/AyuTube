const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import routes & middleware
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const channelRoutes = require("./routes/channelRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// ================== GLOBAL MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// ================== ROUTES ==================

// Health check
app.get("/", (req, res) => {
  res.send("AyuTube Backend is Running 🚀");
});

// Auth routes (signup & login)
app.use("/api/auth", authRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected access granted",
    userId: req.userId,
  });
});

// Video routes (upload, list, watch, like, dislike)
app.use("/api/videos", videoRoutes);

// Comment routes
app.use("/api/comments", commentRoutes);

// Channel / Subscribe routes
app.use("/api/channels", channelRoutes);

// ================== DATABASE & SERVER ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
