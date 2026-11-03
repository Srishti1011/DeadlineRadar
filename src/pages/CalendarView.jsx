import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Filter,
  Check
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import {
  getMonthGrid,
  getWeekDays,
  getTodayISO,
  formatDisplayDate,
  formatTime
} from '../utils/dateUtils';

const CATEGORY_COLORS = {
  Assignment: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Quiz: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Examination: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Lab Evaluation': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Presentation: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Project: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Other: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

export const CalendarView = () => {
  const { tasks, openAddTaskModal, openTaskDetail, toggleTaskComplete } = useTaskContext();

  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(getTodayISO());

  const todayStr = getTodayISO();

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else {
      next.setDate(next.getDate() - 7);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(getTodayISO());
  };

  // Month Grid & Header Title
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const monthGrid = getMonthGrid(year, monthIndex);
  const weekDays = getWeekDays(currentDate);

  // Selected Day tasks
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
              {monthName}
            </h2>
            <p className="text-xs text-[#777780] dark:text-[#908FA0]">
              Interactive timetable with category color tags & deadline indicators.
            </p>
          </div>
        </div>

        {/* View Switcher & Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Month / Week Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-[#15151C] text-[#17171D] dark:text-white shadow-xs'
                  : 'text-[#777780] dark:text-[#908FA0]'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-[#15151C] text-[#17171D] dark:text-white shadow-xs'
                  : 'text-[#777780] dark:text-[#908FA0]'
              }`}
            >
              Week View
            </button>
          </div>

          {/* Prev, Today, Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-bold rounded-xl text-[#17171D] dark:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => openAddTaskModal(selectedDateStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid Container (3 cols on desktop) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-4 sm:p-6 card-shadow overflow-x-auto">
          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                className="py-1 text-[11px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* MONTH VIEW */}
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {monthGrid.map((cell) => {
                const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
                const isSelected = selectedDateStr === cell.dateStr;

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group
                      ${
                        cell.isCurrentMonth
                          ? 'bg-[#FAF9FC] dark:bg-[#181822] text-[#17171D] dark:text-white'
                          : 'bg-white/40 dark:bg-[#121218]/40 text-[#B0B0BD] dark:text-[#555566] border-transparent'
                      }
                      ${
                        isSelected
                          ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-100 dark:ring-purple-900/30 bg-purple-50/20'
                          : 'border-[#EAE8F0] dark:border-[#222230] hover:border-purple-200 dark:hover:border-purple-800'
                      }
                    `}
                  >
                    {/* Date Number Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                          ${
                            cell.isToday
                              ? 'bg-[#17171D] text-white dark:bg-white dark:text-[#17171D]'
                              : cell.isCurrentMonth
                              ? 'text-[#17171D] dark:text-white'
                              : 'text-gray-400 dark:text-gray-600'
                          }
                        `}
                      >
                        {cell.dayNumber}
                      </span>

                      {dayTasks.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Task Chips in Cell */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTaskDetail(t);
                          }}
                          title={t.title}
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold truncate border transition-transform hover:scale-[1.02] ${
                            CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other
                          } ${t.completed ? 'opacity-50 line-through' : ''}`}
                        >
                          {t.title}
                        </div>
                      ))}

                      {dayTasks.length > 2 && (
                        <div className="text-[9px] font-bold text-[#777780] dark:text-[#908FA0] pl-1">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WEEK VIEW */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-7 gap-2 min-h-[350px]">
              {weekDays.map((day) => {
                const dayTasks = tasks.filter((t) => t.dueDate === day.dateStr);
                const isSelected = selectedDateStr === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between
                      ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50/20 dark:border-purple-400 ring-2 ring-purple-100 dark:ring-purple-900/30'
                          : 'border-[#EAE8F0] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#181822] hover:border-purple-200'
                      }
                    `}
                  >
                    <div>
                      <div className="text-center pb-2 border-b border-[#F0EEF5] dark:border-[#242432]">
                        <span className="text-[10px] uppercase font-bold text-[#777780] dark:text-[#908FA0]">
                          {day.dayName}
                        </span>
                        <div
                          className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mt-1 ${
                            day.isToday
                              ? 'bg-[#17171D] text-white dark:bg-white dark:text-[#17171D]'
                              : 'text-[#17171D] dark:text-white'
                          }`}
                        >
                          {day.dayNumber}
                        </div>
                      </div>

                      <div className="space-y-1.5 mt-3">
                        {dayTasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskDetail(t);
                            }}
                            className={`p-1.5 rounded-lg text-[10px] font-semibold border ${
                              CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other
                            } ${t.completed ? 'opacity-50 line-through' : ''}`}
                          >
                            <div className="truncate">{t.title}</div>
                            {t.dueTime && (
                              <div className="font-mono text-[9px] opacity-80 mt-0.5">
                                {formatTime(t.dueTime)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddTaskModal(day.dateStr);
                      }}
                      className="mt-4 w-full py-1 rounded text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-center"
                    >
                      + Add
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Date Inspector Sidebar (1 col) */}
        <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-5 card-shadow flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EEF5] dark:border-[#242432] mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0]">
                Selected Date
              </span>
              <h3 className="text-sm font-bold text-[#17171D] dark:text-white">
                {formatDisplayDate(selectedDateStr)}
              </h3>
            </div>
            <button
              onClick={() => openAddTaskModal(selectedDateStr)}
              className="p-1.5 rounded-lg bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:scale-105 transition-transform"
              title="Add task for this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {selectedDayTasks.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#777780] dark:text-[#908FA0]">
                <Clock className="w-7 h-7 mx-auto mb-2 opacity-50" />
                No tasks scheduled for this day. Click the <strong>+</strong> button to add one!
              </div>
            ) : (
              selectedDayTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-[#FAF9FC] dark:bg-[#191924] border border-[#E7E5EC] dark:border-[#252535] hover:border-purple-300 transition-colors"
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
                      <div
                        className={`text-xs font-bold truncate ${
                          task.completed
                            ? 'line-through text-[#8C8C9A] dark:text-[#676778]'
                            : 'text-[#17171D] dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10.5px] text-[#777780] dark:text-[#908FA0] mt-0.5">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {task.category}
                        </span>
                        <span>•</span>
                        <span className="font-mono">
                          {task.dueTime ? formatTime(task.dueTime) : '23:59'}
                        </span>
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

