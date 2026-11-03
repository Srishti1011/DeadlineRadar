import React from 'react';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  BookOpen,
  Tag,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getRelativeDeadline, formatTime, formatDisplayDate } from '../utils/dateUtils';

export const TaskDetailModal = () => {
  const {
    viewingTask,
    closeTaskDetail,
    toggleTaskComplete,
    openEditTaskModal,
    deleteTask,
    openConfirmDialog,
    subjects
  } = useTaskContext();

  if (!viewingTask) return null;

  const relative = getRelativeDeadline(viewingTask);
  const subject = subjects.find((s) => s.id === viewingTask.subjectId);

  const handleDelete = () => {
    openConfirmDialog({
      title: 'Delete Task',
      message: `Are you sure you want to delete "${viewingTask.title}"?`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteTask(viewingTask.id);
        closeTaskDetail();
      }
    });
  };

  const handleEdit = () => {
    const taskToEdit = { ...viewingTask };
    closeTaskDetail();
    openEditTaskModal(taskToEdit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#181822] rounded-3xl border border-[#E7E5EC] dark:border-[#272736] max-w-lg w-full shadow-float overflow-hidden">
        {/* Header with category and actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEF5] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {viewingTask.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                ${
                  viewingTask.priority === 'high'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                    : viewingTask.priority === 'medium'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }
              `}
            >
              {viewingTask.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              title="Edit Task"
              className="p-1.5 rounded-xl text-[#777780] hover:text-[#17171D] dark:hover:text-white hover:bg-[#EBE9F2] dark:hover:bg-[#252535] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Task"
              className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeTaskDetail}
              className="p-1.5 rounded-xl text-[#777780] hover:text-[#17171D] dark:hover:text-white hover:bg-[#EBE9F2] dark:hover:bg-[#252535] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#17171D] dark:text-white">
              {viewingTask.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${relative.badgeClass}`}>
                {relative.label}
              </span>
              {viewingTask.completed && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed on {formatDisplayDate(viewingTask.completedAt || viewingTask.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Details Meta Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FAF9FC] dark:bg-[#15151E] border border-[#E7E5EC] dark:border-[#272736] text-xs">
            <div>
              <span className="text-[#777780] dark:text-[#908FA0] block text-[10px] uppercase font-bold tracking-wider mb-1">
                Subject
              </span>
              <span className="font-semibold text-[#17171D] dark:text-white">
                {viewingTask.subjectName || 'General'}
              </span>
              {subject?.code && (
                <span className="text-[10px] text-[#777780] block font-mono">
                  Code: {subject.code}
                </span>
              )}
            </div>

            <div>
              <span className="text-[#777780] dark:text-[#908FA0] block text-[10px] uppercase font-bold tracking-wider mb-1">
                Deadline
              </span>
              <span className="font-semibold text-[#17171D] dark:text-white font-mono">
                {formatDisplayDate(viewingTask.dueDate)}
              </span>
              <span className="text-[11px] text-[#777780] block font-mono">
                {viewingTask.dueTime ? formatTime(viewingTask.dueTime) : '23:59'}
              </span>
            </div>

            <div>
              <span className="text-[#777780] dark:text-[#908FA0] block text-[10px] uppercase font-bold tracking-wider mb-1">
                Estimated Effort
              </span>
              <span className="font-semibold text-[#17171D] dark:text-white font-mono">
                {viewingTask.estimatedHours || 2.0} hours
              </span>
            </div>

            <div>
              <span className="text-[#777780] dark:text-[#908FA0] block text-[10px] uppercase font-bold tracking-wider mb-1">
                Faculty Instructor
              </span>
              <span className="font-semibold text-[#17171D] dark:text-white">
                {subject?.faculty || 'Department'}
              </span>
            </div>
          </div>

          {/* Description */}
          {viewingTask.description && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] block mb-1">
                Description & Instructions
              </span>
              <p className="text-xs sm:text-sm text-[#555562] dark:text-[#B0B0C0] leading-relaxed whitespace-pre-wrap">
                {viewingTask.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {viewingTask.notes && (
            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                Submission Notes
              </span>
              <p className="text-amber-900/90 dark:text-amber-200/90">
                {viewingTask.notes}
              </p>
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="pt-3 border-t border-[#F0EEF5] dark:border-[#242432] flex items-center justify-between">
            <button
              onClick={() => toggleTaskComplete(viewingTask.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${
                  viewingTask.completed
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                }
              `}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{viewingTask.completed ? 'Reopen as Pending' : 'Mark as Completed'}</span>
            </button>

            <button
              onClick={closeTaskDetail}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#777780] hover:text-[#17171D] dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
