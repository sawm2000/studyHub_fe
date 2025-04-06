import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../Contexts/UserContext";
import { login } from "../api";
import "../CSS/Login.css";

function Login() {
  const navigate = useNavigate();
  const { setLoggedInUser } = useContext(UserContext);
  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [error, setError] = useState();
  const [response, setResponse] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(null);

  function handleUsername(event) {
    setUsernameLogin(event.target.value);
  }
  function handlePassword(event) {
    setPasswordLogin(event.target.value);
  }

  function userLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    const details = {
      username: usernameLogin,
      password: passwordLogin,
    };

    login(details)
      .then((response) => {
        const user = {
          _id: response._id,
          username: response.username,
          img: response.userImg,
          firstname: response.firstname,
          lastname: response.lastname,
          email: response.email
        };
        setLoggedInUser(user);
        setResponse(`You are now logged in as ${response.username}`);
        setSuccess(true);
        setIsLoading(false);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .then(() => {
        setUsernameLogin("");
        setPasswordLogin("");
        navigate("/");
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.response.data.message);
      });
  }
  return (
    <>
      <h1>studyHub</h1>
      <div className="form-wrapper signInFormwrapper">
        <h2 className="form-name">Login</h2>
        <form className="registration-form" onSubmit={userLogin}>
          <label htmlFor="username">Username</label>
          <input
            className="input-fields"
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleUsername}
            value={usernameLogin}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="input-fields"
            placeholder="Password"
            type="password"
            id="password"
            onChange={handlePassword}
            value={passwordLogin}
            required
          />
          {isLoading ? (
            <p className="loading">Loading...</p>
          ) : (
            <>
              {error ? (
                <p className="error">{error}</p>
              ) : (
                <p className="success">{response}</p>
              )}
            </>
          )}
          <button disabled={success} className="join-btn">
            Login
          </button>
          <Link className="sign-up-link" to="/register">
            Don't have an account? Sign Up!
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
