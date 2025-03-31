import React from "react";
import "./TaskList.css"; // Stil dosyasını ekledik

function TaskList() {
  const tasks = [
    { id: 1, title: "React çalış", completed: false },
    { id: 2, title: "Spor yap", completed: true },
  ];

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
