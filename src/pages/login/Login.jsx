import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    if (result.success) {
      navigate("/");
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    }
  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="lContainer">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your StayCation account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <FontAwesomeIcon icon={faEnvelope} /> Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                id="username"
                value={credentials.username}
                onChange={handleChange}
                className="lInput"
                required
              />
              {fieldErrors.username && (
                <span className="field-error">{fieldErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FontAwesomeIcon icon={faLock} /> Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                className="lInput"
                required
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
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
              Don&apos;t have an account?{" "}
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
