import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <div className="auth-header text-center">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Sign in to continue</p>
        </div>
        <form className="mt-4">
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input
              type="email"
              className="form-control custom-input"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 mt-3 shadow-sm"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 mb-0 small">
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
