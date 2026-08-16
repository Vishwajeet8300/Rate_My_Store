# ⭐ RateMyStore

**RateMyStore** is a full-stack store rating and review platform where customers can discover stores, submit ratings/reviews, store managers can track their store performance, and administrators can manage the entire platform from a central dashboard.

> Find honest reviews, share your shopping experiences, and discover stores that people truly love.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Application Routes](#-application-routes)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## ✨ Features

### 👤 Normal User
- Register and log in to a personal account
- Browse all registered stores
- Search stores by name, address, or email
- Filter stores by minimum rating and sort (e.g., Name A–Z)
- Submit a star rating for any store

### 🏪 Store Manager
- Secure login for managing an individual store
- Dashboard showing:
  - Average rating
  - Total reviews
  - Store status (Active)
  - Rating breakdown (1★–5★ distribution)
  - Store information (name, manager email, address)
- View past customer reviews
- Change account password

### 🛠️ Administrator
- Central admin dashboard showing:
  - Total Users
  - Total Stores
  - Total Reviews
- Add a new normal user
- Add a new store
- View, search, and filter all users by name/email/address/role
- Delete users
- Manage stores

---

## 🧰 Tech Stack

| Layer            | Technology                              |
|-------------------|------------------------------------------|
| Frontend          | React (Vite), React Router DOM, CSS      |
| Backend           | Node.js, Express.js                      |
| Database          | MySQL                                    |
| Authentication    | bcrypt (password hashing)                |
| Dev Tools         | ESLint, VS Code                          |

---

## 📁 Project Structure

```
xroxiler_project/
├── backend/
│   ├── node_modules/
│   ├── db.js               # MySQL database connection
│   ├── server.js           # Express server & API routes
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── assets/
│   ├── App.jsx              # Main app routes
│   ├── App.css
│   ├── main.jsx             # React entry point
│   │
│   ├── First_page.jsx       # Landing page
│   ├── First_page.css
│   │
│   ├── Registration.jsx     # User registration
│   ├── Registration.css
│   │
│   ├── ulogin.jsx           # User login
│   ├── ulogin.css
│   │
│   ├── admin_login.jsx      # Admin login
│   ├── admin_login.css
│   │
│   ├── Admin.jsx            # Admin dashboard
│   ├── Admin.css
│   │
│   ├── user.jsx             # Users management (admin)
│   ├── user.css
│   │
│   ├── Addstore.jsx         # Add new store (admin)
│   ├── Addstore.css
│   │
│   ├── stores.jsx           # Stores listing (user view)
│   ├── stores.css
│   │
│   ├── StoreManagerLogin.jsx  # Store manager login
│   ├── StoreManagerLogin.css
│   │
│   ├── StoreDashboard.jsx     # Store manager dashboard
│   └── StoreDashboard.css
│
├── public/
├── index.html
├── eslint.config.js
├── package.json
├── package-lock.json
└── .gitignore
```

---

## 🗄️ Database Schema

The project uses a MySQL database with the following core tables:

**`users`**
| Column | Type |
|---|---|
| id | INT (PK) |
| name | VARCHAR |
| email | VARCHAR |
| address | VARCHAR |
| password | VARCHAR (hashed with bcrypt) |
| role | VARCHAR |
| created_at | DATETIME |

**`stores`**
| Column | Type |
|---|---|
| id | INT (PK) |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR (hashed, nullable) |
| address | VARCHAR |
| created_at | DATETIME |
| rating | DECIMAL |

**`admins`**
| Column | Type |
|---|---|
| id | INT (PK) |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR (hashed with bcrypt) |
| created_at | DATETIME |

**`reviews`**
| Column | Type |
|---|---|
| id | INT (PK) |
| user_id | INT (FK → users.id) |
| store_id | INT (FK → stores.id) |
| rating | INT |
| comment | TEXT (nullable) |
| created_at | DATETIME |

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/)
- npm (comes with Node.js)

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/xroxiler_project.git
   cd xroxiler_project
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up the MySQL database**
   ```sql
   CREATE DATABASE xroxiler_db;
   USE xroxiler_db;

   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255) UNIQUE,
     address VARCHAR(255),
     password VARCHAR(255),
     role VARCHAR(50) DEFAULT 'user',
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE stores (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(255),
     address VARCHAR(255),
     rating DECIMAL(2,1),
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE admins (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255) UNIQUE,
     password VARCHAR(255),
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE reviews (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     store_id INT,
     rating INT,
     comment TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (store_id) REFERENCES stores(id)
   );
   ```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder with the following variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=xroxiler_db
PORT=5174
```

> ⚠️ Never commit your `.env` file — make sure it's listed in `.gitignore`.

---

## 🚀 Running the Project

1. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   The backend runs on `http://localhost:5174` (or the `PORT` set in `.env`).

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The frontend runs on `http://localhost:5173`.

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧭 Application Routes

| Path | Page | Access |
|---|---|---|
| `/` | Landing / First Page | Public |
| `/registration` | User Registration | Public |
| `/login` | User Login | Public |
| `/admin_login` | Administrator Login | Public |
| `/StoreManagerLogin` | Store Manager Login | Public |
| `/user` (dashboard) | Stores listing & ratings | User |
| `/Admin` | Admin Dashboard | Admin |
| `/Addstore` | Add New Store | Admin |
| `/stores` | Manage Stores | Admin |
| `/StoreDashboard` | Store Manager Dashboard | Store Manager |

---

## 👥 User Roles

| Role | Login Page | Capabilities |
|---|---|---|
| **User** | User Login | Browse stores, rate stores |
| **Store Manager** | Store Manager Login | View ratings/reviews for their own store, change password |
| **Admin** | Administrator Login | Manage users and stores, view platform-wide stats |

---

## 📸 Screenshots

> Add screenshots of the following pages to a `/screenshots` folder and reference them here:
- Landing Page
- User Login
- Store Manager Login
- Admin Dashboard
- Users Management
- Stores Listing
- Store Manager Dashboard

Example:
```markdown
![Landing Page](./screenshots/landing-page.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

## 🔮 Future Improvements

- Add review comments display alongside star ratings
- Add JWT-based authentication and protected routes
- Add pagination for large user/store lists
- Add email verification for new registrations
- Add store image uploads
- Add analytics/charts for admin dashboard

---



## 🙋 Author

**Vishwajeet Patil**
Feel free to reach out for questions or collaboration opportunities.



