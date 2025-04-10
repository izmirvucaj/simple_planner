// server.js (backend kısmı)
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Izmiri13", // kendi şifrenizle değiştirin
  database: "planner_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// API endpoint for getting tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching tasks");
      return;
    }
    res.json(results); // Returning the tasks as a JSON response
  });
});

// API endpoint for adding tasks
// POST endpoint'inde
// API endpoint for adding tasks
app.post("/tasks", (req, res) => {
  const { note, due_date } = req.body;
  
  // Tarih formatını kontrol et
  const formattedDate = new Date(due_date).toISOString().split("T")[0]; // YYYY-MM-DD formatına çevir

  db.query(
    "INSERT INTO tasks (note, due_date) VALUES (?, ?)",
    [note, formattedDate], // Formatlanmış tarihi gönder
    (err, results) => {
      if (err) {
        res.status(500).send("Error adding task");
        return;
      }
      res.status(201).send("Task added successfully");
    }
  );
});


// PUT endpoint'inde
app.put("/tasks/:date", (req, res) => {
  const { note } = req.body;
  const { date } = req.params;
  
  // Tarih formatını doğru şekilde işle
  const formattedDate = new Date(date); // Tarihi Date objesi olarak al
  
  db.query(
    "UPDATE tasks SET note = ?, due_date = ? WHERE due_date = ?",
    [note, formattedDate, date], // Eski tarihe göre güncelleme
    (err, results) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).send("Error updating task");
      }
      res.status(200).send("Task updated successfully");
    }
  );
});





// API endpoint for updating tasks
app.put("/tasks/:id", (req, res) => {
  const { note, due_date } = req.body; // due_date burada
  const taskId = req.params.id;

  db.query(
    "UPDATE tasks SET note = ?, due_date = ? WHERE id = ?",
    [note, due_date, taskId], // yeni tarih ve not
    (err, results) => {
      if (err) {
        res.status(500).send("Error updating task");
        return;
      }
      res.send("Task updated successfully");
    }
  );
});

// API endpoint for deleting tasks
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) {
      res.status(500).send("Error deleting task");
      return;
    }
    res.send("Task deleted successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
