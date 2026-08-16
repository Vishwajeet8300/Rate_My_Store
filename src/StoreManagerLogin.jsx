import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreManagerLogin.css";
import { API_BASE_URL } from "./config";

function StoreManagerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/store-managers/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login Response:", data);

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Keep the full object for reference...
      localStorage.setItem(
        "storeManager",
        JSON.stringify(data.storeManager)
      );

      // ...and also store the individual keys that
      // StoreDashboard.jsx actually reads on load.
      localStorage.setItem("managerLoggedIn", "true");
      localStorage.setItem("managerStoreId", data.storeManager.id);
      localStorage.setItem("managerStoreName", data.storeManager.name);
      localStorage.setItem("managerEmail", data.storeManager.email);

      // Correct dashboard route
      navigate("/Storedashboard", { replace: true });

    } catch (error) {
      console.error(error);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-login-page">
      <div className="manager-login-card">

        <div className="manager-logo">
          <span>★</span> RateMyStore
        </div>

        <div className="manager-heading">
          <h1>Store Manager Login</h1>
          <p>Login to manage your store</p>
        </div>

        {error && (
          <div className="manager-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="manager-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="manager-form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="manager-login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <button
          type="button"
          className="manager-back-button"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}

export default StoreManagerLogin;