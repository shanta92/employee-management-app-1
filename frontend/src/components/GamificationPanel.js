import React from 'react';
import { calculateLevel, ACHIEVEMENTS } from '../pomodoroStorage';

export default function GamificationPanel({ data }) {
  const { level, currentXp, xpToNext } = calculateLevel(data.xp);
  const xpProgress = xpToNext > 0 ? (currentXp / xpToNext) * 100 : 0;

  return (
    <div className="gamification-panel">
      <div className="xp-section">
        <div className="level-badge">
          <span className="level-number">Lv. {level}</span>
        </div>
        <div className="xp-info">
          <div className="xp-label">
            <span>{data.xp} XP total</span>
            <span>{currentXp} / {xpToNext} XP to next level</span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <div className="stat-value">{data.totalCompleted}</div>
          <div className="stat-label">Total Pomodoros</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{data.unlockedAchievements.length}</div>
          <div className="stat-label">Achievements</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{level}</div>
          <div className="stat-label">Level</div>
        </div>
      </div>

      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map(a => {
            const unlocked = data.unlockedAchievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
                title={a.description}
              >
                <span className="achievement-icon">{a.icon}</span>
                <span className="achievement-name">{a.name}</span>
                {unlocked && <span className="achievement-check">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
