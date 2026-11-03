import React from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useTaskContext } from '../context/TaskContext';
import { StatCard } from '../components/StatCard';
import { WorkloadRadar } from '../components/WorkloadRadar';
import { TaskCard } from '../components/TaskCard';
import { isTaskOverdue, isTaskDueToday, getDaysDiff, formatDisplayDate, formatTime } from '../utils/dateUtils';

export const Dashboard = () => {
  const {
    tasks,
    subjects,
    settings,
    pendingTasksCount,
    completedTasksCount,
    overdueTasksCount,
    dueThisWeekCount,
    setActivePage,
    openAddTaskModal,
    openTaskDetail,
    toggleTaskComplete
  } = useTaskContext();

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  let greetingTime = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) greetingTime = 'Good afternoon';
  else if (currentHour >= 17) greetingTime = 'Good evening';

  // Dynamic contextual message
  let contextualMessage = `You have ${pendingTasksCount} upcoming academic deadlines. Let's stay ahead.`;
  if (overdueTasksCount > 0) {
    contextualMessage = `Notice: ${overdueTasksCount} overdue ${overdueTasksCount === 1 ? 'task requires' : 'tasks require'} immediate attention.`;
  } else if (pendingTasksCount === 0) {
    contextualMessage = 'All academic tasks are clear! Take a well-deserved break.';
  } else if (dueThisWeekCount > 5) {
    contextualMessage = `High intensity week: ${dueThisWeekCount} deadlines due within the next 7 days. Plan your study blocks.`;
  }

  // Today's Focus tasks:
  // Incomplete tasks that are: Overdue OR Due Today OR High Priority due in next 2 days
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const focusTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      // 1. Overdue first
      const aOverdue = isTaskOverdue(a) ? 1 : 0;
      const bOverdue = isTaskOverdue(b) ? 1 : 0;
      if (bOverdue !== aOverdue) return bOverdue - aOverdue;

      // 2. Deadline proximity
      const aDiff = getDaysDiff(a.dueDate);
      const bDiff = getDaysDiff(b.dueDate);
      if (aDiff !== bDiff) return aDiff - bDiff;

      // 3. Priority
      return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
    })
    .slice(0, 4);

  // Upcoming Deadlines (next 5-7 tasks)
  const upcomingDeadlines = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const aDiff = getDaysDiff(a.dueDate);
      const bDiff = getDaysDiff(b.dueDate);
      return aDiff - bDiff;
    })
    .slice(0, 6);

  // Subject Distribution Data
  const subjectDistribution = subjects.map((sub) => {
    const pendingForSub = tasks.filter((t) => t.subjectId === sub.id && !t.completed).length;
    return {
      name: sub.name,
      code: sub.code || sub.name.substring(0, 5),
      value: pendingForSub,
      color: sub.color || '#8B5CF6'
    };
  }).filter((item) => item.value > 0);

  // Also include general/unassigned if any
  const unassignedPending = tasks.filter((t) => !t.subjectId && !t.completed).length;
  if (unassignedPending > 0) {
    subjectDistribution.push({
      name: 'General / Unassigned',
      code: 'GEN',
      value: unassignedPending,
      color: '#64748B'
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* A. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50/40 dark:from-[#181824] dark:via-[#15151C] dark:to-[#1C1A2E] border border-[#E7E5EC] dark:border-[#242432] shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Workload Pulse</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
            {greetingTime}, {settings.displayName || 'Srishti'}.
          </h2>
          <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] mt-1.5 leading-relaxed">
            {contextualMessage}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setActivePage('tasks')}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-xs font-semibold text-[#17171D] dark:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#252535] transition-colors"
          >
            Review All Tasks
          </button>
          <button
            onClick={() => openAddTaskModal()}
            className="px-4 py-2.5 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] text-xs font-semibold shadow-sm hover:bg-black dark:hover:bg-gray-100 transition-all hover:scale-[1.02]"
          >
            + Add New Task
          </button>
        </div>

        {/* Ambient editorial background circle */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-3xl pointer-events-none" />
      </div>

      {/* B. Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Pending Tasks"
          value={pendingTasksCount}
          subtitle="Assignments, exams & labs"
          icon={Clock}
          accentColor="#8B5CF6"
          badgeText="Active"
          badgeType="neutral"
          onClick={() => setActivePage('tasks')}
        />
        <StatCard
          title="Due Within 7 Days"
          value={dueThisWeekCount}
          subtitle="Near-term pressure zone"
          icon={Calendar}
          accentColor="#3B82F6"
          badgeText="Urgent"
          badgeType={dueThisWeekCount > 3 ? 'warning' : 'blue'}
          onClick={() => setActivePage('tasks')}
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasksCount}
          subtitle="Finished deliverables"
          icon={CheckCircle2}
          accentColor="#10B981"
          badgeText="Accomplished"
          badgeType="success"
          onClick={() => setActivePage('tasks')}
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasksCount}
          subtitle={overdueTasksCount > 0 ? 'Requires immediate submission' : 'Schedule on track'}
          icon={AlertTriangle}
          accentColor="#F43F5E"
          badgeText={overdueTasksCount > 0 ? 'Action Needed' : 'Clear'}
          badgeType={overdueTasksCount > 0 ? 'danger' : 'neutral'}
          onClick={() => setActivePage('tasks')}
        />
      </div>

      {/* C. Workload Radar Component */}
      <WorkloadRadar />

      {/* D & E & F Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* E. Today's Focus (Left / 1 col on large screens) */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17171D] dark:text-white flex items-center gap-2">
                <span>Today's Focus</span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse-subtle" />
              </h3>
              <p className="text-[11px] text-[#777780] dark:text-[#908FA0]">
                Highest priority tasks requiring action today.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
              {focusTasks.length} queued
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {focusTasks.length === 0 ? (
              <div className="py-8 text-center text-[#777780] dark:text-[#908FA0] text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                No urgent tasks on your focus list today!
              </div>
            ) : (
              focusTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#FAF9FC] dark:bg-[#191924] border border-[#E7E5EC] dark:border-[#252535] hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(task.id);
                      }}
                      aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
                      title={task.completed ? 'Completed (click to reopen)' : 'Click to mark as completed'}
                      className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                          : 'border-[#B8B6C7] dark:border-[#4B4B5E] bg-white dark:bg-[#181822] hover:border-emerald-500 hover:bg-emerald-50/40 text-transparent'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-0'}`} />
                    </button>
                    <div
                      onClick={() => openTaskDetail(task)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div
                        className={`text-xs font-bold truncate ${
                          task.completed
                            ? 'line-through text-[#8C8C9A] dark:text-[#676778]'
                            : 'text-[#17171D] dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 text-[10.5px] text-[#777780] dark:text-[#908FA0] mt-1">
                        <span className="truncate max-w-[120px]">{task.subjectName}</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            isTaskOverdue(task)
                              ? 'text-rose-600 dark:text-rose-400'
                              : isTaskDueToday(task)
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {isTaskOverdue(task) ? 'Overdue' : isTaskDueToday(task) ? 'Today' : formatDisplayDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActivePage('tasks')}
            className="w-full mt-4 py-2 rounded-xl text-center text-xs font-semibold text-[#555562] dark:text-[#A1A1AF] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors"
          >
            Open Task Manager →
          </button>
        </div>

        {/* F. Subject Distribution (Middle / 1 col) */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17171D] dark:text-white">
                Subject Distribution
              </h3>
              <p className="text-[11px] text-[#777780] dark:text-[#908FA0]">
                Pending deliverables grouped by academic course.
              </p>
            </div>
            <BookOpen className="w-4 h-4 text-[#777780]" />
          </div>

          {subjectDistribution.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#777780] dark:text-[#908FA0]">
              No pending tasks across subjects.
            </div>
          ) : (
            <>
              {/* Donut Chart */}
              <div className="h-44 w-full flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, item) => [`${val} tasks`, item.payload.name]}
                      contentStyle={{
                        backgroundColor: '#181822',
                        borderColor: '#2A2A38',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Legend List */}
              <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto max-h-36 pr-1">
                {subjectDistribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#17171D] dark:text-white font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#777780] dark:text-[#908FA0] shrink-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* D. Upcoming Deadlines (Right / 1 col) */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17171D] dark:text-white">
                Upcoming Deadlines
              </h3>
              <p className="text-[11px] text-[#777780] dark:text-[#908FA0]">
                Chronological list of next academic milestones.
              </p>
            </div>
            <button
              onClick={() => setActivePage('calendar')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Calendar →
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#777780] dark:text-[#908FA0]">
                No pending tasks ahead.
              </div>
            ) : (
              upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#FAF9FC] dark:bg-[#191924] border border-[#E7E5EC] dark:border-[#252535] hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskComplete(task.id);
                      }}
                      aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
                      title={task.completed ? 'Completed (click to reopen)' : 'Click to mark as completed'}
                      className={`w-4 h-4 mt-0.5 rounded-[5px] border flex items-center justify-center transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                          : 'border-[#B8B6C7] dark:border-[#4B4B5E] bg-white dark:bg-[#181822] hover:border-emerald-500 hover:bg-emerald-50/40 text-transparent'
                      }`}
                    >
                      <Check className={`w-3 h-3 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-0'}`} />
                    </button>

                    <div
                      onClick={() => openTaskDetail(task)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {task.category}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-[#777780] dark:text-[#908FA0]">
                          {formatDisplayDate(task.dueDate)}
                        </span>
                      </div>
                      <h4
                        className={`text-xs font-bold truncate transition-colors ${
                          task.completed
                            ? 'line-through text-[#8C8C9A] dark:text-[#676778]'
                            : 'text-[#17171D] dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-[#777780] dark:text-[#908FA0]">
                        <span className="truncate">{task.subjectName}</span>
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

