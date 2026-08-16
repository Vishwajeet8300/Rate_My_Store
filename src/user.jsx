import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { API_BASE_URL } from "./config";

function User() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/users`
      );

      const data = await response.json();

      console.log("Users response:", data);

      if (response.ok && data.success) {

        setUsers(data.users);

      } else {

        setMessage(
          data.message || "Unable to load users."
        );
      }

    } catch (error) {

      console.error("Users error:", error);

      setMessage(
        "Unable to connect to server."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // DELETE USER
  // =====================================================

  const deleteUser = async (userId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      setDeletingId(userId);
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      console.log("Delete response:", data);

      if (response.ok && data.success) {

        // Remove user from screen
        setUsers((previousUsers) =>
          previousUsers.filter(
            (user) => user.id !== userId
          )
        );

        setMessage(
          "User deleted successfully."
        );

      } else {

        setMessage(
          data.message || "Unable to delete user."
        );
      }

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      setMessage(
        "Unable to connect to server."
      );

    } finally {

      setDeletingId(null);

    }
  };


  // =====================================================
  // DISTINCT ROLES (for the filter dropdown)
  // =====================================================

  const availableRoles = useMemo(() => {
    const roles = new Set(
      users.map((user) => user.role).filter(Boolean)
    );

    return Array.from(roles);
  }, [users]);


  // =====================================================
  // FILTERED USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      if (!matchesRole) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [
        user.name,
        user.email,
        user.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [users, searchTerm, roleFilter]);


  const hasActiveFilters =
    searchTerm.trim() !== "" || roleFilter !== "all";


  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };


  return (

    <div className="users-page">

      <div className="users-container">

        {/* =====================================================
            BACK TO ADMIN
        ===================================================== */}

        <button
          className="back-button"
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>


        {/* =====================================================
            PAGE HEADING
        ===================================================== */}

        <div className="users-page-heading">

          <div>
            <h1>Users</h1>

            <p className="subtitle">
              List of all registered users
            </p>
          </div>

          <div className="users-count-badge">
            <strong>{users.length}</strong>
            <span>Total</span>
          </div>

        </div>


        {/* =====================================================
            MESSAGE
        ===================================================== */}

        {message && (
          <div className="users-message">
            {message}
          </div>
        )}


        {/* =====================================================
            FILTER TOOLBAR
        ===================================================== */}

        {!loading && users.length > 0 && (

          <div className="users-toolbar">

            <div className="users-search">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                placeholder="Search by name, email or address..."
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

            <div className="users-role-filter">
              <label htmlFor="roleFilter">
                Role
              </label>

              <select
                id="roleFilter"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >
                <option value="all">
                  All Roles
                </option>

                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
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


        {/* =====================================================
            RESULTS SUMMARY
        ===================================================== */}

        {!loading && users.length > 0 && (
          <div className="results-summary">
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> users
            {hasActiveFilters && " (filtered)"}
          </div>
        )}


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="loading">
            Loading users...
          </div>
        )}


        {/* =====================================================
            NO USERS AT ALL
        ===================================================== */}

        {!loading &&
          users.length === 0 &&
          !message && (
            <div className="no-users">
              No users found.
            </div>
          )}


        {/* =====================================================
            NO RESULTS AFTER FILTERING
        ===================================================== */}

        {!loading &&
          users.length > 0 &&
          filteredUsers.length === 0 && (
            <div className="no-users">
              No users match your search or filter.
              <button
                type="button"
                className="reset-filters-button inline"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}


        {/* =====================================================
            USERS TABLE
        ===================================================== */}

        {!loading &&
          filteredUsers.length > 0 && (

            <div className="users-table-container">

              <table className="users-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Address</th>

                    <th>Role</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map((user) => (

                    <tr key={user.id}>

                      <td className="cell-id">
                        {user.id}
                      </td>

                      <td>
                        <div className="user-name-cell">
                          <span className="user-avatar">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                          {user.name}
                        </div>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td className="cell-address">
                        {user.address}
                      </td>

                      <td>

                        <span
                          className={`role-badge role-${
                            user.role || "user"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteUser(user.id)
                          }
                          disabled={
                            deletingId === user.id
                          }
                        >

                          {deletingId === user.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

      </div>

    </div>

  );
}

export default User;
