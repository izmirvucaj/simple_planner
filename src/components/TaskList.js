import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskList.css";

function TaskList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayNotes = () => {
      axios.get("http://localhost:5001/tasks")
        .then((response) => {
          const today = new Date();
          // Get date in local timezone (not UTC)
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          // Filter notes for today
          const todayNotes = response.data
            .filter(task => {
              // Parse the task date in local timezone
              const taskDate = new Date(task.due_date);
              const taskDateStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
              return taskDateStr === todayStr && task.note;
            })
            .map(task => ({
              id: task.id,
              content: task.note,
              date: task.due_date
            }));

          setNotes(todayNotes);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setLoading(false);
        });
    };

    fetchTodayNotes();
  }, []);

  return (
    <div className="task-list">
      <h2>Bugünün Notları</h2>
      
      {loading ? (
        <p>Notlar yükleniyor...</p>
      ) : notes.length === 0 ? (
        <p>Bugün için kayıtlı not bulunamadı</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <div className="note-content">
                {note.content}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;