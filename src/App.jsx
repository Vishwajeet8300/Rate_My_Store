import { BrowserRouter, Routes, Route } from "react-router-dom";

import First_page from "./First_page.jsx";
import Registration from "./Registration.jsx";
import UserLogin from "./ulogin.jsx";
import Login from "./admin_login.jsx";
import Admin from "./Admin.jsx";
import Users from "./user.jsx";
import Stores from "./stores.jsx";
import AddStore from "./Addstore.jsx";

import StoreManagerLogin from "./StoreManagerLogin.jsx";
import StoreDashboard from "./StoreDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={<First_page />}
        />

        {/* USER REGISTRATION */}
        <Route
          path="/registration"
          element={<Registration />}
        />

        {/* USER LOGIN */}
        <Route
          path="/user-login"
          element={<UserLogin />}
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<Login />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* ADMIN - MANAGE USERS */}
        <Route
          path="/user"
          element={<Users />}
        />

        {/* ADMIN - MANAGE STORES / USER STORE LISTING */}
        <Route
          path="/stores"
          element={<Stores />}
        />

        {/* ADMIN - ADD STORE */}
        <Route
          path="/Addstore"
          element={<AddStore />}
        />

        {/* STORE MANAGER LOGIN */}
        <Route
          path="/manager_login"
          element={<StoreManagerLogin />}
        />

        {/* STORE MANAGER DASHBOARD */}
        <Route
          path="/Storedashboard"
          element={<StoreDashboard />}
        />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;