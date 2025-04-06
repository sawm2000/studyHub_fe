import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../Contexts/UserContext";
import "../CSS/Header.css";

function Header() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="header">
      <Link to="/" className="header-link">
        <img src="logo.png" alt="studyHub Logo" className="header-logo" />
      </Link>

      <div className="header-right">
        {!loggedInUser ? (
          <>
            <Link to="/login">
              <button className="header-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="header-button">Sign Up</button>
            </Link>
          </>
        ) : (
          <div className="profile-container">
            <Link to="/profile" className="profile">
              {loggedInUser.img ? (
                <img
                  src={loggedInUser.img}
                  alt={`${loggedInUser.username}'s profile`}
                  className="profile-image"
                />
              ) : (
                <span className="default-avatar">👤</span>
              )}
            </Link>
            <Link to="/" onClick={handleLogout} className="logout-link">
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
