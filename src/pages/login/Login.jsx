import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
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
        "https://staycation-server-v1-1.onrender.com/api/auth/login",
        credentials
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="lContainer">
          <div className="login-header">
            <h1>✈️ Welcome Back</h1>
            <p>Sign in to your StayCation account</p>
          </div>

          <form onSubmit={handleClick} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <FontAwesomeIcon icon={faEnvelope} /> Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                id="username"
                onChange={handleChange}
                className="lInput"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon={faLock} /> Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                onChange={handleChange}
                className="lInput"
                required
              />
            </div>

            {error && <div className="error-message">{error.message}</div>}

            <button disabled={loading} type="submit" className="lButton">
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;





