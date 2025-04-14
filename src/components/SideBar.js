import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SideBar.css";

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white p-4" style={{ width: "250px" }}>
      <h2 className="text-center mb-4">Planlayıcı</h2>
      <ul className="list-unstyled">
        <li className="sidebar-item p-3 rounded">
          <Link to="/calendar" className="text-white text-decoration-none">
            📅 Calendar
          </Link>
        </li>
        <li className="sidebar-item p-3 rounded">
          <Link to="/" className="text-white text-decoration-none">
            📋 Notes
          </Link>
        </li>
        <li className="sidebar-item p-3 rounded">
          <Link to="/pomodoro" className="text-white text-decoration-none">
          ⏱️ Pomodoro
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
