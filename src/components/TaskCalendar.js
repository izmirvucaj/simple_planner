import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Input, Button } from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import "./TaskCalendar.css";

function TaskCalendar() {
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Helper function to format date as YYYY-MM-DD (timezone-safe)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch notes from backend
  const fetchNotes = () => {
    axios.get("http://localhost:5001/tasks")
      .then(response => {
        const tasks = response.data.reduce((acc, task) => {
          // Use the helper function to ensure consistent date format
          const formattedDate = formatDate(task.due_date);
          acc[formattedDate] = task.note;
          return acc;
        }, {});
        setNotes(tasks);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle date selection
  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setNoteText(notes[formattedDate] || "");
    setModalVisible(true);
    setIsEditing(!notes[formattedDate]);
  };

  // Save or update note
  const saveNote = () => {
    if (!noteText.trim() || !selectedDate) return;

    const payload = {
      note: noteText,
      due_date: selectedDate // Already in YYYY-MM-DD format
    };

    const request = notes[selectedDate] 
      ? axios.put(`http://localhost:5001/tasks/${selectedDate}`, payload)
      : axios.post("http://localhost:5001/tasks", payload);

    request
      .then(() => {
        fetchNotes();
        setModalVisible(false);
        setIsEditing(false);
      })
      .catch(error => {
        console.error("Error saving note:", error);
      });
  };

  // Delete note
  const deleteNote = () => {
    axios.delete(`http://localhost:5001/tasks/${selectedDate}`)
      .then(() => {
        fetchNotes();
        setModalVisible(false);
      })
      .catch(error => {
        console.error("Error deleting note:", error);
      });
  };

  // Calendar cell renderer
  const cellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const note = notes[dateStr];
    return note ? (
      <div>
        <Badge color="green" />
        <div className="note-preview">{note.substring(0, 10)}...</div>
      </div>
    ) : null;
  };

  const hasNote = selectedDate && notes[selectedDate];

  return (
    <div className="task-calendar-container">
      <h2>📅 Calendar</h2>
      <Calendar onSelect={onSelect} cellRender={cellRender} />

      <Modal
        title={`${selectedDate || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          !isEditing && hasNote ? (
            <Button key="edit" type="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button key="save" type="primary" onClick={saveNote}>
              {hasNote ? "Update" : "Add"}
            </Button>
          ),
          hasNote && (
            <Button key="delete" danger onClick={deleteNote}>
              Delete
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note for today..."
          disabled={!isEditing && hasNote}
          autoFocus={isEditing}
        />
      </Modal>
    </div>
  );
}

export default TaskCalendar;