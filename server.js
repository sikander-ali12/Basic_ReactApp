const express = require('express');
const mysql = require('mysql2');
const cors = require('cors')
const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
const db = mysql.createConnection({
    host: "sql.freedb.tech",
    user: 'freedb_sikander',
    password: '6vc64FdH2kue&$g',
    database: 'freedb_sikander'
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.post('/', (req, res) => {
    const { name, email, password } = req.headers;
    const sql = "INSERT INTO users (name, email, pass) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, password], (err, result) => {
        
        if (err) return res.json(err);

        return res.json({ success: true, message: "User registered successfully" });
    });
});

app.listen(8081, () => {
    console.log("listening");
})