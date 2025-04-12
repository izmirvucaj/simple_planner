import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Input, Button, List } from "antd";
import axios from "axios";
import "antd/dist/reset.css";
import "./TaskCalendar.css";

function TaskCalendar() {
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchNotes = () => {
    axios.get("http://localhost:5001/tasks")
      .then(response => {
        const tasksByDate = response.data.reduce((acc, task) => {
          const formattedDate = formatDate(task.due_date);
          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          acc[formattedDate].push({
            id: task.id,
            note: task.note,
            due_date: task.due_date
          });
          return acc;
        }, {});
        setNotes(tasksByDate);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setModalVisible(true);
    setIsEditing(false);
    setEditingNoteId(null);
    setNoteText("");
  };

  const saveNote = () => {
    if (!noteText.trim() || !selectedDate) return;

    const payload = {
      note: noteText,
      due_date: selectedDate
    };

    const request = editingNoteId
      ? axios.put(`http://localhost:5001/tasks/${editingNoteId}`, payload)
      : axios.post("http://localhost:5001/tasks", payload);

    request
      .then(() => {
        fetchNotes();
        setModalVisible(false);
        setIsEditing(false);
        setEditingNoteId(null);
        setNoteText("");
      })
      .catch(error => {
        console.error("Error saving note:", error);
      });
  };

  const deleteNote = (noteId) => {
    axios.delete(`http://localhost:5001/tasks/${noteId}`)
      .then(() => {
        fetchNotes();
      })
      .catch(error => {
        console.error("Error deleting note:", error);
      });
  };

  const editNote = (note) => {
    setNoteText(note.note);
    setIsEditing(true);
    setEditingNoteId(note.id);
  };

  const cellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dateNotes = notes[dateStr] || [];
    return dateNotes.length > 0 ? (
      <div className="note-preview-container">
        <Badge count={dateNotes.length} color="green" />
        <div className="note-preview">{dateNotes.length} note(s)</div>
      </div>
    ) : null;
  };

  const dateNotes = selectedDate ? notes[selectedDate] || [] : [];

  return (
    <div className="task-calendar-container">
      <h2 className="calendar-header">📅 Calendar</h2>
      <div className="calendar-wrapper">
        <Calendar onSelect={onSelect} cellRender={cellRender} />
      </div>

      <Modal
        className="notes-modal"
        title={`Notes for ${selectedDate || ""}`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setIsEditing(false);
          setEditingNoteId(null);
          setNoteText("");
        }}
        footer={null}
        width={800}
      >
        <div className="notes-content">
          <div className="existing-notes-section">
            <h3 className="section-title">Existing Notes</h3>
            {dateNotes.length > 0 ? (
              <List
                className="notes-list"
                itemLayout="horizontal"
                dataSource={dateNotes}
                renderItem={(note) => (
                  <List.Item className="note-item">
                    <List.Item.Meta
                      description={<div className="note-content">{note.note}</div>}
                    />
                    <div className="note-actions">
                      <Button type="link" onClick={() => editNote(note)} className="edit-button">
                        Edit
                      </Button>
                      <Button type="link" danger onClick={() => deleteNote(note.id)} className="delete-button">
                        Delete
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className="empty-notes">
                No notes for this date
              </div>
            )}
          </div>

          <div className="add-note-section">
            <h3 className="section-title">{editingNoteId ? "Edit Note" : "Add New Note"}</h3>
            <Input.TextArea
              className="note-input"
              rows={8}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              autoFocus
            />
            <div className="action-buttons">
              <Button type="primary" onClick={saveNote} className="save-button">
                {editingNoteId ? "Update" : "Add"}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setIsEditing(false);
                setEditingNoteId(null);
                setNoteText("");
              }} className="cancel-button">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskCalendar;