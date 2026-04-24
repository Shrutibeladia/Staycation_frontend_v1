import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const navigateLogin = () => {
    navigate('/login');
  };
  
  const navigateRegister = () => {
    navigate('/register');
  };
  
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="nav-logo">✈️ StayCation</span>
        </Link>
        
        <div className="nav-items">
          {user ? (
            <div className="nav-user-section">
              <div className="nav-user-info">
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="nav-username">{user.username}</span>
              </div>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOut} />
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <button 
                className="btn btn-ghost" 
                onClick={navigateRegister}
              >
                Register
              </button>
              <button 
                className="btn btn-primary" 
                onClick={navigateLogin}
              >
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