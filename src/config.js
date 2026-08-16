// Single source of truth for the backend base URL.
// Every page should import API_BASE_URL from here instead of
// hardcoding "http://localhost:5000" or "http://127.0.0.1:5000"
// directly, so the whole app always talks to the same backend.
export const API_BASE_URL = "http://127.0.0.1:5000";
