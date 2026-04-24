import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faGlobe,
  faCity,
  faImage,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
    img: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "https://staycation-server-v1-1.onrender.com/api/auth/register",
        credentials
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/login");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="lContainer register-container">
          <div className="login-header">
            <h1>✈️ Join StayCation</h1>
            <p>Create your account to start booking amazing stays</p>
          </div>

          <form onSubmit={handleClick} className="login-form register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <FontAwesomeIcon icon={faUser} /> Username
                </label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  id="username"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  id="email"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FontAwesomeIcon icon={faLock} /> Password
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  id="password"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <FontAwesomeIcon icon={faPhone} /> Phone
                </label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  id="phone"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  <FontAwesomeIcon icon={faGlobe} /> Country
                </label>
                <input
                  type="text"
                  placeholder="Your country"
                  id="country"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  <FontAwesomeIcon icon={faCity} /> City
                </label>
                <input
                  type="text"
                  placeholder="Your city"
                  id="city"
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="img" className="form-label">
                <FontAwesomeIcon icon={faImage} /> Profile Picture URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg (optional)"
                id="img"
                onChange={handleChange}
                className="lInput"
              />
            </div>

            {error && <div className="error-message">{error.message}</div>}

            <button disabled={loading} type="submit" className="lButton">
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="register-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;





