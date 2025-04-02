require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(require("cors")());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "planner_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/", (req, res) => {
  res.send("Planner API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
