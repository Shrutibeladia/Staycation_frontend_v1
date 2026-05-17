import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Notification from "../../components/notification/Notification";
import { AuthContext } from "../../context/AuthContext";
import { users } from "../../api/apiService";
import { getErrorMessage } from "../../api/errorUtils";
import "./profile.css";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    country: "",
    city: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await users.getProfile(user._id);
        setProfile((prev) => ({
          ...prev,
          username: res.data.username || user.username,
          email: res.data.email || "",
          country: res.data.country || "",
          city: res.data.city || "",
          phone: res.data.phone || "",
        }));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load profile."));
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    const payload = {
      email: profile.email,
      country: profile.country,
      city: profile.city,
      phone: profile.phone,
    };
    if (profile.password) {
      payload.password = profile.password;
    }

    try {
      const res = await users.updateProfile(user._id, payload);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      setMessage("Profile updated successfully.");
      setProfile((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update profile."));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete your account? This cannot be undone.");
    if (!confirmed) return;
    setError(null);
    try {
      await users.deleteProfile(user._id);
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete account."));
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <h1>My Profile</h1>
        <p>Update your account information and manage your personal details.</p>
        {loading ? (
          <div className="profile-loading">Loading profile...</div>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-row">
              <label htmlFor="username">Username</label>
              <input id="username" value={profile.username} disabled />
            </div>
            <div className="profile-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="profile-row">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                value={profile.country}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={profile.city}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={profile.password}
                onChange={handleChange}
              />
            </div>
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete account
              </button>
            </div>
            {error && <div className="profile-error">{error}</div>}
            {message && <div className="profile-success">{message}</div>}
          </form>
        )}
      </div>
      <Footer />
      <Notification type={error ? "error" : "success"} message={error || message} onClose={() => { setError(null); setMessage(null); }} />
    </div>
  );
};

export default Profile;
