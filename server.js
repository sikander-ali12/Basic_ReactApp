const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "sql.freedb.tech",
    user: 'freedb_sikander',
    password: '6vc64FdH2kue&$g',
    database: 'freedb_sikander'
});

// Handle connection error more gracefully
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        // Handle the error gracefully, for example, by terminating the application
        process.exit(1);
    }
    console.log('Connected to the database');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            // Call the error handling middleware
            return next(err);
        }
        return res.json(data);
    });
});

app.post('/', (req, res) => {
    const { name, email, password } = req.headers;
    const sql = "INSERT INTO users (name, email, pass) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            // Call the error handling middleware
            return next(err);
        }

        return res.json({ success: true, message: "User registered successfully" });
    });
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log("Server started at port:", port);
});
