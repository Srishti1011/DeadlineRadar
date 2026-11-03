import { getDaysDiff, getTodayISO, getWeekDays, isTaskOverdue } from './dateUtils';

/**
 * Calculates a numerical score for a day's academic workload
 * Based on pending tasks, their priority, category, and estimated hours
 */
export const calculateDayScore = (tasksForDay) => {
  const pendingTasks = tasksForDay.filter(t => !t.completed);
  if (pendingTasks.length === 0) return 0;

  let totalScore = 0;

  pendingTasks.forEach(task => {
    // Priority weights
    let priorityWeight = 1.5;
    if (task.priority === 'high') priorityWeight = 3.5;
    else if (task.priority === 'medium') priorityWeight = 2.0;

    // Category intensity multiplier
    let categoryMultiplier = 1.0;
    if (task.category === 'Examination') categoryMultiplier = 2.0;
    else if (task.category === 'Lab Evaluation' || task.category === 'Project') categoryMultiplier = 1.6;
    else if (task.category === 'Presentation' || task.category === 'Quiz') categoryMultiplier = 1.3;

    // Hours impact (capped at 4 bonus points)
    const hoursBonus = Math.min(Number(task.estimatedHours || 2) * 0.25, 4);

    totalScore += (priorityWeight * categoryMultiplier) + hoursBonus;
  });

  return Math.round(totalScore * 10) / 10;
};

/**
 * Maps score to visual workload level
 */
export const getWorkloadLevel = (score, taskCount) => {
  if (taskCount === 0 || score === 0) {
    return {
      level: 'Rest',
      label: 'Clear Day',
      color: '#10B981', // Emerald
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      barColor: 'from-emerald-400 to-teal-500',
      description: 'No academic deadlines scheduled.'
    };
  }

  if (score <= 3.5) {
    return {
      level: 'Light',
      label: 'Light Workload',
      color: '#3B82F6', // Blue
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      barColor: 'from-blue-400 to-indigo-500',
      description: 'Manageable tasks, low stress window.'
    };
  }

  if (score <= 7.5) {
    return {
      level: 'Moderate',
      label: 'Moderate Workload',
      color: '#8B5CF6', // Purple/Violet
      badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      barColor: 'from-violet-400 to-purple-600',
      description: 'Steady workload; allocate 3-4 hours of focused study.'
    };
  }

  if (score <= 11.5) {
    return {
      level: 'Heavy',
      label: 'Heavy Workload',
      color: '#F59E0B', // Amber
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      barColor: 'from-amber-400 to-orange-500',
      description: 'Demanding day. Prioritize high-impact items early.'
    };
  }

  return {
    level: 'Critical',
    label: 'Critical Peak',
    color: '#F43F5E', // Rose/Coral
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse-subtle',
    barColor: 'from-rose-500 to-red-600',
    description: 'Multiple high-stakes deadlines. Immediate workload redistribution advised.'
  };
};

/**
 * Calculates complete weekly workload statistics for Monday-Sunday
 */
export const calculateWeeklyWorkload = (tasks, baseDate = new Date()) => {
  const weekDays = getWeekDays(baseDate);

  const daysData = weekDays.map(day => {
    const tasksForDay = tasks.filter(t => t.dueDate === day.dateStr);
    const pendingTasks = tasksForDay.filter(t => !t.completed);
    const completedTasks = tasksForDay.filter(t => t.completed);
    const score = calculateDayScore(tasksForDay);
    const workloadInfo = getWorkloadLevel(score, pendingTasks.length);

    return {
      ...day,
      tasks: tasksForDay,
      pendingCount: pendingTasks.length,
      completedCount: completedTasks.length,
      totalCount: tasksForDay.length,
      score,
      workloadLevel: workloadInfo.level,
      workloadInfo
    };
  });

  // Find peak day among days with pending tasks
  let peakDay = null;
  let maxScore = -1;

  daysData.forEach(day => {
    if (day.score > maxScore && day.pendingCount > 0) {
      maxScore = day.score;
      peakDay = day;
    }
  });

  const hasCritical = daysData.some(d => d.workloadLevel === 'Critical');
  const hasHeavy = daysData.some(d => d.workloadLevel === 'Heavy');

  return {
    daysData,
    peakDay,
    maxScore,
    hasCritical,
    hasHeavy
  };
};

/**
 * Generates dynamic, realistic natural language insights grounded in actual task data
 */
export const generateWorkloadInsights = (tasks, subjects = []) => {
  const insights = [];
  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = tasks.filter(isTaskOverdue);
  const today = getTodayISO();

  // 1. Overdue Alert
  if (overdueTasks.length > 0) {
    insights.push({
      id: 'overdue-alert',
      type: 'warning',
      title: 'Overdue Attention Required',
      description: `You have ${overdueTasks.length} overdue ${overdueTasks.length === 1 ? 'task' : 'tasks'} (${overdueTasks.map(t => t.title).slice(0, 2).join(', ')}${overdueTasks.length > 2 ? '...' : ''}). Clear these before tackling new assignments.`,
      action: 'view-overdue'
    });
  }

  // 2. Weekly Peak Insight
  const weekly = calculateWeeklyWorkload(tasks);
  if (weekly.peakDay && weekly.peakDay.pendingCount > 0) {
    if (weekly.peakDay.workloadLevel === 'Critical' || weekly.peakDay.workloadLevel === 'Heavy') {
      insights.push({
        id: 'peak-day',
        type: 'critical',
        title: `Workload Peaks on ${weekly.peakDay.fullDayName}`,
        description: `Your academic schedule peaks on ${weekly.peakDay.fullDayName} with ${weekly.peakDay.pendingCount} pending deadlines totaling a load score of ${weekly.peakDay.score}. Consider starting preparatory drafts 2 days ahead.`,
        action: 'view-peak'
      });
    } else {
      insights.push({
        id: 'peak-day',
        type: 'info',
        title: `Busiest Day: ${weekly.peakDay.fullDayName}`,
        description: `${weekly.peakDay.fullDayName} has ${weekly.peakDay.pendingCount} deliverables scheduled. It is well within safe thresholds.`,
        action: 'view-peak'
      });
    }
  }

  // 3. Clustered Deadlines Analysis
  // Check clusters across 3-day windows
  const daysWithDeadlines = {};
  pendingTasks.forEach(t => {
    if (!t.dueDate) return;
    const diff = getDaysDiff(t.dueDate);
    if (diff >= 0 && diff <= 10) {
      daysWithDeadlines[t.dueDate] = (daysWithDeadlines[t.dueDate] || 0) + 1;
    }
  });

  const datesSorted = Object.keys(daysWithDeadlines).sort();
  let maxClusterCount = 0;
  let clusterStart = null;
  let clusterEnd = null;

  for (let i = 0; i < datesSorted.length; i++) {
    let clusterTotal = 0;
    const base = datesSorted[i];
    for (let j = i; j < datesSorted.length; j++) {
      const dDiff = getDaysDiff(datesSorted[j], base);
      if (dDiff <= 2) {
        clusterTotal += daysWithDeadlines[datesSorted[j]];
        if (clusterTotal > maxClusterCount) {
          maxClusterCount = clusterTotal;
          clusterStart = base;
          clusterEnd = datesSorted[j];
        }
      }
    }
  }

  if (maxClusterCount >= 3 && clusterStart) {
    const startDay = new Date(clusterStart + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    const endDay = new Date(clusterEnd + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    insights.push({
      id: 'cluster-insight',
      type: 'warning',
      title: 'Clustered Academic Deadlines',
      description: `You have ${maxClusterCount} deadlines clustered between ${startDay} and ${endDay}. Distribute revision hours ahead of time to avoid last-minute rush.`,
      action: 'view-cluster'
    });
  }

  // 4. Subject Burden Analysis
  const subjectPendingMap = {};
  pendingTasks.forEach(t => {
    const subName = t.subjectName || 'Unassigned';
    subjectPendingMap[subName] = (subjectPendingMap[subName] || 0) + 1;
  });

  let topSubject = null;
  let maxSubjectCount = 0;
  Object.entries(subjectPendingMap).forEach(([sub, count]) => {
    if (count > maxSubjectCount) {
      maxSubjectCount = count;
      topSubject = sub;
    }
  });

  if (topSubject && maxSubjectCount >= 2) {
    insights.push({
      id: 'subject-burden',
      type: 'info',
      title: `Subject Concentration: ${topSubject}`,
      description: `${topSubject} currently holds your highest pending workload with ${maxSubjectCount} unfinished academic obligations.`,
      action: 'view-subject'
    });
  }

  // 5. Completion Momentum
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const rate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (rate >= 60) {
    insights.push({
      id: 'momentum-good',
      type: 'success',
      title: 'High Velocity Completion Rate',
      description: `You have completed ${rate}% (${completedCount}/${totalCount}) of tracked academic tasks. Excellent pacing heading into upcoming submissions.`,
      action: 'view-analytics'
    });
  } else if (totalCount > 4 && rate < 30) {
    insights.push({
      id: 'momentum-low',
      type: 'neutral',
      title: 'Pacing Check',
      description: `Currently at ${rate}% completion rate. Prioritize quick-turnaround quizzes or short assignments to build momentum.`,
      action: 'view-tasks'
    });
  }

  return insights;
};
