import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PomodoroTimer, { formatTime, WORK_DURATION, SHORT_BREAK } from './PomodoroTimer';

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('formatTime', () => {
  test('formats 0 seconds', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  test('formats 25 minutes', () => {
    expect(formatTime(25 * 60)).toBe('25:00');
  });

  test('formats 5 minutes and 30 seconds', () => {
    expect(formatTime(5 * 60 + 30)).toBe('05:30');
  });

  test('formats single digit seconds', () => {
    expect(formatTime(65)).toBe('01:05');
  });
});

describe('PomodoroTimer', () => {
  test('renders initial timer display with 25:00', () => {
    render(<PomodoroTimer />);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00');
  });

  test('renders Focus Time label', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
  });

  test('renders start button', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('▶ Start')).toBeInTheDocument();
  });

  test('renders reset and skip buttons', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('↺ Reset')).toBeInTheDocument();
    expect(screen.getByText('⏭ Skip')).toBeInTheDocument();
  });

  test('shows Pause button when started', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByText('▶ Start'));
    expect(screen.getByText('⏸ Pause')).toBeInTheDocument();
  });

  test('timer decrements when started', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByText('▶ Start'));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('timer-display')).toHaveTextContent('24:55');
  });

  test('reset returns timer to initial value', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByText('▶ Start'));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    fireEvent.click(screen.getByText('⏸ Pause'));
    fireEvent.click(screen.getByText('↺ Reset'));
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00');
  });

  test('skip changes from work to break mode', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByText('⏭ Skip'));
    expect(screen.getByText('Short Break')).toBeInTheDocument();
  });

  test('skip changes from break to work mode', () => {
    render(<PomodoroTimer />);
    // First skip: work -> break
    fireEvent.click(screen.getByText('⏭ Skip'));
    expect(screen.getByText('Short Break')).toBeInTheDocument();
    // Second skip: break -> work
    fireEvent.click(screen.getByText('⏭ Skip'));
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
  });

  test('renders timer and statistics tabs', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText(/Timer/)).toBeInTheDocument();
    expect(screen.getByText(/Statistics/)).toBeInTheDocument();
  });

  test('switching to statistics tab shows stats view', () => {
    render(<PomodoroTimer />);
    fireEvent.click(screen.getByText(/Statistics/));
    expect(screen.getByText('Total Pomodoros')).toBeInTheDocument();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
  });

  test('renders gamification panel with level and achievements', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText(/Lv\. 1/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Achievements' })).toBeInTheDocument();
  });

  test('shows XP info', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText('0 XP total')).toBeInTheDocument();
  });

  test('session info shows current session', () => {
    render(<PomodoroTimer />);
    expect(screen.getByText(/Session 1 of 4/)).toBeInTheDocument();
  });
});
