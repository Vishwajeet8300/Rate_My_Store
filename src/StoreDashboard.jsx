import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreDashboard.css";
import { API_BASE_URL } from "./config";

function StoreDashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const storeId = localStorage.getItem("managerStoreId");
  const managerName = localStorage.getItem("managerStoreName");

  useEffect(() => {

    if (!storeId) {
      navigate("/manager_login");
      return;
    }

    loadDashboard();

  }, [storeId, navigate]);


  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/store-managers/${storeId}/dashboard`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        setError(
          data.message ||
          "Could not load dashboard."
        );

        return;
      }

      setDashboard(data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);
    }
  };


  const handleLogout = () => {

    localStorage.removeItem("managerLoggedIn");
    localStorage.removeItem("managerStoreId");
    localStorage.removeItem("managerStoreName");
    localStorage.removeItem("managerEmail");

    navigate("/");
  };


  const handleChangePassword = async (e) => {

    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setPasswordError(
        "Please fill all password fields."
      );

      return;
    }

    if (newPassword.length < 6) {

      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;
    }

    if (newPassword !== confirmPassword) {

      setPasswordError(
        "New password and confirm password do not match."
      );

      return;
    }

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/store-managers/${storeId}/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        setPasswordError(
          data.message ||
          "Could not change password."
        );

        return;
      }

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {

      console.error(error);

      setPasswordError(
        "Unable to connect to the server."
      );
    }
  };


  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }


  if (error) {

    return (
      <div className="dashboard-error-page">

        <h2>
          Unable to load dashboard
        </h2>

        <p>{error}</p>

        <button onClick={handleLogout}>
          Back to Home
        </button>

      </div>
    );
  }


  const statistics =
    dashboard?.statistics || {};

  const distribution =
    dashboard?.distribution || [];

  const reviews =
    dashboard?.reviews || [];

  const store =
    dashboard?.store || {};


  return (

    <div className="store-dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="dashboard-logo">
          <span>★</span>
          RateMyStore
        </div>

        <div className="header-right">

          <div className="manager-info">

            <strong>
              {managerName || store.name}
            </strong>

            <span>
              Store Manager
            </span>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        <div className="welcome-section">

          <div>

            <p className="dashboard-label">
              STORE MANAGER DASHBOARD
            </p>

            <h1>
              {store.name}
            </h1>

            <p>
              {store.email}
            </p>

          </div>

        </div>


        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ★
            </div>

            <div>

              <span>
                Average Rating
              </span>

              <strong>
                {Number(
                  statistics.averageRating || 0
                ).toFixed(1)}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>

              <span>
                Total Reviews
              </span>

              <strong>
                {statistics.totalReviews || 0}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🏪
            </div>

            <div>

              <span>
                Store
              </span>

              <strong>
                Active
              </strong>

            </div>

          </div>

        </section>


        {/* ================= ANALYSIS ================= */}

        <section className="dashboard-grid">

          <div className="dashboard-card">

            <div className="card-heading">

              <h2>
                Rating Analysis
              </h2>

              <span>
                Customer ratings
              </span>

            </div>


            <div className="rating-summary">

              <div className="big-rating">

                <strong>
                  {Number(
                    statistics.averageRating || 0
                  ).toFixed(1)}
                </strong>

                <div className="big-stars">
                  ★★★★★
                </div>

                <span>
                  Average Rating
                </span>

              </div>


              <div className="distribution">

                {[5, 4, 3, 2, 1].map(
                  (rating) => {

                    const found =
                      distribution.find(
                        (item) =>
                          Number(item.rating) ===
                          rating
                      );

                    const count =
                      found
                        ? Number(found.count)
                        : 0;

                    const total =
                      Number(
                        statistics.totalReviews || 0
                      );

                    const percentage =
                      total > 0
                        ? (count / total) * 100
                        : 0;

                    return (

                      <div
                        className="rating-row"
                        key={rating}
                      >

                        <span>
                          {rating} ★
                        </span>

                        <div className="rating-bar">

                          <div
                            className="rating-fill"
                            style={{
                              width:
                                `${percentage}%`
                            }}
                          />

                        </div>

                        <span>
                          {count}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>


          {/* ================= STORE DETAILS ================= */}

          <div className="dashboard-card">

            <div className="card-heading">

              <h2>
                Store Information
              </h2>

            </div>

            <div className="store-details">

              <div>
                <span>
                  Store Name
                </span>

                <strong>
                  {store.name}
                </strong>
              </div>

              <div>
                <span>
                  Manager Email
                </span>

                <strong>
                  {store.email}
                </strong>
              </div>

              <div>
                <span>
                  Address
                </span>

                <strong>
                  {store.address}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* ================= REVIEWS ================= */}

        <section className="reviews-card">

          <div className="reviews-header">

            <div>

              <h2>
                Past Customer Reviews
              </h2>

              <p>
                Reviews submitted by customers
              </p>

            </div>

            <div className="review-count">
              {reviews.length} Reviews
            </div>

          </div>


          {reviews.length === 0 ? (

            <div className="no-reviews">
              <div>
                💬
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Customer reviews will appear here.
              </p>

            </div>

          ) : (

            <div className="reviews-list">

              {reviews.map(
                (review) => (

                  <div
                    className="review-item"
                    key={review.id}
                  >

                    <div className="review-avatar">
                      {review.user_name
                        ? review.user_name
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>


                    <div className="review-content">

                      <div className="review-top">

                        <div>

                          <strong>
                            {review.user_name ||
                              "Customer"}
                          </strong>

                          <div className="review-stars">

                            {"★".repeat(
                              Number(
                                review.rating
                              )
                            )}

                            <span>
                              {"★".repeat(
                                5 -
                                Number(
                                  review.rating
                                )
                              )}
                            </span>

                          </div>

                        </div>

                        <time>
                          {new Date(
                            review.created_at
                          ).toLocaleDateString()}
                        </time>

                      </div>


                      <p>
                        {review.comment ||
                          "No comment provided."}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </section>


        {/* ================= CHANGE PASSWORD ================= */}

        <section className="password-card">

          <div className="password-heading">

            <div className="password-icon">
              🔒
            </div>

            <div>

              <h2>
                Change Password
              </h2>

              <p>
                Update your store manager password.
              </p>

            </div>

          </div>


          {passwordMessage && (

            <div className="password-success">
              {passwordMessage}
            </div>

          )}


          {passwordError && (

            <div className="password-error">
              {passwordError}
            </div>

          )}


          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >

            <div className="password-field">

              <label>
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Enter current password"
              />

            </div>


            <div className="password-field">

              <label>
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="Enter new password"
              />

            </div>


            <div className="password-field">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
              />

            </div>


            <button
              type="submit"
              className="change-password-button"
            >
              Change Password
            </button>

          </form>

        </section>

      </main>

    </div>
  );
}

export default StoreDashboard;