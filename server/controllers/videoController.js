const Video = require("../models/Video");
const cloudinary = require("../config/cloudinary");

// UPLOAD VIDEO
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // upload video to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    const video = await Video.create({
      title,
      description,
      videoUrl: result.secure_url,
      uploader: req.userId,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VIDEOS
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploader", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET SINGLE VIDEO
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // increase views
    video.views += 1;
    await video.save();

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE VIDEO
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.userId;

    // remove dislike if exists
    video.dislikes = video.dislikes.filter(
      (id) => id.toString() !== userId
    );

    // toggle like
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      video.likes.push(userId);
    }

    await video.save();

    res.status(200).json({
      message: "Like updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DISLIKE VIDEO
exports.dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userId = req.userId;

    // remove like if exists
    video.likes = video.likes.filter(
      (id) => id.toString() !== userId
    );

    // toggle dislike
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      video.dislikes.push(userId);
    }

    await video.save();

    res.status(200).json({
      message: "Dislike updated",
      likes: video.likes.length,
      dislikes: video.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


