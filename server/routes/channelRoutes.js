const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  toggleSubscribe,
  getChannelInfo,
} = require("../controllers/channelController");

const router = express.Router();

// Subscribe / Unsubscribe (protected)
router.put("/subscribe/:channelId", authMiddleware, toggleSubscribe);

// Get channel info
router.get("/:channelId", getChannelInfo);

module.exports = router;
