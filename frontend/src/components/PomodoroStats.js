import React, { useState } from 'react';
import { getStats, getConsecutiveDays, getWeeklyCount } from '../pomodoroStorage';

export default function PomodoroStats({ data }) {
  const [view, setView] = useState('weekly'); // 'weekly' | 'monthly'
  const { weeklyData, monthlyData } = getStats(data.sessions);
  const chartData = view === 'weekly' ? weeklyData : monthlyData;
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const streak = getConsecutiveDays(data.sessions);
  const weeklyCount = getWeeklyCount(data.sessions);

  return (
    <div className="pomodoro-stats">
      <div className="stats-overview">
        <div className="overview-card">
          <div className="overview-value">{data.totalCompleted}</div>
          <div className="overview-label">Total Pomodoros</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{streak}</div>
          <div className="overview-label">Day Streak</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{weeklyCount}</div>
          <div className="overview-label">This Week</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{Math.round(data.totalCompleted * 25 / 60)}h</div>
          <div className="overview-label">Focus Time</div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3>{view === 'weekly' ? 'Last 7 Days' : 'Last 4 Weeks'}</h3>
          <div className="chart-toggle">
            <button
              className={`btn btn-sm ${view === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('weekly')}
            >
              Weekly
            </button>
            <button
              className={`btn btn-sm ${view === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="bar-chart" data-testid="bar-chart">
          {chartData.map((d, i) => (
            <div key={i} className="bar-group">
              <div className="bar-value">{d.count}</div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ height: `${(d.count / maxCount) * 100}%` }}
                />
              </div>
              <div className="bar-label">{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
