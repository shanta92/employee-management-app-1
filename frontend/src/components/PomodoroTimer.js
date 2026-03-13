import React, { useState, useEffect, useRef, useCallback } from 'react';
import GamificationPanel from './GamificationPanel';
import PomodoroStats from './PomodoroStats';
import { loadData, completePomodoro } from '../pomodoroStorage';

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60;   // 5 minutes
const LONG_BREAK = 15 * 60;   // 15 minutes
const POMODOROS_BEFORE_LONG_BREAK = 4;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [pomodoroData, setPomodoroData] = useState(loadData());
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('timer'); // 'timer' | 'stats'
  const intervalRef = useRef(null);

  const getDuration = useCallback((m) => {
    if (m === 'shortBreak') return SHORT_BREAK;
    if (m === 'longBreak') return LONG_BREAK;
    return WORK_DURATION;
  }, []);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handlePomodoroComplete = useCallback(() => {
    const { data, newAchievements } = completePomodoro();
    setPomodoroData(data);
    const newCount = pomodoroCount + 1;
    setPomodoroCount(newCount);

    if (newAchievements.length > 0) {
      showNotification(`🏅 Achievement unlocked!`);
    } else {
      showNotification(`✅ Pomodoro #${data.totalCompleted} complete! +25 XP`);
    }

    // Determine next break type
    if (newCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
      setMode('longBreak');
      setTimeLeft(LONG_BREAK);
    } else {
      setMode('shortBreak');
      setTimeLeft(SHORT_BREAK);
    }
    setIsRunning(false);
  }, [pomodoroCount, showNotification]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (mode === 'work') {
            handlePomodoroComplete();
          } else {
            setMode('work');
            setTimeLeft(WORK_DURATION);
            setIsRunning(false);
            showNotification('☕ Break over! Ready for the next Pomodoro?');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, handlePomodoroComplete, showNotification]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };
  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('shortBreak');
      setTimeLeft(SHORT_BREAK);
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }
  };

  const modeLabels = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const timerProgress = 1 - timeLeft / getDuration(mode);

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-tabs">
        <button
          className={`pomodoro-tab ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          🍅 Timer
        </button>
        <button
          className={`pomodoro-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
      </div>

      {notification && (
        <div className="pomodoro-notification">{notification}</div>
      )}

      {activeTab === 'timer' ? (
        <>
          <div className={`timer-card timer-${mode}`}>
            <div className="timer-mode-label">{modeLabels[mode]}</div>
            <div className="timer-display" data-testid="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-progress-bar">
              <div
                className="timer-progress-fill"
                style={{ width: `${timerProgress * 100}%` }}
              />
            </div>
            <div className="timer-controls">
              {!isRunning ? (
                <button className="btn btn-primary btn-timer" onClick={handleStart}>
                  ▶ Start
                </button>
              ) : (
                <button className="btn btn-secondary btn-timer" onClick={handlePause}>
                  ⏸ Pause
                </button>
              )}
              <button className="btn btn-secondary btn-timer" onClick={handleReset}>
                ↺ Reset
              </button>
              <button className="btn btn-secondary btn-timer" onClick={handleSkip}>
                ⏭ Skip
              </button>
            </div>
            <div className="timer-session-info">
              Session {(pomodoroCount % POMODOROS_BEFORE_LONG_BREAK) + 1} of {POMODOROS_BEFORE_LONG_BREAK}
            </div>
          </div>

          <GamificationPanel data={pomodoroData} />
        </>
      ) : (
        <PomodoroStats data={pomodoroData} />
      )}
    </div>
  );
}

export { formatTime, WORK_DURATION, SHORT_BREAK, LONG_BREAK };
