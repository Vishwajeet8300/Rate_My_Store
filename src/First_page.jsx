import { Link } from "react-router-dom";
import "./First_page.css";

function First_page() {
  return (
    <div className="home-page">

      {/* ================= NAVIGATION BAR ================= */}
      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-star">★</span>
          RateMyStore
        </Link>

        {/* Navigation */}
        <div className="nav-links">

          {/* Normal User Login */}
          <Link
            to="/user-login"
            className="user-login-button"
          >
            User Login
          </Link>

          {/* Store Manager Login */}
          <Link
            to="/manager_login"
            className="manager-login-button"
          >
            Store Manager Login
          </Link>

          {/* Administrator Login */}
          <Link
            to="/admin-login"
            className="admin-login-button"
          >
            Administrator Login
          </Link>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}
      <main className="hero-section">

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>

        <div className="hero-content">

          <div className="rating-badge">
            <span>★</span>
            Trusted Store Reviews
          </div>

          <h1>
            Discover.
            <span> Review.</span>
            <br />
            Shop Better.
          </h1>

          <p>
            Find honest reviews, share your shopping experiences,
            and discover stores that people truly love.
          </p>

          <div className="hero-buttons">

            <Link
              to="/registration"
              className="main-register-button"
            >
              User Registration
              <span>→</span>
            </Link>

          </div>

          <div className="rating-preview">

            <div className="avatar-stack">
              <div className="avatar">A</div>
              <div className="avatar">R</div>
              <div className="avatar">S</div>
              <div className="avatar">+</div>
            </div>

            <div className="rating-info">

              <div className="stars">
                ★★★★★
              </div>

              <span>
                Trusted by thousands of shoppers
              </span>

            </div>

          </div>

        </div>


        {/* ================= REVIEW CARD ================= */}
        <div className="hero-card">

          <div className="card-top">

            <span className="store-icon">
              🛍️
            </span>

            <div>
              <h3>Great Store!</h3>
              <p>Verified Review</p>
            </div>

            <span className="verified">
              ✓
            </span>

          </div>

          <div className="card-stars">
            ★★★★★
          </div>

          <p className="review-text">
            "Amazing shopping experience! Fast delivery,
            great quality and excellent customer service."
          </p>

          <div className="review-user">

            <div className="small-avatar">
              V
            </div>

            <div>
              <strong>Verified Customer</strong>
              <span>2 days ago</span>
            </div>

          </div>

        </div>

      </main>


      {/* ================= FEATURES ================= */}
      <section className="features-section">

        <div className="feature">

          <div className="feature-icon">
            ★
          </div>

          <h3>Real Reviews</h3>

          <p>
            Read genuine experiences from real customers.
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            🔍
          </div>

          <h3>Discover Stores</h3>

          <p>
            Find highly-rated stores before you shop.
          </p>

        </div>


        <div className="feature">

          <div className="feature-icon">
            💬
          </div>

          <h3>Share Experience</h3>

          <p>
            Help others by sharing your own experience.
          </p>

        </div>

      </section>

    </div>
  );
}

export default First_page;