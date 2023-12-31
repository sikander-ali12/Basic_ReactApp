const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
    host: "sql.freedb.tech",
    user: 'freedb_sikander',
    password: '6vc64FdH2kue&$g',
    database: 'freedb_sikander',
    connectionLimit: 10, // Adjust as needed
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Example of handling database connection errors more gracefully
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        // Handle the error gracefully, for example, by terminating the application
        process.exit(1);
    }

    console.log('Connected to the database');

    // Release the connection back to the pool after use
    connection.release();
});

app.get('/users', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return next(err);
        }

        const sql = "SELECT * FROM users";

        connection.query(sql, (err, data) => {
            connection.release();

            if (err) {
                return next(err);
            }

            return res.json(data);
        });
    });
});

app.post('/', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return next(err);
        }

        const { name, email, password } = req.headers;
        const sql = "INSERT INTO users (name, email, pass) VALUES (?, ?, ?)";

        connection.query(sql, [name, email, password], (err, result) => {
            connection.release();

            if (err) {
                return next(err);
            }

            return res.json({ success: true, message: "User registered successfully" });
        });
    });
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log("Server started at port:", port);
});
