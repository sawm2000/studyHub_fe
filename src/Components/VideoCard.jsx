import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import UserContext from "../Contexts/UserContext";
import { getVideo, deleteVideo, likeVideo, unlikeVideo } from "../api";

function VideoCard() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState();
  const [video, setVideo] = useState({});
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    getVideo(id).then((response) => {
      setVideo(response);
      if (response.likes.some((like) => like.user === loggedInUser._id)) {
        setLiked(true);
      }
    });
  }, [id, loggedInUser, liked]);

  function handleLike() {
    likeVideo({ vid: id }, loggedInUser._id)
      .then(() => {
        setLiked(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleUnlike() {
    
    unlikeVideo({ vid: id }, loggedInUser._id)
      .then(() => {
        setLiked(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleDelete() {
    deleteVideo({ vid: id }, loggedInUser._id)
      .then(() => {
        setIsDeleted(true);
        navigate("/");
      })
      .catch((error) => {
        setError("Couldn't delete video");
      });
  }

  return (
    <>
      <div className="video-wrapper">
        <p className="video-titles">{video.title}</p>

        <video height="150px" src={video.fileUrl} controls on></video>

        {loggedInUser ? (
          <button
            onClick={liked ? handleUnlike : handleLike}
            disabled={isDeleted}
            className={`like-button ${liked ? "liked" : ""}`}
          >
            ❤️ {liked ? "Unlike" : "Like"}
          </button>
        ) : null}
        {error && <p className="error">{error}</p>}

        <p>{isDeleted ? "Video has been deleted" : null}</p>

        {video.owner === loggedInUser._id ? (
          <button
            id="delete-button"
            disabled={isDeleted}
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        ) : null}
        {error ? error : <p>{isDeleted ? "Video has been deleted" : null}</p>}
      </div>
    </>
  );
}

export default VideoCard;
