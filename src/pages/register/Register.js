import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faGlobe,
  faCity,
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
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { loading, error, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(credentials);
    if (result.success) {
      navigate("/login");
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    }
  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="lContainer register-container">
          <div className="login-header">
            <h1>Join StayCation</h1>
            <p>Create your account to start booking amazing stays</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <FontAwesomeIcon icon={faUser} /> Username
                </label>
                <input
                  type="text"
                  placeholder="Choose a username"
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
                <label htmlFor="email" className="form-label">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  id="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="lInput"
                  required
                />
                {fieldErrors.email && (
                  <span className="field-error">{fieldErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FontAwesomeIcon icon={faLock} /> Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  id="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="lInput"
                  required
                  minLength={8}
                />
                {fieldErrors.password && (
                  <span className="field-error">{fieldErrors.password}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <FontAwesomeIcon icon={faPhone} /> Phone
                </label>
                <input
                  type="text"
                  placeholder="Your phone number"
                  id="phone"
                  value={credentials.phone}
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
                  value={credentials.country}
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
                  value={credentials.city}
                  onChange={handleChange}
                  className="lInput"
                  required
                />
              </div>
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
