const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "planner_db",
});

db.connect((err) => {
  if (err) {
    console.error("Veritabanı bağlantısı başarısız: " + err.stack);
    return;
  }
  console.log("Veritabanına bağlanıldı.");
});

module.exports = db;
