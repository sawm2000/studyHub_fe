import { Link } from "react-router-dom";
import { signup } from "../api";
import { useState } from "react";
import "../CSS/Signup.css";

function Register() {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  function handleFirstname(event) {
    setFirstname(event.target.value);
  }
  function handleLastname(event) {
    setLastname(event.target.value);
  }
  function handleUsername(event) {
    setUsername(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }
  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleImg(event) {
    setImgUrl(event.target.value);
  }

  function postUser(event) {
    event.preventDefault();
    setIsLoading(true);
    setResponse("");
    setError();
    const details = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
    };
    if (imgUrl !== "") {
      details.img = imgUrl;
    }

    signup(details)
      .then((response) => {
        setResponse(response);
      })
      .then(() => {
        setSuccess(true);
        setIsLoading(false);
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setImgUrl("");
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.response.data.message);
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");
        setImgUrl("");
      });
  }

  return (
    <>
      <h1>studyHub</h1>
      <div className="form-wrapper">
        <h2 className="form-name">Sign Up</h2>
        <form className="registration-form" onSubmit={postUser}>
        <label htmlFor="fistname">First name</label>
          <input
            className="input-fields"
            type="text"
            placeholder="First name"
            id="Fistname"
            onChange={handleFirstname}
            value={firstname}
            required
          />
          <label htmlFor="lastname">Last name</label>
          <input
            className="input-fields"
            type="text"
            placeholder="Last name"
            id="Lastname"
            onChange={handleLastname}
            value={lastname}
            required
          />

          <label htmlFor="username">Username</label>
          <input
            className="input-fields"
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleUsername}
            value={username}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            className="input-fields"
            placeholder="Email"
            type="email"
            id="email"
            onChange={handleEmail}
            value={email}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="input-fields"
            placeholder="Password"
            type="password"
            id="password"
            onChange={handlePassword}
            value={password}
            required
          />
          <label htmlFor="profile-img”">Profile Img</label>
          <input
            className="input-fields"
            type="text"
            id="img"
            onChange={handleImg}
            value={imgUrl}
            placeholder="Profile Image URL"
          />
          {isLoading ? (
            <p className="loading">Loading ...</p>
          ) : (
            <>
              {error ? (
                <p className="error">{error}</p>
              ) : (
                <p className="success">{response}</p>
              )}
              {success ? (
                <p className="success">
                  <Link className="sign-in-link" to="/login">
                    {" "}
                    Please sign in!
                  </Link>
                </p>
              ) : null}
            </>
          )}
          <button disabled={success} className="join-btn">
            JOIN
          </button>
          <p id="account-text">Already have an account?</p>
          <Link className="sign-in-link" to="/login">
            Sign in!
          </Link>
        </form>
      </div>
    </>
  );
}

export default Register;
