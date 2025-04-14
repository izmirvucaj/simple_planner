import React, { useState, useEffect, useRef } from "react";
import { Button, Progress, Typography, Card, Slider, Alert, notification } from "antd";
import { PlayCircleFilled, PauseCircleFilled, RedoOutlined, SettingOutlined } from "@ant-design/icons";
import "./Pomodoro.css";

const { Title, Text } = Typography;

const Pomodoro = () => {
  // Configurable timers
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  
  // Timer state
  const [time, setTime] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef(null);

  // Calculate progress and time
  const currentMaxTime = isWorkSession ? workDuration * 60 : 
                        (completedSessions % sessionsBeforeLongBreak === 0 && completedSessions > 0) ? 
                        longBreakDuration * 60 : breakDuration * 60;
  const progressPercent = (time / currentMaxTime) * 100;
  const isLongBreak = !isWorkSession && (completedSessions % sessionsBeforeLongBreak === 0 && completedSessions > 0);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (isWorkSession) {
        setCompletedSessions(prev => prev + 1);
        playSound();
        notification.success({
          message: 'Work Session Completed!',
          description: 'Time for a break!',
          duration: 3
        });
      } else {
        playSound();
        notification.info({
          message: 'Break Time Over!',
          description: 'Time to get back to work!',
          duration: 3
        });
      }
      
      setIsWorkSession(!isWorkSession);
      setTime(!isWorkSession ? workDuration * 60 : 
             (completedSessions % sessionsBeforeLongBreak === 0) ? longBreakDuration * 60 : breakDuration * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isWorkSession, workDuration, breakDuration, longBreakDuration, completedSessions, sessionsBeforeLongBreak]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTime(workDuration * 60);
    setCompletedSessions(0);
  };

  const skipSession = () => {
    setIsWorkSession(!isWorkSession);
    setTime(!isWorkSession ? workDuration * 60 : 
           (completedSessions % sessionsBeforeLongBreak === 0) ? longBreakDuration * 60 : breakDuration * 60);
    if (isWorkSession) {
      setCompletedSessions(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSettingsChange = () => {
    resetTimer();
    setShowSettings(false);
  };

  return (
    <div className="pomodoro-container">
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />
      
      <Card className="pomodoro-card">
        <div className="session-info">
          <Title level={2} className="session-title">
            {isWorkSession ? "Focus Time" : isLongBreak ? "Long Break" : "Short Break"}
          </Title>
          <Text type="secondary">
            Session {completedSessions + 1} • {isWorkSession ? "Focus" : "Break"} {Math.floor(completedSessions / sessionsBeforeLongBreak) + 1}
          </Text>
        </div>

        <Progress
          type="circle"
          percent={progressPercent}
          format={() => formatTime(time)}
          strokeColor={isWorkSession ? "#ff4d4f" : isLongBreak ? "#52c41a" : "#1890ff"}
          width={250}
          strokeWidth={10}
          className="progress-circle"
        />

        <div className="controls">
          <Button 
            type="primary" 
            icon={isRunning ? <PauseCircleFilled /> : <PlayCircleFilled />} 
            onClick={toggleTimer}
            className="control-button"
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button 
            icon={<RedoOutlined />} 
            onClick={resetTimer}
            className="control-button"
          >
            Reset
          </Button>
          <Button 
            onClick={skipSession}
            className="control-button"
          >
            Skip
          </Button>
          <Button 
            icon={<SettingOutlined />} 
            onClick={() => setShowSettings(!showSettings)}
            className="settings-button"
          />
        </div>

        {showSettings && (
          <Card className="settings-card">
            <Title level={4} className="settings-title">Timer Settings</Title>
            
            <div className="setting-item">
              <Text>Work Duration: {workDuration} min</Text>
              <Slider 
                min={5} 
                max={60} 
                value={workDuration} 
                onChange={setWorkDuration}
                tooltip={{ formatter: value => `${value} min` }}
              />
            </div>

            <div className="setting-item">
              <Text>Short Break: {breakDuration} min</Text>
              <Slider 
                min={1} 
                max={15} 
                value={breakDuration} 
                onChange={setBreakDuration}
                tooltip={{ formatter: value => `${value} min` }}
              />
            </div>

            <div className="setting-item">
              <Text>Long Break: {longBreakDuration} min</Text>
              <Slider 
                min={5} 
                max={30} 
                value={longBreakDuration} 
                onChange={setLongBreakDuration}
                tooltip={{ formatter: value => `${value} min` }}
              />
            </div>

            <div className="setting-item">
              <Text>Sessions before long break: {sessionsBeforeLongBreak}</Text>
              <Slider 
                min={1} 
                max={8} 
                value={sessionsBeforeLongBreak} 
                onChange={setSessionsBeforeLongBreak}
                tooltip={{ formatter: value => `${value} sessions` }}
              />
            </div>

            <Button type="primary" onClick={handleSettingsChange} block>
              Apply Settings
            </Button>
          </Card>
        )}

        {isLongBreak && !isWorkSession && (
          <Alert 
            message="Enjoy your long break!" 
            type="success" 
            showIcon 
            className="break-alert"
          />
        )}
      </Card>
    </div>
  );
};

export default Pomodoro;