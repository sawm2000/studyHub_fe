import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import UserContext from "../Contexts/UserContext";
import {
  getVideo,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  getComments,
  addComment,
  deleteComment,
} from "../api";
import "../CSS/VideoCard.css";

function VideoCard() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState({});
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    getVideo(id).then((response) => {
      setVideo(response);
      if (response.likes.some((like) => like.user === loggedInUser._id)) {
        setLiked(true);
      }
    });
    getComments(id).then((response) => {
      setComments(response.comments);
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await addComment(
        { vid: id, text: newComment },
        loggedInUser._id
      );

      setComments((prevComments) => [...prevComments, response.comment]);
      getComments(id).then((response) => {
        setComments(response.comments);
      });

      setNewComment("");
    } catch (error) {
      setError("Couldn't post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(
        { vid: id, commentId },
        loggedInUser._id
      );
      if (response.message === "Comment deleted successfully") {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      }
    } catch (error) {
      setError("Couldn't delete comment");
    }
  };

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
            {liked ? "❤️" : "🤍"}
          </button>
        ) : null}
        {error && <p className="error">{error}</p>}

        <div className="comments-section">
          <h3>Comments</h3>

          {comments.length > 0 ? (
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <div className="comment-avatar">
                    {comment.username.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-username">
                        {comment.username}
                      </span>
                    </div>

                    <div className="comment-text">{comment.text}</div> </div>

                    {loggedInUser && loggedInUser._id === comment.user && (
                      <div className="comment-actions">
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          🗑️
                        </button>{" "}
                      </div>
                    )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}

          {loggedInUser && (
            <form onSubmit={(e) => handleAddComment(e)}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit">Post</button>
            </form>
          )}
        </div>
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
        <p>{isDeleted ? "Video has been deleted" : null}</p>
      </div>
    </>
  );
}

export default VideoCard;
