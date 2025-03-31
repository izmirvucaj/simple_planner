import React from "react";
import "./SideBar.css"; // Stil dosyasını ekledik

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Planlayıcı</h2>
      <ul>
        <li>📅 Takvim</li>
        <li>⏳ Pomodoro</li>
        <li>📊 İstatistikler</li>
      </ul>
    </div>
  );
}

export default Sidebar;
