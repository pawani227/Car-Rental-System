import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import "./Profile.css";

const defaultProfile = {
  username: "",
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  nicNumber: "",
  profileImage: "",
};

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultProfile);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUserId(parsedUser.id);
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/users/${userId}`);
        setFormData({
          username: response.data.username || "",
          name: response.data.name || "",
          email: response.data.email || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          nicNumber: response.data.nicNumber || "",
          profileImage: response.data.profileImage || "",
        });
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.put(`/users/${userId}`, {
        username: formData.username,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        nicNumber: formData.nicNumber,
        profileImage: formData.profileImage,
      });

      const currentStoredUser = JSON.parse(localStorage.getItem("userInfo"));
      const nextUserInfo = {
        ...currentStoredUser,
        ...response.data.user,
      };

      localStorage.setItem("userInfo", JSON.stringify(nextUserInfo));
      setMessage("Profile updated successfully");
      setFormData((current) => ({
        ...current,
        username: response.data.user.username || "",
        name: response.data.user.name || "",
        phoneNumber: response.data.user.phoneNumber || "",
        address: response.data.user.address || "",
        nicNumber: response.data.user.nicNumber || "",
        profileImage: response.data.user.profileImage || "",
      }));
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-hero">
          <p className="profile-hero__eyebrow">Account settings</p>
          <h1>Update your profile</h1>
          <p>
            Keep your name, contact details, and profile picture in sync across
            the app.
          </p>
        </div>

        <div className="profile-card">
          <div className="profile-preview">
            <div className="profile-preview__avatar">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile preview" />
              ) : (
                <span>
                  {(formData.username || "U").slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2>{formData.username || "Your profile"}</h2>
              <p>{formData.email}</p>
            </div>
          </div>

          {loading ? (
            <p className="profile-status">Loading profile...</p>
          ) : null}
          {error ? (
            <p className="profile-status profile-status--error">{error}</p>
          ) : null}
          {message ? (
            <p className="profile-status profile-status--success">{message}</p>
          ) : null}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-field">
              <label>Username</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your username"
              />
            </div>

            <div className="profile-field">
              <label>Full name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="profile-field profile-field--full">
              <label>Email</label>
              <input value={formData.email} disabled />
            </div>

            <div className="profile-field">
              <label>Phone number</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="0771234567"
              />
            </div>

            <div className="profile-field">
              <label>NIC number</label>
              <input
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleChange}
                placeholder="200012345678"
              />
            </div>

            <div className="profile-field profile-field--full">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="No 12, Galle Road, Colombo"
              />
            </div>

            <div className="profile-field profile-field--full">
              <label>Profile picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="profile-help">
                Choose a JPG or PNG. The image is stored with your profile.
              </p>
            </div>

            <div className="profile-actions profile-field--full">
              <button type="submit" disabled={saving || loading}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className="profile-actions__secondary"
                onClick={() => navigate("/")}
              >
                Back to home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
