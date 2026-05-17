import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser, faCalendar, faCog } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="nav-logo">StayCation</span>
        </Link>

        <div className="nav-items">
          {user ? (
            <div className="nav-user-section">
              <Link to="/bookings" className="nav-link">
                <FontAwesomeIcon icon={faCalendar} /> Bookings
              </Link>
              <Link to="/profile" className="nav-link">
                <FontAwesomeIcon icon={faUser} /> {user.username}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  <FontAwesomeIcon icon={faCog} /> Admin
                </Link>
              )}
              <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOut} />
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <button className="btn btn-ghost" onClick={() => navigate("/register")}>
                Register
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
