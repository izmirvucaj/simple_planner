import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskList.css"; // Stil dosyasını ekledik

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Backend'den görevleri çekme
    axios
      .get("http://localhost:5001/tasks")
      .then((response) => {
        // Veriyi düzenle
        const updatedTasks = response.data.map((task) => ({
          ...task,
          completed: task.completed === 1, // 0 veya 1'den boolean'a dönüşüm
        }));
        setTasks(updatedTasks); // Veriyi state'e al
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  return (
    <div className="task-list">
      <h2>Bugünün Görevleri</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <strong>{task.title}</strong>
            {task.note && <p className="note">{task.note}</p>} {/* Notu göster */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
