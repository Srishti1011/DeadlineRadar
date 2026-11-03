import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Info,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { calculateWeeklyWorkload } from '../utils/workloadUtils';
import { useTaskContext } from '../context/TaskContext';
import { formatTime, formatDisplayDate } from '../utils/dateUtils';

export const WorkloadRadar = () => {
  const { tasks, toggleTaskComplete, openAddTaskModal, openTaskDetail } = useTaskContext();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const weeklyData = calculateWeeklyWorkload(tasks);
  const { daysData, peakDay, hasCritical, hasHeavy } = weeklyData;

  const activeDay = daysData[selectedDayIndex] || daysData[0];

  return (
    <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 sm:p-6 card-shadow">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0EEF5] dark:border-[#242432]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#17171D] dark:text-white">
              Workload Radar
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              Weekly Analysis
            </span>
            <button
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              title="How is the Workload Score calculated?"
              className="text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white p-1 rounded-md"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-1">
            Dynamic load scoring based on pending tasks, priority weights, and exam complexity.
          </p>
        </div>

        {/* Peak day badge */}
        {peakDay && peakDay.pendingCount > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#FAF9FC] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-subtle" />
            <span className="text-[11px] font-medium text-[#777780] dark:text-[#908FA0]">
              Peak Pressure:
            </span>
            <span className="text-xs font-bold text-[#17171D] dark:text-white">
              {peakDay.fullDayName} ({peakDay.pendingCount} {peakDay.pendingCount === 1 ? 'task' : 'tasks'})
            </span>
          </div>
        )}
      </div>

      {/* Formula Explanation Popup */}
      {showFormulaInfo && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 text-xs text-[#555562] dark:text-[#B0B0C0] animate-fade-in space-y-1">
          <div className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            How Deadline Radar Calculates Workload
          </div>
          <p>
            • <strong>Priority Factor:</strong> High Priority (+3.5 pts), Medium (+2.0 pts), Low (+1.5 pts).
          </p>
          <p>
            • <strong>Category Intensity:</strong> Examinations (2.0× multiplier), Labs/Projects (1.6×), Presentations/Quizzes (1.3×).
          </p>
          <p>
            • <strong>Scale:</strong> 0 = Rest, 1–3.5 = Light, 3.6–7.5 = Moderate, 7.6–11.5 = Heavy, 11.5+ = Critical.
          </p>
        </div>
      )}

      {/* Critical or Heavy Warning Banner */}
      {hasCritical && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-rose-800 dark:text-rose-300">
              Critical Workload Alert:
            </span>{' '}
            <span className="text-rose-700 dark:text-rose-300/90">
              You have an intense cluster of high-stakes academic deadlines approaching this week. Distribute research, revisions, and problem sets to earlier days to avoid burn-out.
            </span>
          </div>
        </div>
      )}

      {/* 7-Day Interactive Columns */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {daysData.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const isPeak = peakDay?.dateStr === day.dateStr && day.pendingCount > 0;
          const barHeightPercent = Math.min(Math.max((day.score / 15) * 100, day.pendingCount > 0 ? 25 : 8), 100);

          return (
            <div
              key={day.dateStr}
              onClick={() => setSelectedDayIndex(idx)}
              className={`group flex flex-col items-center p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'bg-[#FAF9FC] dark:bg-[#1E1E28] border-purple-400 dark:border-purple-500 shadow-md ring-2 ring-purple-100 dark:ring-purple-900/30'
                    : 'bg-[#FDFDFE] dark:bg-[#181822] border-[#EAE8F0] dark:border-[#242432] hover:border-purple-200 dark:hover:border-purple-800 hover:bg-[#FAF9FD] dark:hover:bg-[#1C1C26]'
                }
              `}
            >
              {/* Day Name & Date */}
              <div className="text-center mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block">
                  {day.dayName}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-1 transition-colors
                    ${
                      day.isToday
                        ? 'bg-[#17171D] text-white dark:bg-white dark:text-[#17171D]'
                        : 'text-[#17171D] dark:text-white'
                    }
                  `}
                >
                  {day.dayNumber}
                </span>
              </div>

              {/* Workload Bar Meter */}
              <div className="w-full h-28 sm:h-32 bg-[#F0EEF5] dark:bg-[#20202A] rounded-xl p-1 flex flex-col justify-end relative overflow-hidden">
                {/* Background guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-gray-300/40 dark:border-gray-700/40 pointer-events-none" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-gray-300/40 dark:border-gray-700/40 pointer-events-none" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-gray-300/40 dark:border-gray-700/40 pointer-events-none" />

                {/* Animated Fill Bar */}
                <div
                  className={`w-full rounded-lg bg-gradient-to-t ${day.workloadInfo.barColor} transition-all duration-500 ease-out`}
                  style={{ height: `${barHeightPercent}%` }}
                />
              </div>

              {/* Status Indicator */}
              <div className="mt-3 text-center w-full">
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-bold tracking-tight border truncate w-full ${day.workloadInfo.badgeClass}`}
                >
                  {day.workloadLevel}
                </span>

                <div className="text-[11px] font-mono text-[#777780] dark:text-[#908FA0] mt-1">
                  {day.pendingCount} {day.pendingCount === 1 ? 'task' : 'tasks'}
                </div>
              </div>

              {/* Peak indicator dot */}
              {isPeak && (
                <div className="mt-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                  ★ Peak
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Task Drilldown */}
      <div className="mt-6 pt-5 border-t border-[#F0EEF5] dark:border-[#242432]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xs sm:text-sm font-bold text-[#17171D] dark:text-white">
              Deliverables for {activeDay.fullDayName}, {formatDisplayDate(activeDay.dateStr)}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeDay.workloadInfo.badgeClass}`}
            >
              {activeDay.workloadInfo.label} (Score: {activeDay.score})
            </span>
          </div>

          <button
            onClick={() => openAddTaskModal(activeDay.dateStr)}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task for this date</span>
          </button>
        </div>

        {/* Tasks list for selected day */}
        {activeDay.tasks.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#FAF9FC] dark:bg-[#1A1A24] border border-dashed border-[#E7E5EC] dark:border-[#272736] text-center">
            <p className="text-xs font-medium text-[#777780] dark:text-[#908FA0]">
              No tasks scheduled for {activeDay.fullDayName}. Enjoy the breathing room!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeDay.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF9FC] dark:bg-[#1A1A24] border border-[#E7E5EC] dark:border-[#272736] hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="shrink-0 text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        task.completed
                          ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950'
                          : 'text-[#9B9BA7]'
                      }`}
                    />
                  </button>

                  <div
                    onClick={() => openTaskDetail(task)}
                    className="min-w-0 cursor-pointer"
                  >
                    <span
                      className={`text-xs font-semibold block truncate ${
                        task.completed
                          ? 'line-through text-[#9B9BA7] dark:text-[#676778]'
                          : 'text-[#17171D] dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-[#777780] dark:text-[#908FA0] mt-0.5">
                      <span>{task.subjectName}</span>
                      <span>•</span>
                      <span className="font-mono">{task.dueTime ? formatTime(task.dueTime) : '23:59'}</span>
                      <span>•</span>
                      <span className="capitalize">{task.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }
                    `}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => openTaskDetail(task)}
                    className="p-1 rounded text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
