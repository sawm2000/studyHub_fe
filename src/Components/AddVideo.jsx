import { useState, useContext, useEffect } from "react";
import UserContext from "../Contexts/UserContext";
import { addVideo } from "../api";
import { createClient } from "@supabase/supabase-js";

function AddVideo() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(JSON.parse(storedUser));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    uploadVideo(selectedFile);
  };

  const uploadVideo = async (file) => {
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      setError(error.message);
      setUploading(false);
      return;
    }
   

    const videoUrl = supabase.storage
      .from("videos")
      .getPublicUrl(fileName).data.publicUrl;

    setFileUrl(videoUrl);
    setUploading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fileUrl) {
      setError("Video URL is required");
      return;
    }
    const tagsString = tags.join(", ");

    const videoData = {
      title,
      description,
      fileUrl,
      tags: tagsString,
      owner: loggedInUser._id,
    };

    try {
      setIsLoading(true);
      setError("");
      await addVideo(videoData, loggedInUser._id).then(() => {});
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="add-video">
      <h2>Add Video</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="video">Upload Video</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        {file && (
          <div>
            <button
              type="button"
              onClick={() => uploadVideo(file)}
              disabled={uploading}
            >
              {uploading ? `Uploading...` : "Upload Video"}
            </button>
          </div>
        )}

        <div>
          <label htmlFor="tags">Tags</label>
          <div className="tags-input">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Add Tag
            </button>
          </div>
          <div className="tags-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag-btn"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" disabled={isLoading || !fileUrl}>
            {isLoading ? "Adding..." : "Add Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddVideo;
