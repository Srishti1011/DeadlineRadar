import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  MoreVertical,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getRelativeDeadline, formatTime, formatDisplayDate } from '../utils/dateUtils';

// Academic Category Styling Map
const CATEGORY_STYLES = {
  Assignment: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800'
  },
  Quiz: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800'
  },
  Examination: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800'
  },
  'Lab Evaluation': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  Presentation: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800'
  },
  Project: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800'
  },
  Other: {
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700'
  }
};

const PRIORITY_BADGES = {
  high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

export const TaskCard = ({ task, compact = false }) => {
  const {
    toggleTaskComplete,
    openEditTaskModal,
    deleteTask,
    openTaskDetail,
    openConfirmDialog,
    changeTaskPriority
  } = useTaskContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const relative = getRelativeDeadline(task);
  const catStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Other;

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen]);

  const handleDelete = () => {
    setMenuOpen(false);
    openConfirmDialog({
      title: 'Delete Task',
      message: `Are you sure you want to permanently delete "${task.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => deleteTask(task.id)
    });
  };

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-[#15151C] border card-shadow card-hover transition-all
        ${
          task.completed
            ? 'opacity-80 dark:opacity-75 bg-[#FAF9FD]/80 dark:bg-[#13131A] border-[#DCD9E6] dark:border-[#272738]'
            : 'border-[#E7E5EC] dark:border-[#242432]'
        }
        ${compact ? 'p-3.5' : 'p-4 sm:p-5'}
      `}
    >
      {/* Top row: Subject & Category & Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            {task.category}
          </span>
          <span className="text-[11px] font-semibold text-[#777780] dark:text-[#908FA0] truncate max-w-[140px] sm:max-w-[200px]">
            {task.subjectName || 'General'}
          </span>
          {task.completed && (
            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Completed
            </span>
          )}
        </div>

        {/* Priority & Dropdown Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium
            }`}
          >
            {task.priority}
          </span>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white rounded-lg hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] transition-colors"
              aria-label="Task options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 w-44 bg-white dark:bg-[#181822] rounded-xl border border-[#E7E5EC] dark:border-[#272736] shadow-float z-30 py-1.5 text-xs animate-fade-in">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openTaskDetail(task);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#17171D] dark:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] flex items-center gap-2"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#777780]" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openEditTaskModal(task);
                  }}
                  className="w-full text-left px-3 py-1.5 text-[#17171D] dark:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#777780]" />
                  <span>Edit Task</span>
                </button>

                <div className="border-t border-[#F0EEF5] dark:border-[#242432] my-1 pt-1 px-3">
                  <div className="text-[10px] uppercase font-bold text-[#9B9BA7] mb-1">
                    Priority
                  </div>
                  <div className="flex gap-1">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          changeTaskPriority(task.id, p);
                          setMenuOpen(false);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          task.priority === p
                            ? 'bg-[#17171D] text-white dark:bg-white dark:text-[#17171D]'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {p[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#F0EEF5] dark:border-[#242432] my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Title & Visible Completion Checkbox */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
          }}
          aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
          title={task.completed ? 'Completed (click to undo and reopen)' : 'Click to mark as completed'}
          className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs hover:bg-emerald-700 hover:border-emerald-700'
              : 'border-[#B8B6C7] dark:border-[#4B4B5E] bg-white dark:bg-[#181822] hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-transparent'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${task.completed ? 'scale-100' : 'scale-0'}`} />
        </button>

        <div
          onClick={() => openTaskDetail(task)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <h4
            className={`text-sm font-bold tracking-tight transition-colors ${
              task.completed
                ? 'line-through text-[#8C8C9A] dark:text-[#676778]'
                : 'text-[#17171D] dark:text-white hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            {task.title}
          </h4>

          {task.description && !compact && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                task.completed
                  ? 'text-[#9B9BA7] dark:text-[#5B5B6D] line-clamp-1'
                  : 'text-[#777780] dark:text-[#908FA0] line-clamp-2'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info: Deadline, Time, Estimated Hours */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#F0EEF5] dark:border-[#242432] text-xs text-[#777780] dark:text-[#908FA0]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#9B9BA7]" />
          <span
            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${relative.badgeClass}`}
          >
            {relative.label}
          </span>
          {task.dueTime && (
            <span className="font-mono text-[11px] hidden sm:inline">
              @{formatTime(task.dueTime)}
            </span>
          )}
        </div>

        {task.estimatedHours && (
          <div className="flex items-center gap-1 font-mono text-[11px] text-[#777780] dark:text-[#908FA0]">
            <Clock className="w-3 h-3 text-[#9B9BA7]" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}
      </div>
    </div>
  );
};

