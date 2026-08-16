import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import { API_BASE_URL } from './config';

function Admin() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStats({
            totalUsers: data.totalUsers,
            totalStores: data.totalStores,
            totalReviews: data.totalReviews,
          });
        }
      } catch (error) {
        console.error("Admin stats error:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-page">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <span>★</span>
          RateMyStore
        </div>

        <div className="admin-menu">

          <Link to="/admin" className="menu-item active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/user" className="menu-item">
            <span>👤</span>
            Users
          </Link>

          <Link to="/stores" className="menu-item">
            <span>🏪</span>
            Stores
          </Link>

        </div>

        <div className="sidebar-bottom">
          <Link to="/" className="back-home">
            ← Back to Website
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="admin-main">

        {/* Top Bar */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and stores from one place.</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>

        </header>


        {/* Statistics */}
        <section className="admin-stats">

          <div className="stat-card">
            <div className="stat-icon user-icon">
              👤
            </div>

            <div>
              <span>Total Users</span>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon store-icon">
              🏪
            </div>

            <div>
              <span>Total Stores</span>
              <h2>{stats.totalStores}</h2>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon review-icon">
              ⭐
            </div>

            <div>
              <span>Total Reviews</span>
              <h2>{stats.totalReviews}</h2>
            </div>
          </div>

        </section>


        {/* Main Operations */}
        <section className="operations-section">

          <div className="section-heading">
            <h2>Main Operations</h2>

            <p>
              Choose an operation you want to perform.
            </p>
          </div>


          <div className="operation-grid">

            {/* Add User */}
            <div className="operation-card">

              <div className="operation-icon user-operation">
                👤
              </div>

              <div className="operation-content">

                <h3>Add Normal User</h3>

                <p>
                  Create a new user account and add their
                  details to the system.
                </p>

                <Link
                  to="/registration"
                  className="operation-button"

                >
                  Add User
                  <span>→</span>
                </Link>

              </div>

            </div>


            {/* Add Store */}
            <div className="operation-card">

              <div className="operation-icon store-operation">
                🏪
              </div>

              <div className="operation-content">

                <h3>Add New Store</h3>

                <p>
                  Register a new store and make it available
                  for users to review.
                </p>

                <Link
                  to="/Addstore"
                  className="operation-button"
                >
                  Add Store
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Admin;