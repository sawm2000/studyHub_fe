import { useContext, useEffect, useState } from "react";
import UserContext from "../Contexts/UserContext";
import { getUser, updateUser, deleteUser } from "../api";
import { useNavigate } from "react-router-dom";
import "../CSS/Profile.css";

function Profile() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [changedDetails, setChangedDetails] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);
  const [password, setPassword] = useState();
  const [firstname, setFirstname] = useState(loggedInUser.firstname);
  const [lastname, setLastname] = useState(loggedInUser.lastname);
  const [username, setUsername] = useState(loggedInUser.username);
  const [email, setEmail] = useState(loggedInUser.email);
  const [image, setImage] = useState(loggedInUser.img);
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setLoggedInUser(JSON.parse(storedUser));
  }, []);

  function handleChange(event) {
    setPassword(event.target.value);
  }

  function handelFirstname(event) {
    setFirstname(event.target.value);
  }
  function handelLastname(event) {
    setLastname(event.target.value);
  }

  function handelUsername(event) {
    setUsername(event.target.value);
  }
  function handelEmail(event) {
    setEmail(event.target.value);
  }

  function handelImage(event) {
    setImage(event.target.value);
  }

  function handelSubmit(event) {
    event.preventDefault();
    setError();
    setChangedDetails(false);
    const changes = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      img: image,
    };
    if (loggedInUser.username !== username) {
      changes.username = username;
    }

    updateUser(loggedInUser._id, changes)
      .then(() => {
        getUser(loggedInUser._id).then((response) => {
          const user = {
            _id: response._id,
            firstname: firstname,
            lastname: lastname,
            username: response.username,
            email: response.email,
            img: response.img,
          };
          setLoggedInUser(user);
          setChangedDetails(true);
        });
      })
      .catch((error) => {
        setError(error.response.data.message);
        setChangedDetails(false);
      });
  }

  function handelPassword(event) {
    event.preventDefault();
    setChangedPassword(false);
    const passwordData = { password: password };
    updateUser(loggedInUser._id, passwordData).then(() => {
      setChangedPassword(true);
    });
  }

  function handleDelete() {
    deleteUser(loggedInUser._id)
      .then(() => {
        handleLogout();
        navigate("/");
      })
      .catch((error) => {
        setError("Error deleting account: " + error.response.data.message);
      });
  }

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <div className="profile-form-wrapper">
        <h2> My Profile</h2>
        <img className="current-image" src={image} alt="profile avatar" />
        <form className="profile-form" onSubmit={handelSubmit}>
          <div className="label-input-wrapper">
            <label htmlFor="firstname">Your First name:</label>
            <input
              className="input-fields"
              id="firstname"
              value={firstname}
              onChange={handelFirstname}
            />
          </div>
          <div className="label-input-wrapper">
            <label htmlFor="lastname">Your Last name:</label>
            <input
              className="input-fields"
              id="lastname"
              value={lastname}
              onChange={handelLastname}
            />
          </div>
          <div className="label-input-wrapper">
            <label htmlFor="username">Your Username:</label>
            <input
              className="input-fields"
              id="username"
              value={username}
              onChange={handelUsername}
            />
          </div>
          <div className="label-input-wrapper">
            <label htmlFor="email">Your Email:</label>
            <input
              className="input-fields"
              id="email"
              value={email}
              onChange={handelEmail}
            />
          </div>
          <div className="label-input-wrapper">
            <label htmlFor="image">Your Image URL:</label>
            <input
              className="input-fields"
              id="image"
              value={image}
              onChange={handelImage}
            />
          </div>
          {error ? <p>{error}</p> : null}
          {changedDetails ? <p>Your details have been changed</p> : null}
          <button className="profile-btn">Make changes</button>
        </form>
        <div className="label-Input-wrapper">
          <label htmlFor="password">New Password</label>
          <input
            className="input-fields"
            id="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {changedPassword ? <p>Your password has been changed</p> : null}
        <button className="profile-btn" onClick={handelPassword}>
          Change password
        </button>
      </div>
      <button className="profile-btn delete-btn" onClick={handleDelete}>
        Delete Account
      </button>
    </>
  );
}

export default Profile;
