import React, { useRef, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, Calendar, X, Sparkles } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { isTaskOverdue, isTaskDueToday, isTaskDueWithinDays, formatTime, formatDisplayDate } from '../utils/dateUtils';

export const NotificationPanel = ({ isOpen, onClose }) => {
  const panelRef = useRef(null);
  const { tasks, openTaskDetail, setActivePage } = useTaskContext();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overdueTasks = tasks.filter(isTaskOverdue);
  const todayTasks = tasks.filter(isTaskDueToday);
  const upcomingUrgent = tasks.filter((t) => !t.completed && !isTaskOverdue(t) && !isTaskDueToday(t) && isTaskDueWithinDays(t, 2));

  const allAlerts = [
    ...overdueTasks.map((t) => ({
      id: `overdue-${t.id}`,
      type: 'overdue',
      title: `Overdue: ${t.title}`,
      subtitle: `${t.subjectName || 'General'} • Due ${formatDisplayDate(t.dueDate)}`,
      time: t.dueTime ? formatTime(t.dueTime) : null,
      task: t
    })),
    ...todayTasks.map((t) => ({
      id: `today-${t.id}`,
      type: 'today',
      title: `Due Today: ${t.title}`,
      subtitle: `${t.subjectName || 'General'} • Submit by ${t.dueTime ? formatTime(t.dueTime) : '23:59'}`,
      time: 'Today',
      task: t
    })),
    ...upcomingUrgent.map((t) => ({
      id: `urgent-${t.id}`,
      type: 'upcoming',
      title: `Upcoming: ${t.title}`,
      subtitle: `${t.subjectName || 'General'} • Due ${formatDisplayDate(t.dueDate)}`,
      time: 'Soon',
      task: t
    }))
  ];

  const handleTaskClick = (task) => {
    openTaskDetail(task);
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-[#181822] rounded-2xl border border-[#E7E5EC] dark:border-[#272736] shadow-float z-50 overflow-hidden animate-fade-in"
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E7E5EC] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#17171D] dark:text-white">
            Deadline Notifications
          </span>
          {allAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {allAlerts.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[#777780] hover:text-[#17171D] dark:hover:text-white hover:bg-[#EBE9F2] dark:hover:bg-[#252535] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F0EEF5] dark:divide-[#222230]">
        {allAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-[#17171D] dark:text-white">All caught up!</p>
            <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-1">
              No imminent deadlines or overdue assignments right now.
            </p>
          </div>
        ) : (
          allAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => handleTaskClick(alert.task)}
              className="p-3.5 hover:bg-[#F8F7FB] dark:hover:bg-[#20202D] cursor-pointer transition-colors flex items-start gap-3"
            >
              <div className="mt-0.5 shrink-0">
                {alert.type === 'overdue' ? (
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                ) : alert.type === 'today' ? (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#17171D] dark:text-white truncate">
                  {alert.title}
                </div>
                <div className="text-[11px] text-[#777780] dark:text-[#908FA0] truncate mt-0.5">
                  {alert.subtitle}
                </div>
              </div>

              {alert.time && (
                <span className="text-[10px] font-mono text-[#777780] dark:text-[#908FA0] shrink-0 mt-0.5">
                  {alert.time}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 border-t border-[#E7E5EC] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E] text-center">
        <button
          onClick={() => {
            setActivePage('tasks');
            onClose();
          }}
          className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
        >
          View all tasks in workspace →
        </button>
      </div>
    </div>
  );
};

