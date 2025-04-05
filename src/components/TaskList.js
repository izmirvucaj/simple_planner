import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskList.css"; // Stil dosyasını ekledik

function TaskList() {
  // State oluşturuyoruz
  const [tasks, setTasks] = useState([]);
  
  // Veriyi backend'ten almak için useEffect kullanıyoruz
  useEffect(() => {
    axios.get("http://localhost:5000/tasks") // Backend API URL
      .then((response) => {
        setTasks(response.data); // Veriyi state'e kaydediyoruz
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error); // Hata kontrolü
      });
  }, []); // Component mount olduğunda bir kez çalışacak

  return (
    <div className="task-list">
      <h2>Bugünün Görevleri</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
