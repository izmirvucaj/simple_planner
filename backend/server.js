// Server.js veya app.js

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Izmiri13",
  database: "planner_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// API endpoint for fetching tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching tasks");
      return;
    }
    res.json(results); // Returning the tasks as a JSON response
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
