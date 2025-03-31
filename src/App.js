import React from "react";
import SideBar from "./components/SideBar"
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./styles.css";
function App() {
  return (
    <div className="app-container">
      <SideBar></SideBar>
      <main className="main-content">
        <h1>Günlük Görevler</h1>
        <TaskForm />
        <TaskList />
      </main>
    </div>
  )
  }
export default App;
