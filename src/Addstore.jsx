import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Addstore.css";
import { API_BASE_URL } from "./config";

function AddStore() {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !storeName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !address.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/stores`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            storeName: storeName.trim(),
            email: email.trim(),
            password: password,
            address: address.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("Add store response:", data);

      if (!response.ok || !data.success) {
        setError(
          data.message || "Failed to add store."
        );
        return;
      }

      setMessage("Store added successfully!");

      // Clear form
      setStoreName("");
      setEmail("");
      setPassword("");
      setAddress("");

    } catch (error) {
      console.error("Add store error:", error);

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-store-page">

      <div className="add-store-container">

        <h2>Add Store</h2>

        <p className="subtitle">
          Enter the store details below
        </p>

        {/* Success message */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Store Name */}
          <div className="form-group">

            <label htmlFor="storeName">
              Store Name
            </label>

            <input
              id="storeName"
              type="text"
              placeholder="Enter store name"
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* Manager Email */}
          <div className="form-group">

            <label htmlFor="email">
              Manager Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter store manager email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* Manager Password */}
          <div className="form-group">

            <label htmlFor="password">
              Manager Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter manager password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              required
              minLength={6}
            />

          </div>

          {/* Address */}
          <div className="form-group">

            <label htmlFor="address">
              Address
            </label>

            <textarea
              id="address"
              placeholder="Enter store address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {/* Add Store */}
          <button
            type="submit"
            className="add-store-button"
            disabled={loading}
          >
            {loading ? "Adding Store..." : "Add Store"}
          </button>

        </form>

        {/* Back */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/admin")}
          disabled={loading}
        >
          Back to Admin
        </button>

      </div>

    </div>
  );
}

export default AddStore;