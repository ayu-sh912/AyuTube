const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addComment,
  getCommentsByVideo,
} = require("../controllers/commentController");

const router = express.Router();

// Add comment (protected)
router.post("/:videoId", authMiddleware, addComment);

// Get comments for a video
router.get("/:videoId", getCommentsByVideo);

module.exports = router;
