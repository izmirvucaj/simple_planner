import React, { useState, useEffect } from "react";
import { Button, Progress, Typography } from "antd";

const { Title } = Typography;
const WORK_TIME = 25 * 60; // 25 dakika
const BREAK_TIME = 5 * 60; // 5 dakika

const Pomodoro = () => {
  const [time, setTime] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsWorkSession(!isWorkSession);
      setTime(isWorkSession ? BREAK_TIME : WORK_TIME);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isWorkSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTime(WORK_TIME);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Title>{isWorkSession ? "Pomodoro" : "Break Time"}</Title>
      <Progress
        type="circle"
        percent={(time / (isWorkSession ? WORK_TIME : BREAK_TIME)) * 100}
        format={() => formatTime(time)}
      />
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" onClick={toggleTimer} style={{ marginRight: "10px" }}>
          {isRunning ? "Cancel" : "Start"}
        </Button>
        <Button onClick={resetTimer} danger>
          Restart
        </Button>
      </div>
    </div>
  );
};

export default Pomodoro;