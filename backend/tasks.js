const express = require("express");
const router = express.Router();
const db = require("./db"); // Veritabanı bağlantısını import et

// Yeni bir görev ekleme
router.post("/tasks", (req, res) => {
  const { title, description, due_date, completed } = req.body;
  
  const query = `INSERT INTO tasks (title, description, due_date, completed) 
                 VALUES ('${title}', '${description}', '${due_date}', ${completed})`;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Veritabanına görev eklenirken hata oluştu" });
    }
    res.status(201).json({ message: "Görev başarıyla eklendi", id: result.insertId });
  });
});

// Tüm görevleri listeleme
router.get("/tasks", (req, res) => {
  const query = "SELECT * FROM tasks";
  
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Görevler alınırken hata oluştu" });
    }
    res.status(200).json(result);
  });
});

module.exports = router;
