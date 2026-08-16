import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./stores.css";
import { API_BASE_URL } from "./config";

function Stores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});

  // =====================================================
  // FILTER / SORT STATE
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  const userName =
    localStorage.getItem("userName") || "User";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {
    loadStores();
  }, []);

  // =====================================================
  // LOAD STORES
  // =====================================================

  const loadStores = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/stores`
      );

      const data = await response.json();

      console.log("Stores response:", data);

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Unable to load stores."
        );
        return;
      }

      setStores(data.stores || []);

    } catch (error) {
      console.error("Load stores error:", error);

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RATING SELECTION
  // =====================================================

  const handleRatingChange = (storeId, value) => {
    setRatings((previous) => ({
      ...previous,
      [storeId]: value,
    }));

    setMessage("");
  };

  // =====================================================
  // SUBMIT RATING
  // =====================================================

  const submitRating = async (storeId) => {
    const selectedRating = ratings[storeId];

    // Check login
    if (!userId) {
      setMessage(
        "Please login before submitting a rating."
      );
      return;
    }

    // Check rating
    if (
      selectedRating === undefined ||
      selectedRating === null ||
      selectedRating === ""
    ) {
      setMessage(
        "Please select a rating."
      );
      return;
    }

    const numericRating =
      Number(selectedRating);

    if (
      Number.isNaN(numericRating) ||
      numericRating < 0.5 ||
      numericRating > 5
    ) {
      setMessage(
        "Rating must be between 0.5 and 5."
      );
      return;
    }

    // Prevent multiple clicks
    setSubmitting((previous) => ({
      ...previous,
      [storeId]: true,
    }));

    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stores/${storeId}/rating`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: Number(userId),
            rating: numericRating,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Rating response:",
        data
      );

      if (!response.ok || !data.success) {
        setMessage(
          data.message ||
            "Failed to submit rating."
        );

        return;
      }

      setMessage(
        "Rating submitted successfully!"
      );

      // Update the store's average rating on screen
      // without needing a full reload.
      if (data.rating !== undefined) {
        setStores((previousStores) =>
          previousStores.map((store) =>
            store.id === storeId
              ? { ...store, rating: data.rating }
              : store
          )
        );
      }

      // Clear selected rating
      setRatings((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[storeId];

        return updated;
      });

    } catch (error) {
      console.error(
        "Submit rating error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [storeId]: false,
      }));
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "userLoggedIn"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "userEmail"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userRole"
    );

    navigate("/user-login");
  };

  // =====================================================
  // FILTERED + SORTED STORES
  // =====================================================

  const filteredStores = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const minRatingValue =
      minRating === "all" ? 0 : Number(minRating);

    let result = stores.filter((store) => {

      const matchesQuery =
        !query ||
        [store.name, store.address, store.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesRating =
        Number(store.rating || 0) >= minRatingValue;

      return matchesQuery && matchesRating;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {

        case "name-desc":
          return String(b.name).localeCompare(String(a.name));

        case "rating-desc":
          return Number(b.rating || 0) - Number(a.rating || 0);

        case "rating-asc":
          return Number(a.rating || 0) - Number(b.rating || 0);

        case "name-asc":
        default:
          return String(a.name).localeCompare(String(b.name));
      }
    });

    return result;
  }, [stores, searchTerm, minRating, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || minRating !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setMinRating("all");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="stores-page">

      {/* ================= HEADER ================= */}

      <div className="top-header">

        <div className="profile">

          <div className="profile-icon">
            👤
          </div>

          <div className="profile-info">

            <div className="profile-name">
              {userName}
            </div>

            <div className="profile-email">
              {userEmail}
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* ================= STORES ================= */}

      <div className="stores-container">

        <div className="stores-heading">

          <div>
            <h1>Stores</h1>

            <p className="subtitle">
              View stores and give your rating
            </p>
          </div>

          {!loading && stores.length > 0 && (
            <div className="stores-count-badge">
              <strong>{stores.length}</strong>
              <span>Total</span>
            </div>
          )}

        </div>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* ================= FILTER TOOLBAR ================= */}

        {!loading && stores.length > 0 && (

          <div className="stores-toolbar">

            <div className="stores-search">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                placeholder="Search by name, address or email..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              {searchTerm && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="stores-filter-field">
              <label htmlFor="minRating">
                Min Rating
              </label>

              <select
                id="minRating"
                value={minRating}
                onChange={(e) =>
                  setMinRating(e.target.value)
                }
              >
                <option value="all">Any</option>
                <option value="4">4+ ★</option>
                <option value="3">3+ ★</option>
                <option value="2">2+ ★</option>
                <option value="1">1+ ★</option>
              </select>
            </div>

            <div className="stores-filter-field">
              <label htmlFor="sortBy">
                Sort By
              </label>

              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-desc">Rating (High-Low)</option>
                <option value="rating-asc">Rating (Low-High)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="reset-filters-button"
                onClick={clearFilters}
              >
                Reset
              </button>
            )}

          </div>

        )}

        {/* ================= RESULTS SUMMARY ================= */}

        {!loading && stores.length > 0 && (
          <div className="results-summary">
            Showing <strong>{filteredStores.length}</strong> of{" "}
            <strong>{stores.length}</strong> stores
            {hasActiveFilters && " (filtered)"}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (

          <p className="loading">
            Loading stores...
          </p>

        ) : stores.length === 0 ? (

          <p className="no-stores">
            No stores available.
          </p>

        ) : filteredStores.length === 0 ? (

          <div className="no-stores">
            No stores match your search or filter.
            <button
              type="button"
              className="reset-filters-button inline"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

        ) : (

          <div className="store-grid">

            {filteredStores.map((store) => {

              const averageRating =
                Number(store.rating) || 0;

              const fullStars =
                Math.round(averageRating);

              return (

                <div
                  className="store-card"
                  key={store.id}
                >

                  {/* Store Name + Average Rating */}

                  <div className="store-card-top">
                    <h2>
                      {store.name}
                    </h2>

                    <div className="store-avg-rating">
                      <span className="store-avg-stars">
                        {"★".repeat(fullStars)}
                        <span className="store-avg-stars-empty">
                          {"★".repeat(5 - fullStars)}
                        </span>
                      </span>

                      <span className="store-avg-number">
                        {averageRating > 0
                          ? averageRating.toFixed(1)
                          : "No ratings yet"}
                      </span>
                    </div>
                  </div>

                  {/* Email */}

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {store.email || "N/A"}
                  </p>

                  {/* Address */}

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {store.address}
                  </p>

                  {/* ================= RATING ================= */}

                  <div className="rating-section">

                    <label>
                      Give your rating
                    </label>

                    <select
                      value={
                        ratings[store.id] || ""
                      }
                      onChange={(event) =>
                        handleRatingChange(
                          store.id,
                          event.target.value
                        )
                      }
                      disabled={
                        submitting[store.id]
                      }
                    >

                      <option value="">
                        Select rating
                      </option>

                      <option value="0.5">
                        0.5
                      </option>

                      <option value="1">
                        1
                      </option>

                      <option value="1.5">
                        1.5
                      </option>

                      <option value="2">
                        2
                      </option>

                      <option value="2.5">
                        2.5
                      </option>

                      <option value="3">
                        3
                      </option>

                      <option value="3.5">
                        3.5
                      </option>

                      <option value="4">
                        4
                      </option>

                      <option value="4.5">
                        4.5
                      </option>

                      <option value="5">
                        5
                      </option>

                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        submitRating(
                          store.id
                        )
                      }
                      disabled={
                        submitting[store.id]
                      }
                    >
                      {submitting[store.id]
                        ? "Submitting..."
                        : "Submit Rating"}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Stores;
