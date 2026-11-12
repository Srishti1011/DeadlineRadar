import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  addDays,
  formatDisplayDate,
  formatTime,
  getDaysDiff,
  getMonday,
  getMonthGrid,
  getRelativeDeadline,
  getTodayISO,
  getWeekDays,
  isTaskDueToday,
  isTaskDueWithinDays,
  isTaskOverdue
} from './dateUtils';

describe('date utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 1, 10, 15, 0));
  });

  it('formats dates in each supported display format', () => {
    expect(formatDisplayDate('2024-02-09')).toBe('Feb 9, 2024');
    expect(formatDisplayDate('2024-02-09', 'MMMM DD, YYYY')).toBe('February 9, 2024');
    expect(formatDisplayDate('2024-02-09', 'DD/MM/YYYY')).toBe('09/02/2024');
    expect(formatDisplayDate('2024-02-09', 'YYYY-MM-DD')).toBe('2024-02-09');
    expect(formatDisplayDate('')).toBe('');
  });

  it('adds calendar days across month and year boundaries', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2024-12-31', 1)).toBe('2025-01-01');
    expect(addDays('2024-01-01', -1)).toBe('2023-12-31');
  });

  it('calculates whole-day differences from the supplied base date', () => {
    expect(getDaysDiff('2024-02-12', '2024-02-10')).toBe(2);
    expect(getDaysDiff('2024-02-09', '2024-02-10')).toBe(-1);
    expect(getDaysDiff('not-a-date', '2024-02-10')).toBeNaN();
  });

  it('identifies overdue deadlines, including time-of-day on today', () => {
    expect(isTaskOverdue({ dueDate: '2024-02-09', completed: false })).toBe(true);
    expect(isTaskOverdue({ dueDate: '2024-02-10', dueTime: '14:59', completed: false })).toBe(true);
    expect(isTaskOverdue({ dueDate: '2024-02-10', dueTime: '15:01', completed: false })).toBe(false);
    expect(isTaskOverdue({ dueDate: '2024-02-10', completed: false })).toBe(false);
    expect(isTaskOverdue({ dueDate: '2024-02-09', completed: true })).toBe(false);
    expect(isTaskOverdue({ completed: false })).toBe(false);
  });

  it('recognizes due-today and due-within-days tasks but excludes completed or invalid dates', () => {
    expect(isTaskDueToday({ dueDate: '2024-02-10', completed: false })).toBe(true);
    expect(isTaskDueToday({ dueDate: '2024-02-10', completed: true })).toBe(false);
    expect(isTaskDueWithinDays({ dueDate: '2024-02-17', completed: false })).toBe(true);
    expect(isTaskDueWithinDays({ dueDate: '2024-02-18', completed: false })).toBe(false);
    expect(isTaskDueWithinDays({ dueDate: '2024-02-09', completed: false })).toBe(false);
    expect(isTaskDueWithinDays({ dueDate: 'invalid', completed: false })).toBe(false);
    expect(isTaskDueWithinDays({ dueDate: '2024-02-11', completed: true })).toBe(false);
  });

  it('formats 24-hour times and leaves missing times empty', () => {
    expect(formatTime('00:05')).toBe('12:05 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('14:30')).toBe('2:30 PM');
    expect(formatTime()).toBe('');
  });

  it('returns the correct relative deadline status for completed, past, near, and later tasks', () => {
    expect(getRelativeDeadline({ completed: true }).label).toBe('Completed');
    expect(getRelativeDeadline({ dueDate: '2024-02-09', completed: false }).label).toBe('Overdue by 1d');
    expect(getRelativeDeadline({ dueDate: '2024-02-10', completed: false }).label).toBe('Due today');
    expect(getRelativeDeadline({ dueDate: '2024-02-11', completed: false }).label).toBe('Due tomorrow');
    expect(getRelativeDeadline({ dueDate: '2024-02-13', completed: false }).label).toBe('Due in 3 days');
    expect(getRelativeDeadline({ dueDate: '2024-02-20', completed: false }).label).toBe('Feb 20, 2024');
  });

  it('returns the Monday of a week, including when given a Sunday', () => {
    expect(getMonday(new Date(2024, 1, 10))).toEqual(new Date(2024, 1, 5));
    expect(getMonday(new Date(2024, 1, 11))).toEqual(new Date(2024, 1, 5));
  });

  it('builds a Monday-to-Sunday week and marks today', () => {
    const days = getWeekDays(new Date(2024, 1, 7));
    expect(days).toHaveLength(7);
    expect(days[0].dateStr).toBe('2024-02-05');
    expect(days[6].dateStr).toBe('2024-02-11');
    expect(days.find((day) => day.isToday).dateStr).toBe(getTodayISO());
  });

  it('builds a month grid with Monday-first padding and leap days', () => {
    const days = getMonthGrid(2024, 1);
    expect(days).toHaveLength(35);
    expect(days[0]).toMatchObject({ dateStr: '2024-01-29', isCurrentMonth: false });
    expect(days.find((day) => day.dateStr === '2024-02-29')).toMatchObject({
      dayNumber: 29,
      isCurrentMonth: true
    });
    expect(days[days.length - 1].dateStr).toBe('2024-03-03');
  });
});
