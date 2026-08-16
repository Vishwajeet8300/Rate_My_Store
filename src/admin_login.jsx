import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin_login.css";
import { API_BASE_URL } from "./config";

function Login() {

  const navigate = useNavigate();

  // Store email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);


  // ===============================
  // HANDLE LOGIN
  // ===============================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {

      // Send email and password to backend
      const response = await fetch(
        `${API_BASE_URL}/api/admin/admin_login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );


      // Convert response to JSON
      const data = await response.json();


      // ===============================
      // LOGIN SUCCESS
      // ===============================

      if (response.ok && data.success) {

        setSuccess("Administrator login successful!");

        // Store login information
        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        localStorage.setItem(
          "adminEmail",
          email
        );


        // Redirect to admin page
        setTimeout(() => {
          navigate("/admin");
        }, 500);

      }


      // ===============================
      // LOGIN FAILED
      // ===============================

      else {

        setError(
          data.message ||
          "Invalid email or password."
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  // ===============================
  // UI
  // ===============================

  return (

    <div className="login-container">

      <div className="login-box">

        <h1>Administrator Login</h1>

        <p className="login-subtitle">
          Login to access the administrator dashboard
        </p>


        {/* Error message */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Success message */}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* ================= EMAIL ================= */}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="Enter administrator email"
              autoComplete="email"
              required
            />

          </div>


          {/* ================= PASSWORD ================= */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter administrator password"
              autoComplete="current-password"
              required
            />

          </div>


          {/* ================= LOGIN BUTTON ================= */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Administrator Login"
            }

          </button>

        </form>

      </div>

    </div>

  );
}

export default Login;