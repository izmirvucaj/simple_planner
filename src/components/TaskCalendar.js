import React, { useState } from "react";
import { Calendar, Badge, Modal, Input, Button } from "antd";
import "antd/dist/reset.css";
import "./TaskCalendar.css";

function TaskCalendar() {
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Tarih seçildiğinde
  const onSelect = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    setNoteText(notes[formattedDate] || "");
    setModalVisible(true);
    
    // Eğer bu tarihte not varsa, direkt düzenleme modunda olmasın
    if (notes[formattedDate]) {
      setIsEditing(false); // Önce sadece "Güncelle" butonu gözüksün
    } else {
      setIsEditing(true); // Yeni not için direkt yazılabilsin
    }
  };

  // Notu kaydet
  const saveNote = () => {
    if (noteText.trim()) {
      setNotes({ ...notes, [selectedDate]: noteText });
    }
    setModalVisible(false);
    setIsEditing(false);
  };

  // Notu sil
  const deleteNote = () => {
    const newNotes = { ...notes };
    delete newNotes[selectedDate];
    setNotes(newNotes);
    setModalVisible(false);
  };

  // Düzenleme modunu aç
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Takvim hücrelerinde not varsa göster
  const dateCellRender = (value) => {
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
      <Calendar onSelect={onSelect} dateCellRender={dateCellRender} />

      
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