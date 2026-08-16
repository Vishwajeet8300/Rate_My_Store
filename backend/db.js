const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ratemystore"
});

db.connect((err) => {

    if (err) {
        console.error("MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

module.exports = db;