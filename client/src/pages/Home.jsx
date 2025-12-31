import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading videos...</p>;
  }

  return (
    <div className="home">
      <h2>Trending Videos</h2>

      {videos.length === 0 && <p>No videos uploaded yet</p>}

      <div className="video-grid">
        {videos.map((video) => (
          <div className="video-card" key={video._id}>
            {/* Thumbnail placeholder */}
            <div
              style={{
                background: "#ddd",
                height: 140,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />

            <h3>{video.title}</h3>
            <p style={{ fontSize: 13, color: "#555" }}>
              {video.uploader?.username}
            </p>
            <p style={{ fontSize: 12, color: "#777" }}>
              {video.views} views
            </p>

            <Link to={`/watch/${video._id}`}>Watch</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
