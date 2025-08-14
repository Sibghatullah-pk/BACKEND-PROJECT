const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('better-sqlite3')("database.db");
const bcrypt = require('bcrypt');

db.pragma("journal_mode = WAL");

// Database setup
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.locals.errors = [];
    next();
});

app.get("/", (req, res) => {
    res.render("homepage");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {
    const errors = [];

    // Validate input types
    if (typeof req.body.username !== 'string') req.body.username = '';
    if (typeof req.body.password !== 'string') req.body.password = '';

    // Trim
    req.body.username = req.body.username.trim();
    req.body.password = req.body.password.trim();

    // Username validation
    if (req.body.username === '') {
        errors.push("Username is required");
    } else if (!/^[a-zA-Z0-9_]+$/.test(req.body.username)) {
        errors.push("Username can only contain letters, numbers, and underscores");
    } else if (req.body.username.length < 3) {
        errors.push("Username must be at least 3 characters");
    }

    // Password validation
    if (req.body.password === '') {
        errors.push("Password is required");
    } else if (req.body.password.length < 6) {
        errors.push("Password must be at least 6 characters");
    } else if (!/[a-zA-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)) {
        errors.push("Password must contain at least one letter and one number");
    }

    if (errors.length > 0) {
        return res.render("homepage", { errors });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Insert into DB
    const result = db.prepare(`
        INSERT INTO users (username, password) VALUES (?, ?)
    `).run(req.body.username, hashedPassword);

    // JWT token
    const token = jwt.sign(
        { id: result.lastInsertRowid, username: req.body.username },
        process.env.JWTSECRET,
        { expiresIn: '1h' }
    );

    // Set cookie
    res.cookie("ourCookie", token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.send("Registration successful");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
