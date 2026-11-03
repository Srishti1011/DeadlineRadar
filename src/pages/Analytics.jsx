import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { calculateWeeklyWorkload, generateWorkloadInsights } from '../utils/workloadUtils';
import { isTaskOverdue, getDaysDiff, getTodayISO } from '../utils/dateUtils';

export const Analytics = () => {
  const { tasks, subjects, pendingTasksCount, completedTasksCount, overdueTasksCount } = useTaskContext();

  const weeklyWorkload = calculateWeeklyWorkload(tasks);
  const insights = generateWorkloadInsights(tasks, subjects);

  // A. Weekly Workload Bar Chart Data
  const weeklyChartData = weeklyWorkload.daysData.map((d) => ({
    day: d.dayName,
    date: d.dayNumber,
    pending: d.pendingCount,
    completed: d.completedCount,
    total: d.totalCount,
    score: d.score,
    level: d.workloadLevel
  }));

  // B. Subject-wise Distribution Chart Data
  const subjectChartData = subjects.map((sub) => {
    const pending = tasks.filter((t) => t.subjectId === sub.id && !t.completed).length;
    const completed = tasks.filter((t) => t.subjectId === sub.id && t.completed).length;
    return {
      name: sub.code || sub.name.substring(0, 10),
      fullName: sub.name,
      pending,
      completed,
      total: pending + completed,
      color: sub.color || '#8B5CF6'
    };
  }).filter((s) => s.total > 0);

  // C. Completion Rate
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // D. Productivity Overview Metrics
  const today = getTodayISO();
  const completedThisWeek = tasks.filter((t) => {
    if (!t.completed || !t.completedAt) return false;
    const diff = Math.abs(getDaysDiff(t.completedAt, today));
    return diff <= 7;
  }).length;

  const completedThisMonth = tasks.filter((t) => {
    if (!t.completed || !t.completedAt) return false;
    const diff = Math.abs(getDaysDiff(t.completedAt, today));
    return diff <= 30;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            Performance & Insights
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
          Workload Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] mt-1 max-w-2xl leading-relaxed">
          Comprehensive diagnostic metrics on your academic submission patterns, completion velocity, and cognitive workload balance.
        </p>
      </div>

      {/* D. Productivity Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block mb-2">
            Completed This Week
          </span>
          <div className="text-3xl font-extrabold font-mono text-[#17171D] dark:text-white">
            {completedThisWeek}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            Recent submissions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block mb-2">
            Completed This Month
          </span>
          <div className="text-3xl font-extrabold font-mono text-[#17171D] dark:text-white">
            {completedThisMonth}
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1 block">
            Monthly velocity
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block mb-2">
            Current Pending
          </span>
          <div className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
            {pendingTasksCount}
          </div>
          <span className="text-[11px] text-[#777780] dark:text-[#908FA0] mt-1 block">
            In-flight assignments
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block mb-2">
            Overdue Backlog
          </span>
          <div className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
            {overdueTasksCount}
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1 block">
            {overdueTasksCount > 0 ? 'Requires remediation' : 'No overdue backlog'}
          </span>
        </div>
      </div>

      {/* A & C: Weekly Workload & Completion Rate Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. Weekly Workload Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div>
              <h3 className="text-base font-bold text-[#17171D] dark:text-white">
                Weekly Deliverable Density
              </h3>
              <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-0.5">
                Number of assignments & assessments due on each day of the current week.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" /> Pending
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Done
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5EC33" />
                <XAxis dataKey="day" stroke="#9B9BA7" fontSize={11} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#9B9BA7" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#181822] text-white rounded-xl shadow-lg border border-[#2A2A38] text-xs">
                          <p className="font-bold">{data.day} (Date: {data.date})</p>
                          <p className="text-purple-300 mt-1">Pending: {data.pending}</p>
                          <p className="text-emerald-300">Completed: {data.completed}</p>
                          <p className="text-gray-400 text-[10px] mt-1">Load Level: {data.level}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="pending" fill="#8B5CF6" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* C. Completion Rate (1 col) */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow flex flex-col items-center justify-between">
          <div className="w-full pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <h3 className="text-base font-bold text-[#17171D] dark:text-white">
              Completion Rate
            </h3>
            <p className="text-xs text-[#777780] dark:text-[#908FA0]">
              Overall submission progress
            </p>
          </div>

          {/* Radial progress visual */}
          <div className="relative my-6 flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="65"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-[#F0EEF5] dark:text-[#20202A]"
              />
              <circle
                cx="80"
                cy="80"
                r="65"
                stroke="#8B5CF6"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 65}
                strokeDashoffset={2 * Math.PI * 65 * (1 - completionRate / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-mono text-[#17171D] dark:text-white">
                {completionRate}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0]">
                Success Ratio
              </span>
            </div>
          </div>

          <div className="w-full text-center text-xs text-[#777780] dark:text-[#908FA0]">
            <strong className="text-[#17171D] dark:text-white font-mono">{completedTasksCount}</strong> out of{' '}
            <strong className="text-[#17171D] dark:text-white font-mono">{totalTasks}</strong> deliverables accomplished.
          </div>
        </div>
      </div>

      {/* B & E: Subject Distribution & Real Dynamic Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. Subject-wise Distribution */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div>
              <h3 className="text-base font-bold text-[#17171D] dark:text-white">
                Subject-wise Pending Workload
              </h3>
              <p className="text-xs text-[#777780] dark:text-[#908FA0]">
                Pending deliverables across registered subjects.
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={subjectChartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5EC33" />
                <XAxis type="number" allowDecimals={false} stroke="#9B9BA7" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#9B9BA7" fontSize={11} width={80} />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-[#181822] text-white rounded-xl text-xs border border-[#2A2A38]">
                          <p className="font-bold">{data.fullName}</p>
                          <p className="text-purple-300">Pending tasks: {data.pending}</p>
                          <p className="text-emerald-300">Completed: {data.completed}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="pending" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* E. Dynamic Workload Insights */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-[#17171D] dark:text-white">
                  Intelligent Workload Insights
                </h3>
                <p className="text-xs text-[#777780] dark:text-[#908FA0]">
                  Grounded observations computed from live task distribution.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {insights.map((insight) => {
              let borderClass = 'border-purple-200 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20';
              let titleClass = 'text-purple-900 dark:text-purple-300';
              let icon = <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />;

              if (insight.type === 'critical' || insight.type === 'warning') {
                borderClass = 'border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20';
                titleClass = 'text-rose-900 dark:text-rose-300';
                icon = <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
              } else if (insight.type === 'success') {
                borderClass = 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20';
                titleClass = 'text-emerald-900 dark:text-emerald-300';
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />;
              }

              return (
                <div
                  key={insight.id}
                  className={`p-3.5 rounded-2xl border ${borderClass} flex items-start gap-3 transition-colors`}
                >
                  {icon}
                  <div className="flex-1">
                    <h4 className={`text-xs font-bold ${titleClass}`}>
                      {insight.title}
                    </h4>
                    <p className="text-xs text-[#555562] dark:text-[#B0B0C0] mt-1 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
