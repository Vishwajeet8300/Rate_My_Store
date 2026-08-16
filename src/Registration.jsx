import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";
import { API_BASE_URL } from "./config";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.address ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful.
        // The account isn't logged in yet (no session was
        // created here), so send the user to the login page
        // instead of straight to /stores, otherwise buttons
        // like "Submit Rating" would fail on arrival.
        setMessage(
          "Registration successful! Please log in to continue."
        );

        setTimeout(() => {
          navigate("/user-login");
        }, 800);
      } else {
        setError(data.message || "Registration failed.");
      }

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="registration-container">

      <div className="registration-box">

        <h1>Registration Page</h1>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="name">
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Address
            </label>

            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Registration;