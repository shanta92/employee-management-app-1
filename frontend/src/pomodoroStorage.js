const STORAGE_KEY = 'pomodoro_data';

const XP_PER_POMODORO = 25;

const ACHIEVEMENTS = [
  { id: 'first_pomodoro', name: 'First Step', description: 'Complete your first Pomodoro', icon: '🎯' },
  { id: 'five_pomodoros', name: 'Getting Started', description: 'Complete 5 Pomodoros', icon: '🔥' },
  { id: 'ten_pomodoros', name: 'Focused Mind', description: 'Complete 10 Pomodoros', icon: '🧠' },
  { id: 'twenty_five_pomodoros', name: 'Quarter Century', description: 'Complete 25 Pomodoros', icon: '💪' },
  { id: 'fifty_pomodoros', name: 'Half Century', description: 'Complete 50 Pomodoros', icon: '⭐' },
  { id: 'hundred_pomodoros', name: 'Centurion', description: 'Complete 100 Pomodoros', icon: '🏆' },
  { id: 'three_day_streak', name: 'Consistency', description: 'Complete Pomodoros 3 consecutive days', icon: '📅' },
  { id: 'seven_day_streak', name: 'Week Warrior', description: 'Complete Pomodoros 7 consecutive days', icon: '🗓️' },
  { id: 'ten_weekly', name: 'Productive Week', description: 'Complete 10 Pomodoros in a week', icon: '📈' },
  { id: 'level_five', name: 'Rising Star', description: 'Reach Level 5', icon: '🌟' },
  { id: 'level_ten', name: 'Pomodoro Master', description: 'Reach Level 10', icon: '👑' },
];

function getDefaultData() {
  return {
    xp: 0,
    totalCompleted: 0,
    sessions: [],
    unlockedAchievements: [],
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data = JSON.parse(raw);
    return {
      ...getDefaultData(),
      ...data,
    };
  } catch {
    return getDefaultData();
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateLevel(xp) {
  // Each level requires (level * 100) XP
  // Level 1: 0-99 XP, Level 2: 100-299 XP, Level 3: 300-599 XP, etc.
  let level = 1;
  let xpNeeded = 100;
  let remaining = xp;
  while (remaining >= xpNeeded) {
    remaining -= xpNeeded;
    level++;
    xpNeeded = level * 100;
  }
  return { level, currentXp: remaining, xpToNext: xpNeeded };
}

function getConsecutiveDays(sessions) {
  if (sessions.length === 0) return 0;

  const uniqueDays = [...new Set(
    sessions.map(s => {
      const d = new Date(s.completedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  )].sort().reverse();

  if (uniqueDays.length === 0) return 0;

  // Check if the most recent day is today or yesterday
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  if (uniqueDays[0] !== todayKey && uniqueDays[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    // Parse dates and check consecutive
    const [y1, m1, d1] = uniqueDays[i - 1].split('-').map(Number);
    const [y2, m2, d2] = uniqueDays[i].split('-').map(Number);
    const date1 = new Date(y1, m1, d1);
    const date2 = new Date(y2, m2, d2);
    const diffDays = (date1 - date2) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getWeeklyCount(sessions) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return sessions.filter(s => new Date(s.completedAt) >= startOfWeek).length;
}

function checkAchievements(data) {
  const newAchievements = [];
  const { totalCompleted, sessions, unlockedAchievements } = data;
  const { level } = calculateLevel(data.xp);
  const streak = getConsecutiveDays(sessions);
  const weeklyCount = getWeeklyCount(sessions);

  const checks = [
    { id: 'first_pomodoro', condition: totalCompleted >= 1 },
    { id: 'five_pomodoros', condition: totalCompleted >= 5 },
    { id: 'ten_pomodoros', condition: totalCompleted >= 10 },
    { id: 'twenty_five_pomodoros', condition: totalCompleted >= 25 },
    { id: 'fifty_pomodoros', condition: totalCompleted >= 50 },
    { id: 'hundred_pomodoros', condition: totalCompleted >= 100 },
    { id: 'three_day_streak', condition: streak >= 3 },
    { id: 'seven_day_streak', condition: streak >= 7 },
    { id: 'ten_weekly', condition: weeklyCount >= 10 },
    { id: 'level_five', condition: level >= 5 },
    { id: 'level_ten', condition: level >= 10 },
  ];

  for (const { id, condition } of checks) {
    if (condition && !unlockedAchievements.includes(id)) {
      newAchievements.push(id);
    }
  }

  return newAchievements;
}

function completePomodoro() {
  const data = loadData();
  data.xp += XP_PER_POMODORO;
  data.totalCompleted += 1;
  data.sessions.push({ completedAt: new Date().toISOString() });

  const newAchievements = checkAchievements(data);
  data.unlockedAchievements = [...data.unlockedAchievements, ...newAchievements];

  saveData(data);
  return { data, newAchievements };
}

function getStats(sessions) {
  const now = new Date();

  // Weekly stats: last 7 days
  const weeklyData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const count = sessions.filter(s => {
      const sd = new Date(s.completedAt);
      return `${sd.getFullYear()}-${sd.getMonth()}-${sd.getDate()}` === dayKey;
    }).length;
    weeklyData.push({ label: dayNames[d.getDay()], count });
  }

  // Monthly stats: last 4 weeks
  const monthlyData = [];
  for (let i = 3; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);
    weekEnd.setHours(23, 59, 59, 999);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    const count = sessions.filter(s => {
      const sd = new Date(s.completedAt);
      return sd >= weekStart && sd <= weekEnd;
    }).length;
    const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    monthlyData.push({ label, count });
  }

  return { weeklyData, monthlyData };
}

export {
  ACHIEVEMENTS,
  XP_PER_POMODORO,
  loadData,
  saveData,
  calculateLevel,
  getConsecutiveDays,
  getWeeklyCount,
  checkAchievements,
  completePomodoro,
  getStats,
  getDefaultData,
};
