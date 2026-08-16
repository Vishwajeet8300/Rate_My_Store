import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ulogin.css";
import { API_BASE_URL } from "./config";

function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Call backend login API
      const response = await fetch(
        `${API_BASE_URL}/api/users/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // Convert response to JSON
      const data = await response.json();

      console.log("Login response:", data);

      // Login successful
      if (response.ok && data.success) {
        // Save logged-in user information
        localStorage.setItem(
          "userLoggedIn",
          "true"
        );

        localStorage.setItem(
          "userId",
          data.user.id
        );

        localStorage.setItem(
          "userEmail",
          data.user.email
        );

        localStorage.setItem(
          "userName",
          data.user.name
        );

        localStorage.setItem(
          "userRole",
          data.user.role
        );

        // Go to stores page
        navigate("/stores");
      } else {
        // Login failed
        setError(
          data.message ||
            "Invalid email or password."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        {/* ================= LOGO ================= */}

        <div className="login-logo">
          <span className="login-logo-star">
            ★
          </span>

          <span>RateMyStore</span>
        </div>


        {/* ================= HEADING ================= */}

        <h1>User Login</h1>

        <p className="login-subtitle">
          Login to your RateMyStore account
        </p>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* ================= LOGIN FORM ================= */}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              disabled={loading}
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              disabled={loading}
              required
            />

          </div>


          {/* Login Button */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* ================= BACK TO HOME ================= */}

        <Link
          to="/"
          className="back-home-link"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default UserLogin;