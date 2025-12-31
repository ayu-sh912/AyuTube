const User = require("../models/user");

// SUBSCRIBE / UNSUBSCRIBE
exports.toggleSubscribe = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const userId = req.userId;

    if (channelId === userId) {
      return res
        .status(400)
        .json({ message: "You cannot subscribe to yourself" });
    }

    const channel = await User.findById(channelId);
    const user = await User.findById(userId);

    if (!channel || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already subscribed
    const isSubscribed = user.subscribedChannels.includes(channelId);

    if (isSubscribed) {
      // Unsubscribe
      user.subscribedChannels = user.subscribedChannels.filter(
        (id) => id.toString() !== channelId
      );
      channel.subscribersCount -= 1;
    } else {
      // Subscribe
      user.subscribedChannels.push(channelId);
      channel.subscribersCount += 1;
    }

    await user.save();
    await channel.save();

    res.status(200).json({
      message: isSubscribed ? "Unsubscribed" : "Subscribed",
      subscribersCount: channel.subscribersCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CHANNEL INFO
exports.getChannelInfo = async (req, res) => {
  try {
    const channel = await User.findById(req.params.channelId).select(
      "username subscribersCount createdAt"
    );

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
