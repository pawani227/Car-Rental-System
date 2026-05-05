import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await api.post("/users/login", formData);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card--login shadow-lg">
        <div className="auth-header text-center auth-header--login">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Sign in to continue</p>
        </div>
        <form className="mt-4 auth-form-table" onSubmit={handleSubmit}>
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
          {error ? <p className="text-danger small mb-2">{error}</p> : null}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 mt-3 shadow-sm"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 mb-0 small auth-footer-text">
          Don&apos;t have an account?
          <Link
            to="/register"
            className="ms-1 text-primary fw-bold text-decoration-none"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
