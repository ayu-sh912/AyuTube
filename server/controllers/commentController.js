const Comment = require("../models/Comment");

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      videoId,
      userId: req.userId,
      text,
    });

    res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS BY VIDEO
exports.getCommentsByVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const comments = await Comment.find({ videoId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
