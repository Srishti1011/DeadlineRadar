import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calculateDayScore,
  calculateWeeklyWorkload,
  generateWorkloadInsights,
  getWorkloadLevel
} from './workloadUtils';

const task = (overrides = {}) => ({
  dueDate: '2025-01-08',
  completed: false,
  priority: 'medium',
  category: 'Assignment',
  estimatedHours: 2,
  subjectName: 'Biology',
  title: 'Review',
  ...overrides
});

describe('workload utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 6, 10, 0));
  });

  it('scores pending tasks by priority, category, and capped estimated hours', () => {
    expect(calculateDayScore([])).toBe(0);
    expect(calculateDayScore([task({ completed: true })])).toBe(0);
    expect(calculateDayScore([task()])).toBe(2.5);
    expect(calculateDayScore([task({
      priority: 'high',
      category: 'Examination',
      estimatedHours: 40
    })])).toBe(11);
    expect(calculateDayScore([task({
      priority: 'low',
      category: 'Project',
      estimatedHours: 1
      })])).toBe(2.7);
  });

  it('maps workload scores to the expected levels', () => {
    expect(getWorkloadLevel(0, 0).level).toBe('Rest');
    expect(getWorkloadLevel(3.5, 1).level).toBe('Light');
    expect(getWorkloadLevel(7.5, 1).level).toBe('Moderate');
    expect(getWorkloadLevel(11.5, 1).level).toBe('Heavy');
    expect(getWorkloadLevel(11.6, 1).level).toBe('Critical');
    expect(getWorkloadLevel(5, 0).level).toBe('Rest');
  });

  it('calculates daily pending and completed totals and selects the peak day', () => {
    const result = calculateWeeklyWorkload([
      task({ dueDate: '2025-01-08', priority: 'high', category: 'Examination', estimatedHours: 4 }),
      task({ dueDate: '2025-01-08', completed: true }),
      task({ dueDate: '2025-01-10', priority: 'low', estimatedHours: 1 })
    ], new Date(2025, 0, 8));

    expect(result.daysData).toHaveLength(7);
    expect(result.daysData[2]).toMatchObject({
      dateStr: '2025-01-08',
      pendingCount: 1,
      completedCount: 1,
      totalCount: 2
    });
    expect(result.peakDay.dateStr).toBe('2025-01-08');
    expect(result.hasCritical).toBe(false);
    expect(result.hasHeavy).toBe(true);
  });

  it('returns no peak for an empty week and marks a critical day', () => {
    const empty = calculateWeeklyWorkload([], new Date(2025, 0, 8));
    expect(empty.peakDay).toBeNull();
    expect(empty.maxScore).toBe(-1);
    expect(empty.hasCritical).toBe(false);

    const critical = calculateWeeklyWorkload(
      Array.from({ length: 3 }, () => task({
        dueDate: '2025-01-08',
        priority: 'high',
        category: 'Examination',
        estimatedHours: 8
      })),
      new Date(2025, 0, 8)
    );
    expect(critical.hasCritical).toBe(true);
    expect(critical.peakDay.workloadLevel).toBe('Critical');
  });

  it('generates overdue, peak-day, deadline-cluster, and subject workload insights', () => {
    const tasks = [
      task({ title: 'Late paper', dueDate: '2025-01-05' }),
      ...Array.from({ length: 3 }, (_, index) => task({
        title: `Exam ${index + 1}`,
        dueDate: '2025-01-08',
        priority: 'high',
        category: 'Examination',
        estimatedHours: 8
      })),
      task({ title: 'Another exam', dueDate: '2025-01-09', priority: 'high', category: 'Examination', estimatedHours: 8 })
    ];
    const insights = generateWorkloadInsights(tasks);

    expect(insights.map((insight) => insight.id)).toEqual(expect.arrayContaining([
      'overdue-alert',
      'peak-day',
      'cluster-insight',
      'subject-burden',
      'momentum-low'
    ]));
    expect(insights.find((insight) => insight.id === 'overdue-alert').description)
      .toContain('1 overdue task');
    expect(insights.find((insight) => insight.id === 'cluster-insight').description)
      .toContain('4 deadlines clustered');
  });

  it('reports safe workload and high completion momentum without task data', () => {
    expect(generateWorkloadInsights([])).toEqual([]);
    const insights = generateWorkloadInsights([
      task({ title: 'Done 1', completed: true }),
      task({ title: 'Done 2', completed: true }),
      task({ title: 'Still pending', dueDate: '2025-01-08' })
    ]);
    expect(insights.find((insight) => insight.id === 'peak-day').type).toBe('info');
    expect(insights.find((insight) => insight.id === 'momentum-good').description)
      .toContain('67% (2/3)');
  });
});
