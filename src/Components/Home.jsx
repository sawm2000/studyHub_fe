import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getAllVideos, getAllRooms, getVideo } from "../api";
import UserContext from "../Contexts/UserContext";
import "../CSS/Home.css";

function Home() {
  const [videos, setVideos] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const searchQuery = searchParams.get("query") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const orderBy = searchParams.get("orderBy") || "asc";
  const tags = searchParams.get("tags") || "";
  const isPrivate = searchParams.get("private") === "true";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const getVideosAndRooms = async () => {
      try {
        setIsLoading(true);
        setError("");

        const videoResponse = await getAllVideos(
          searchQuery,
          tags,
          sortBy,
          orderBy
        );
        setVideos(videoResponse);
        const roomResponse = await getAllRooms(
          searchQuery,
          isPrivate,
          sortBy,
          orderBy
        );
        setRooms(roomResponse);
      } catch (error) {
        setError(error.response.message);
      } finally {
        setIsLoading(false);
      }
    };
    getVideosAndRooms();
  }, [searchQuery, isPrivate, tags, sortBy, orderBy]);

  const handleSearch = (event) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      query: event.target.value,
    }));
  };

  
  return (
    <div className="home">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      {loggedInUser && (
        <div className="action-buttons">
          <Link to="/addVideo">
            <button className="add-video-btn">Add Video</button>
          </Link>
          <Link to="/createRoom">
            <button className="create-room-btn">Create Room</button>
          </Link>
        </div>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <div className="videos-section">
            <h2>Videos</h2>
            <div className="videos-list">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <div key={video._id} className="video-item">
                    <Link to={`/video/${video._id}`} className="video-title-link">
                  <h3>{video.title}</h3>
                </Link>
                    <video src={video.fileUrl} controls></video>
                  </div>
                ))
              ) : (
                <p className="text">No videos found</p>
              )}
            </div>
          </div>

          <div className="rooms-section">
            <h2>Rooms</h2>
            <div className="rooms-list">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div key={room._id} className="room-item">
                    <h3>{room.name}</h3>
                    <p>Owner: {room.owner}</p>
                  </div>
                ))
              ) : (
                <p className="text">No rooms found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Home;
