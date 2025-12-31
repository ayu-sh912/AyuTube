const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadVideo,
  getAllVideos,
  getVideoById,
  likeVideo,
  dislikeVideo,
} = require("../controllers/videoController");


const router = express.Router();

// Upload video (protected)
router.post(
  "/upload",
  authMiddleware,
  upload.single("video"),
  uploadVideo
);

// Get all videos
router.get("/", getAllVideos);

// Get single video by id
router.get("/:id", getVideoById);

// Like video
router.put("/:id/like", authMiddleware, likeVideo);

// Dislike video
router.put("/:id/dislike", authMiddleware, dislikeVideo);


module.exports = router;
