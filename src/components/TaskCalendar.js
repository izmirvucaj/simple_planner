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

  // Verileri backend'den çekme fonksiyonu
  const fetchNotes = () => {
    axios.get("http://localhost:5001/tasks")
      .then(response => {
        console.log("Fetched tasks:", response.data);
        const tasks = response.data.reduce((acc, task) => {
          // Tarih formatını "YYYY-MM-DD" formatına çevir
          const formattedDate = new Date(task.due_date).toISOString().split("T")[0];
          acc[formattedDate] = task.note;
          return acc;
        }, {});
        console.log("Updated notes:", tasks); // Güncellenen notes
        setNotes(tasks);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  };

  // Component mount olduğunda verileri çek
  useEffect(() => {
    fetchNotes(); // Sayfa yüklendiğinde verileri al
  }, []); // Boş array, sadece ilk render'da çalışır

  // Tarih seçildiğinde
  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setNoteText(notes[formattedDate] || "");
    setModalVisible(true);

    if (notes[formattedDate]) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // Notu kaydet
  const saveNote = () => {
    if (noteText.trim()) {
      if (isEditing) {
        axios.post("http://localhost:5001/tasks", {
          note: noteText,
          due_date: selectedDate, // Zaten YYYY-MM-DD formatında olduğu için burada herhangi bir işlem gerekmez
        })
          .then(() => {
            fetchNotes(); // Yeni veriyi çek
            setModalVisible(false);
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("Error saving note:", error);
          });
      } else {
        axios.put(`http://localhost:5001/tasks/${selectedDate}`, {
          note: noteText,
        })
          .then(() => {
            fetchNotes(); // Yeni veriyi çek
            setModalVisible(false);
          })
          .catch((error) => {
            console.error("Error updating note:", error);
          });
      }
    }
  };

  // Notu sil
  const deleteNote = () => {
    axios.delete(`http://localhost:5001/tasks/${selectedDate}`)
      .then(() => {
        fetchNotes(); // Yeni veriyi çek
        setModalVisible(false);
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
      });
  };

  // Düzenleme modunu aç
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Takvim hücrelerinde not varsa göster
  const cellRender = (value) => {
    const note = notes[value.format("YYYY-MM-DD")];
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
        title={`${selectedDate || ""} `}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          !isEditing && hasNote ? (
            <Button key="edit" type="primary" onClick={enableEditing}>
              Update
            </Button>
          ) : (
            <Button key="save" type="primary" onClick={saveNote}>
              {hasNote ? "Kaydet" : "Ekle"}
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
          placeholder="Bugün için notunuzu girin..."
          disabled={!isEditing && hasNote} // Not varsa ve düzenleme modunda değilse disabled
          autoFocus={isEditing} // Sadece düzenleme modunda odaklansın
        />
      </Modal>
    </div>
  );
}

export default TaskCalendar;
