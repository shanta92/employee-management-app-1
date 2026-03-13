import {
  calculateLevel,
  getConsecutiveDays,
  getWeeklyCount,
  checkAchievements,
  completePomodoro,
  getStats,
  loadData,
  saveData,
  getDefaultData,
  XP_PER_POMODORO,
  ACHIEVEMENTS,
} from './pomodoroStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('calculateLevel', () => {
  test('returns level 1 for 0 XP', () => {
    const result = calculateLevel(0);
    expect(result).toEqual({ level: 1, currentXp: 0, xpToNext: 100 });
  });

  test('returns level 1 for 50 XP', () => {
    const result = calculateLevel(50);
    expect(result).toEqual({ level: 1, currentXp: 50, xpToNext: 100 });
  });

  test('returns level 2 for 100 XP', () => {
    const result = calculateLevel(100);
    expect(result).toEqual({ level: 2, currentXp: 0, xpToNext: 200 });
  });

  test('returns level 2 for 250 XP', () => {
    const result = calculateLevel(250);
    expect(result).toEqual({ level: 2, currentXp: 150, xpToNext: 200 });
  });

  test('returns level 3 for 300 XP', () => {
    const result = calculateLevel(300);
    expect(result).toEqual({ level: 3, currentXp: 0, xpToNext: 300 });
  });
});

describe('loadData and saveData', () => {
  test('loadData returns default data when nothing saved', () => {
    const data = loadData();
    expect(data.xp).toBe(0);
    expect(data.totalCompleted).toBe(0);
    expect(data.sessions).toEqual([]);
    expect(data.unlockedAchievements).toEqual([]);
  });

  test('saveData and loadData round-trip', () => {
    const data = { xp: 100, totalCompleted: 4, sessions: [], unlockedAchievements: ['first_pomodoro'] };
    saveData(data);
    const loaded = loadData();
    expect(loaded.xp).toBe(100);
    expect(loaded.totalCompleted).toBe(4);
    expect(loaded.unlockedAchievements).toContain('first_pomodoro');
  });

  test('loadData handles corrupted localStorage', () => {
    localStorage.setItem('pomodoro_data', 'not json');
    const data = loadData();
    expect(data.xp).toBe(0);
    expect(data.totalCompleted).toBe(0);
  });
});

describe('completePomodoro', () => {
  test('increments XP and totalCompleted', () => {
    const { data } = completePomodoro();
    expect(data.xp).toBe(XP_PER_POMODORO);
    expect(data.totalCompleted).toBe(1);
    expect(data.sessions).toHaveLength(1);
  });

  test('unlocks first_pomodoro achievement on first completion', () => {
    const { newAchievements } = completePomodoro();
    expect(newAchievements).toContain('first_pomodoro');
  });

  test('accumulates XP over multiple completions', () => {
    completePomodoro();
    completePomodoro();
    const { data } = completePomodoro();
    expect(data.xp).toBe(XP_PER_POMODORO * 3);
    expect(data.totalCompleted).toBe(3);
  });

  test('unlocks five_pomodoros achievement after 5 completions', () => {
    for (let i = 0; i < 4; i++) completePomodoro();
    const { newAchievements } = completePomodoro();
    expect(newAchievements).toContain('five_pomodoros');
  });

  test('does not re-unlock already unlocked achievements', () => {
    const { newAchievements: first } = completePomodoro();
    expect(first).toContain('first_pomodoro');
    const { newAchievements: second } = completePomodoro();
    expect(second).not.toContain('first_pomodoro');
  });
});

describe('getConsecutiveDays', () => {
  test('returns 0 for empty sessions', () => {
    expect(getConsecutiveDays([])).toBe(0);
  });

  test('returns 1 for sessions today', () => {
    const sessions = [{ completedAt: new Date().toISOString() }];
    expect(getConsecutiveDays(sessions)).toBe(1);
  });

  test('returns 3 for three consecutive days', () => {
    const today = new Date();
    const sessions = [
      { completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString() },
      { completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString() },
      { completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString() },
    ];
    expect(getConsecutiveDays(sessions)).toBe(3);
  });

  test('returns 1 when streak is broken', () => {
    const today = new Date();
    const sessions = [
      { completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString() },
      // skip a day
      { completedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString() },
    ];
    expect(getConsecutiveDays(sessions)).toBe(1);
  });
});

describe('getWeeklyCount', () => {
  test('returns 0 for empty sessions', () => {
    expect(getWeeklyCount([])).toBe(0);
  });

  test('counts sessions from this week', () => {
    const sessions = [
      { completedAt: new Date().toISOString() },
      { completedAt: new Date().toISOString() },
    ];
    expect(getWeeklyCount(sessions)).toBe(2);
  });

  test('excludes sessions from last month', () => {
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 1);
    const sessions = [
      { completedAt: new Date().toISOString() },
      { completedAt: oldDate.toISOString() },
    ];
    expect(getWeeklyCount(sessions)).toBe(1);
  });
});

describe('getStats', () => {
  test('returns weekly and monthly data', () => {
    const sessions = [
      { completedAt: new Date().toISOString() },
    ];
    const stats = getStats(sessions);
    expect(stats.weeklyData).toHaveLength(7);
    expect(stats.monthlyData).toHaveLength(4);
  });

  test('weeklyData has correct structure', () => {
    const stats = getStats([]);
    stats.weeklyData.forEach(d => {
      expect(d).toHaveProperty('label');
      expect(d).toHaveProperty('count');
      expect(typeof d.count).toBe('number');
    });
  });

  test('monthlyData has correct structure', () => {
    const stats = getStats([]);
    stats.monthlyData.forEach(d => {
      expect(d).toHaveProperty('label');
      expect(d).toHaveProperty('count');
      expect(typeof d.count).toBe('number');
    });
  });
});

describe('checkAchievements', () => {
  test('returns empty array when no achievements earned', () => {
    const data = getDefaultData();
    expect(checkAchievements(data)).toEqual([]);
  });

  test('returns first_pomodoro when totalCompleted is 1', () => {
    const data = { ...getDefaultData(), totalCompleted: 1, xp: 25 };
    const achievements = checkAchievements(data);
    expect(achievements).toContain('first_pomodoro');
  });

  test('does not return already unlocked achievements', () => {
    const data = {
      ...getDefaultData(),
      totalCompleted: 1,
      xp: 25,
      unlockedAchievements: ['first_pomodoro'],
    };
    const achievements = checkAchievements(data);
    expect(achievements).not.toContain('first_pomodoro');
  });
});

describe('ACHIEVEMENTS', () => {
  test('all achievements have required fields', () => {
    ACHIEVEMENTS.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('name');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('icon');
    });
  });

  test('all achievement IDs are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
