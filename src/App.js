import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import TaskList from "./components/TaskList";
import TaskCalendar from "./components/TaskCalendar"; // Takvim bileşenini doğru içe aktardık
import "./styles.css";
import Pomodoro from "./components/Pomodoro";

function App() {
  return (
    <Router>
      <div className="app-container">
        
        <Sidebar />
        
      
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/calendar" element={<TaskCalendar />} />
            <Route path="/pomodoro" element={<Pomodoro />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
