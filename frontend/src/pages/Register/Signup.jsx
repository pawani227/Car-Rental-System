import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vehicle_owner",
    nicNumber: "",
    address: "",
    phoneNumber: "",
    isVerified: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { ...formData, createdAt: new Date().toISOString() };
      await api.post("/users/register", payload);
      navigate("/login");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="auth-header text-center">
          <h2 className="fw-bold text-primary">Create Account</h2>
          <p className="text-muted">Join QuickDrive today</p>
        </div>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control custom-input"
            >
              <option value="vehicle_owner">Vehicle Owner</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">NIC Number</label>
            <input
              type="text"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="200012345678"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="No 12, Galle Road, Colombo"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control custom-input"
              placeholder="0771234567"
            />
          </div>
          {error ? <p className="text-danger small mb-2">{error}</p> : null}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 mt-3 shadow-sm"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 mb-0 small">
          Already have an account?
          <Link
            to="/login"
            className="ms-1 text-primary fw-bold text-decoration-none"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
