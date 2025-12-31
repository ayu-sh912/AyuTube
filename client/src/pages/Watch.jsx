import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const Watch = () => {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [subscribers, setSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch video + channel info
  const fetchVideo = async () => {
    const res = await API.get(`/videos/${id}`);
    setVideo(res.data);

    // fetch uploader(channel) info
    const channelRes = await API.get(
      `/channels/${res.data.uploader._id}`
    );
    setSubscribers(channelRes.data.subscribersCount);
  };

  // Fetch comments
  const fetchComments = async () => {
    const res = await API.get(`/comments/${id}`);
    setComments(res.data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchVideo();
      await fetchComments();
      setLoading(false);
    };
    load();
    // eslint-disable-next-line
  }, [id]);

  // 👍 Like
  const handleLike = async () => {
    await API.put(`/videos/${id}/like`);
    fetchVideo();
  };

  // 👎 Dislike
  const handleDislike = async () => {
    await API.put(`/videos/${id}/dislike`);
    fetchVideo();
  };

  // 🔔 Subscribe
  const handleSubscribe = async () => {
    const res = await API.put(
      `/channels/subscribe/${video.uploader._id}`
    );
    setSubscribers(res.data.subscribersCount);
  };

  // 💬 Add comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await API.post(`/comments/${id}`, { text: commentText });
    setCommentText("");
    fetchComments();
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="watch">
      {/* 🎬 Video Player */}
      <video
        src={video.videoUrl}
        controls
        width="900"
        style={{ maxWidth: "100%" }}
      />

      {/* ℹ️ Video Info */}
      <h2>{video.title}</h2>
      <p>
        {video.views} views • Uploaded by{" "}
        <b>{video.uploader.username}</b>
      </p>

      {/* 🔔 Subscribe */}
      <button onClick={handleSubscribe}>
        Subscribe ({subscribers})
      </button>

      {/* 👍👎 Like / Dislike */}
      <div className="actions">
        <button onClick={handleLike}>
          👍 Like ({video.likes.length})
        </button>
        <button onClick={handleDislike}>
          👎 Dislike ({video.dislikes.length})
        </button>
      </div>

      {/* 📝 Description */}
      {video.description && <p>{video.description}</p>}

      <hr />

      {/* 💬 Comments */}
      <h3>Comments ({comments.length})</h3>

      <form onSubmit={handleComment}>
        <input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {/* Comment List */}
      <div style={{ marginTop: 20 }}>
        {comments.length === 0 && <p>No comments yet</p>}

        {comments.map((c) => (
          <div key={c._id} style={{ marginBottom: 10 }}>
            <b>{c.userId.username}</b>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watch;
