require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RateMyStore Backend is Running!"
    });
});

// =====================================================
// TEST DATABASE
// =====================================================

app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                success: false,
                message: "Database connection failed",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: "MySQL connection is working!",
            result: results
        });
    });
});

// =====================================================
// ADMIN LOGIN
// =====================================================

app.post("/api/admin/admin_login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = String(email).trim().toLowerCase();

        const query = `
            SELECT id, name, email, password
            FROM admins
            WHERE LOWER(email) = ?
            LIMIT 1
        `;

        db.query(query, [cleanEmail], async (err, results) => {
            if (err) {
                console.error("Admin login error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const admin = results[0];

            if (!admin.password) {
                return res.status(401).json({
                    success: false,
                    message: "Admin password is not configured"
                });
            }

            try {
                const passwordMatch = await bcrypt.compare(
                    String(password),
                    String(admin.password)
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Administrator login successful",
                    admin: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email
                    }
                });

            } catch (error) {
                console.error("Admin password comparison error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Login error"
                });
            }
        });

    } catch (error) {
        console.error("Admin login server error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// USER REGISTRATION
// =====================================================

app.post("/api/users/register", async (req, res) => {
    try {
        const {
            name,
            email,
            address,
            password
        } = req.body || {};

        if (!name || !email || !address || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanAddress = String(address).trim();
        const cleanPassword = String(password);

        if (
            !cleanName ||
            !cleanEmail ||
            !cleanAddress ||
            !cleanPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (cleanPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        db.query(
            "SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1",
            [cleanEmail],
            async (err, results) => {
                if (err) {
                    console.error("User email check error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already registered"
                    });
                }

                try {
                    const hashedPassword = await bcrypt.hash(
                        cleanPassword,
                        10
                    );

                    const insertQuery = `
                        INSERT INTO users
                        (name, email, address, password, role)
                        VALUES (?, ?, ?, ?, 'user')
                    `;

                    db.query(
                        insertQuery,
                        [
                            cleanName,
                            cleanEmail,
                            cleanAddress,
                            hashedPassword
                        ],
                        (err, result) => {
                            if (err) {
                                console.error("User insert error:", err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Could not create user",
                                    error: err.message
                                });
                            }

                            return res.status(201).json({
                                success: true,
                                message: "User registered successfully",
                                userId: result.insertId
                            });
                        }
                    );

                } catch (error) {
                    console.error("User password hashing error:", error);

                    return res.status(500).json({
                        success: false,
                        message: "Could not process password"
                    });
                }
            }
        );

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// USER LOGIN
// =====================================================

app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = String(email).trim().toLowerCase();

        const query = `
            SELECT
                id,
                name,
                email,
                address,
                password,
                role
            FROM users
            WHERE LOWER(email) = ?
            LIMIT 1
        `;

        db.query(query, [cleanEmail], async (err, results) => {
            if (err) {
                console.error("User login database error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            if (!user.password) {
                return res.status(401).json({
                    success: false,
                    message: "User password is not configured"
                });
            }

            try {
                const passwordMatch = await bcrypt.compare(
                    String(password),
                    String(user.password)
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password"
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "User login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        address: user.address,
                        role: user.role
                    }
                });

            } catch (error) {
                console.error("User password comparison error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Login error"
                });
            }
        });

    } catch (error) {
        console.error("User login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// GET ALL USERS
// =====================================================

app.get("/api/users", (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        ORDER BY id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Fetch users error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch users",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            users: results
        });
    });
});

// =====================================================
// GET SINGLE USER
// =====================================================

app.get("/api/users/:id", (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE id = ?
        LIMIT 1
    `;

    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error("Fetch user error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch user",
                error: err.message
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: results[0]
        });
    });
});

// =====================================================
// ADD STORE
// =====================================================

app.post("/api/stores", async (req, res) => {
    try {
        const {
            storeName,
            name,
            email,
            password,
            address
        } = req.body || {};

        // Supports both storeName and name
        const finalStoreName = storeName || name;

        console.log("ADD STORE REQUEST:", {
            storeName: finalStoreName,
            email,
            passwordProvided: !!password,
            address
        });

        if (
            !finalStoreName ||
            !email ||
            !password ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Store name, email, password and address are required"
            });
        }

        const cleanStoreName = String(finalStoreName).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password);
        const cleanAddress = String(address).trim();

        if (
            !cleanStoreName ||
            !cleanEmail ||
            !cleanPassword ||
            !cleanAddress
        ) {
            return res.status(400).json({
                success: false,
                message: "All store fields are required"
            });
        }

        if (cleanPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Store password must contain at least 6 characters"
            });
        }

        db.query(
            "SELECT id FROM stores WHERE LOWER(email) = ? LIMIT 1",
            [cleanEmail],
            async (err, results) => {
                if (err) {
                    console.error("Check store email error:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "A store with this email already exists"
                    });
                }

                try {
                    // ALWAYS hash store manager password
                    const hashedPassword = await bcrypt.hash(
                        cleanPassword,
                        10
                    );

                    const insertQuery = `
                        INSERT INTO stores
                        (name, email, password, address)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        insertQuery,
                        [
                            cleanStoreName,
                            cleanEmail,
                            hashedPassword,
                            cleanAddress
                        ],
                        (err, result) => {
                            if (err) {
                                console.error(
                                    "INSERT STORE ERROR:",
                                    err
                                );

                                return res.status(500).json({
                                    success: false,
                                    message: "Could not add store",
                                    error: err.message
                                });
                            }

                            console.log(
                                `Store created successfully. ID: ${result.insertId}`
                            );

                            return res.status(201).json({
                                success: true,
                                message: "Store added successfully",
                                storeId: result.insertId
                            });
                        }
                    );

                } catch (error) {
                    console.error(
                        "Store password hashing error:",
                        error
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Could not process password"
                    });
                }
            }
        );

    } catch (error) {
        console.error("Add store server error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// GET ALL STORES
// =====================================================

app.get("/api/stores", (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            address,
            rating,
            created_at
        FROM stores
        ORDER BY id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Fetch stores error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch stores",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            stores: results
        });
    });
});

// =====================================================
// GET SINGLE STORE
// =====================================================

app.get("/api/stores/:id", (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            address,
            rating,
            created_at
        FROM stores
        WHERE id = ?
        LIMIT 1
    `;

    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error("Fetch store error:", err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch store",
                error: err.message
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        res.status(200).json({
            success: true,
            store: results[0]
        });
    });
});

// =====================================================
// STORE MANAGER LOGIN
// =====================================================

app.post("/api/store-managers/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        console.log("STORE MANAGER LOGIN:", {
            email,
            passwordProvided: !!password
        });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = String(email).trim().toLowerCase();

        const query = `
            SELECT
                id,
                name,
                email,
                password,
                address,
                rating
            FROM stores
            WHERE LOWER(email) = ?
            LIMIT 1
        `;

        db.query(query, [cleanEmail], async (err, results) => {
            if (err) {
                console.error(
                    "Store manager login database error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const store = results[0];

            // IMPORTANT: Existing old stores may have NULL password
            if (
                store.password === null ||
                store.password === undefined ||
                String(store.password).trim() === ""
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "This store has no manager password. Set a password for this store first."
                });
            }

            try {
                const passwordMatch = await bcrypt.compare(
                    String(password),
                    String(store.password)
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password"
                    });
                }

                console.log(
                    `STORE MANAGER LOGIN SUCCESS: ${store.email}`
                );

                return res.status(200).json({
                    success: true,
                    message: "Store manager login successful",

                    storeManager: {
                        id: store.id,
                        name: store.name,
                        email: store.email,
                        address: store.address,
                        rating: store.rating
                    }
                });

            } catch (error) {
                console.error(
                    "Store manager password comparison error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Login error"
                });
            }
        });

    } catch (error) {
        console.error("Store manager login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// SET INITIAL STORE MANAGER PASSWORD
// USE THIS FOR OLD STORES WHERE PASSWORD IS NULL
// =====================================================

app.put("/api/stores/:storeId/set-password", async (req, res) => {
    try {
        const storeId = req.params.storeId;
        const { password } = req.body || {};

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        const cleanPassword = String(password);

        if (cleanPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        db.query(
            "SELECT id, email FROM stores WHERE id = ? LIMIT 1",
            [storeId],
            async (err, results) => {
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (!results || results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Store not found"
                    });
                }

                try {
                    const hashedPassword = await bcrypt.hash(
                        cleanPassword,
                        10
                    );

                    db.query(
                        `
                        UPDATE stores
                        SET password = ?
                        WHERE id = ?
                        `,
                        [hashedPassword, storeId],
                        (err, result) => {
                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Could not set store password",
                                    error: err.message
                                });
                            }

                            return res.status(200).json({
                                success: true,
                                message:
                                    "Store manager password set successfully",
                                storeId: storeId
                            });
                        }
                    );

                } catch (error) {
                    console.error(error);

                    return res.status(500).json({
                        success: false,
                        message: "Could not process password"
                    });
                }
            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// =====================================================
// STORE MANAGER DASHBOARD
// =====================================================

app.get("/api/store-managers/:storeId/dashboard", (req, res) => {
    const storeId = req.params.storeId;

    const storeQuery = `
        SELECT
            id,
            name,
            email,
            address,
            rating,
            created_at
        FROM stores
        WHERE id = ?
        LIMIT 1
    `;

    db.query(storeQuery, [storeId], (err, storeResults) => {
        if (err) {
            console.error("Store dashboard error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        if (!storeResults || storeResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        const store = storeResults[0];

        const reviewQuery = `
            SELECT
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS user_name,
                u.email AS user_email
            FROM reviews r
            INNER JOIN users u
                ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
        `;

        db.query(reviewQuery, [storeId], (err, reviews) => {
            if (err) {
                console.error("Reviews error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Could not fetch reviews",
                    error: err.message
                });
            }

            const averageQuery = `
                SELECT
                    COUNT(*) AS totalReviews,
                    COALESCE(AVG(rating), 0) AS averageRating
                FROM reviews
                WHERE store_id = ?
            `;

            db.query(
                averageQuery,
                [storeId],
                (err, stats) => {
                    if (err) {
                        console.error("Statistics error:", err);

                        return res.status(500).json({
                            success: false,
                            message:
                                "Could not fetch statistics",
                            error: err.message
                        });
                    }

                    const totalReviews =
                        Number(stats[0].totalReviews) || 0;

                    const averageRating =
                        Number(
                            Number(
                                stats[0].averageRating
                            ).toFixed(2)
                        ) || 0;

                    const distributionQuery = `
                        SELECT
                            ROUND(rating) AS rating,
                            COUNT(*) AS count
                        FROM reviews
                        WHERE store_id = ?
                        GROUP BY ROUND(rating)
                    `;

                    db.query(
                        distributionQuery,
                        [storeId],
                        (err, distribution) => {
                            if (err) {
                                console.error(
                                    "Distribution error:",
                                    err
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Could not fetch rating distribution",
                                    error: err.message
                                });
                            }

                            return res.status(200).json({
                                success: true,

                                store: store,

                                statistics: {
                                    totalReviews,
                                    averageRating
                                },

                                distribution: distribution || [],

                                reviews: reviews || []
                            });
                        }
                    );
                }
            );
        });
    });
});

// =====================================================
// SUBMIT STORE RATING + REVIEW
// =====================================================

app.post("/api/stores/:id/rating", (req, res) => {
    const storeId = req.params.id;

    const {
        rating,
        userId,
        comment
    } = req.body || {};

    if (
        rating === undefined ||
        rating === null ||
        rating === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "Rating is required"
        });
    }

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    const numericRating = Number(rating);

    if (
        Number.isNaN(numericRating) ||
        numericRating < 0 ||
        numericRating > 5
    ) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 0 and 5"
        });
    }

    if ((numericRating * 2) % 1 !== 0) {
        return res.status(400).json({
            success: false,
            message: "Rating must be in increments of 0.5"
        });
    }

    db.query(
        "SELECT id FROM stores WHERE id = ? LIMIT 1",
        [storeId],
        (err, storeResults) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            if (!storeResults || storeResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Store not found"
                });
            }

            // Check user
            db.query(
                "SELECT id FROM users WHERE id = ? LIMIT 1",
                [userId],
                (err, userResults) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error",
                            error: err.message
                        });
                    }

                    if (!userResults || userResults.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "User not found"
                        });
                    }

                    const reviewQuery = `
                        INSERT INTO reviews
                        (user_id, store_id, rating, comment)
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        reviewQuery,
                        [
                            userId,
                            storeId,
                            numericRating,
                            comment ? String(comment).trim() : null
                        ],
                        (err, result) => {
                            if (err) {
                                console.error(
                                    "Review insert error:",
                                    err
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Could not submit review",
                                    error: err.message
                                });
                            }

                            const averageQuery = `
                                SELECT
                                    AVG(rating) AS averageRating
                                FROM reviews
                                WHERE store_id = ?
                            `;

                            db.query(
                                averageQuery,
                                [storeId],
                                (err, avgResults) => {
                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message:
                                                "Review saved but average could not be calculated",
                                            error: err.message
                                        });
                                    }

                                    const average =
                                        Number(
                                            Number(
                                                avgResults[0]
                                                    .averageRating
                                            ).toFixed(1)
                                        ) || 0;

                                    const updateStoreQuery = `
                                        UPDATE stores
                                        SET rating = ?
                                        WHERE id = ?
                                    `;

                                    db.query(
                                        updateStoreQuery,
                                        [
                                            average,
                                            storeId
                                        ],
                                        (err) => {
                                            if (err) {
                                                console.error(
                                                    "Store rating update error:",
                                                    err
                                                );

                                                return res.status(500).json({
                                                    success: false,
                                                    message:
                                                        "Review saved but store rating could not be updated",
                                                    error:
                                                        err.message
                                                });
                                            }

                                            return res.status(201).json({
                                                success: true,
                                                message:
                                                    "Rating submitted successfully",
                                                rating: average,
                                                reviewId:
                                                    result.insertId
                                            });
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// =====================================================
// CHANGE STORE MANAGER PASSWORD
// =====================================================

app.put(
    "/api/store-managers/:storeId/password",
    async (req, res) => {
        try {
            const storeId = req.params.storeId;

            const {
                currentPassword,
                newPassword
            } = req.body || {};

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Current password and new password are required"
                });
            }

            if (String(newPassword).length < 6) {
                return res.status(400).json({
                    success: false,
                    message:
                        "New password must contain at least 6 characters"
                });
            }

            db.query(
                "SELECT password FROM stores WHERE id = ? LIMIT 1",
                [storeId],
                async (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Database error",
                            error: err.message
                        });
                    }

                    if (!results || results.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "Store not found"
                        });
                    }

                    const store = results[0];

                    if (!store.password) {
                        return res.status(400).json({
                            success: false,
                            message:
                                "Store password is not configured. Use the set-password endpoint first."
                        });
                    }

                    try {
                        const passwordMatch =
                            await bcrypt.compare(
                                String(currentPassword),
                                String(store.password)
                            );

                        if (!passwordMatch) {
                            return res.status(401).json({
                                success: false,
                                message:
                                    "Current password is incorrect"
                            });
                        }

                        const hashedPassword =
                            await bcrypt.hash(
                                String(newPassword),
                                10
                            );

                        db.query(
                            `
                            UPDATE stores
                            SET password = ?
                            WHERE id = ?
                            `,
                            [
                                hashedPassword,
                                storeId
                            ],
                            (err) => {
                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "Could not change password",
                                        error: err.message
                                    });
                                }

                                return res.status(200).json({
                                    success: true,
                                    message:
                                        "Password changed successfully"
                                });
                            }
                        );

                    } catch (error) {
                        console.error(error);

                        return res.status(500).json({
                            success: false,
                            message: "Password change error"
                        });
                    }
                }
            );

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);

// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

app.get("/api/admin/stats", (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM stores) AS totalStores,
            (SELECT COUNT(*) FROM reviews) AS totalReviews
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Admin stats error:", err);

            return res.status(500).json({
                success: false,
                message:
                    "Could not get dashboard statistics",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            totalUsers: Number(results[0].totalUsers),
            totalStores: Number(results[0].totalStores),
            totalReviews: Number(results[0].totalReviews)
        });
    });
});

// =====================================================
// DELETE USER
// =====================================================

app.delete("/api/users/:id", (req, res) => {
    db.query(
        "DELETE FROM users WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Delete user error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Could not delete user",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        }
    );
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message:
            `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("Express error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// =====================================================
// START SERVER
// =====================================================

const server = app.listen(PORT, HOST, () => {
    console.log("----------------------------------------");
    console.log("RateMyStore Backend");
    console.log(`Server: http://${HOST}:${PORT}`);
    console.log("Server running successfully...");
    console.log("----------------------------------------");
});

// =====================================================
// SERVER ERROR
// =====================================================

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(
            `Port ${PORT} is already in use.`
        );
        return;
    }

    console.error("SERVER ERROR:", error);
});

// =====================================================
// NODE ERROR HANDLERS
// =====================================================

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:", error);
});