import React, { useState } from "react";
import { Calendar, Badge, Modal, Input, Button } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css"; // Ant Design stilleri

function TaskCalendar() {
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Tarih değiştiğinde
  const onSelect = (date) => {
    setSelectedDate(date);
    setNoteText(notes[date.format("YYYY-MM-DD")] || ""); // Seçilen tarihin notunu al
    setModalVisible(true);
  };

  // Notu kaydet
  const saveNote = () => {
    if (noteText.trim()) {
      setNotes({ ...notes, [selectedDate.format("YYYY-MM-DD")]: noteText });
    }
    setModalVisible(false);
  };

  // Takvimde tarih hücresini özelleştirme
  const dateCellRender = (value) => {
    const note = notes[value.format("YYYY-MM-DD")];
    return note ? (
      <div>
        <Badge color="green" />
        <div className="note-preview">{note.substring(0, 10)}...</div>
      </div>
    ) : null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Takvim</h2>
      <Calendar onSelect={onSelect} dateCellRender={dateCellRender} />

      {/* Modal (Not Ekleme) */}
      <Modal
        title={`${selectedDate ? selectedDate.format("YYYY-MM-DD") : ""} İçin Not`}
        open={modalVisible}
        onOk={saveNote}
        onCancel={() => setModalVisible(false)}
      >
        <Input.TextArea
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Bugün için notunuzu girin..."
        />
      </Modal>
    </div>
  );
}

export default TaskCalendar;
