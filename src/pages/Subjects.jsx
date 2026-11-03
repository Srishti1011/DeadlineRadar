import React from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const Subjects = () => {
  const {
    subjects,
    tasks,
    openSubjectModal,
    openDeleteSubjectModal,
    openAddTaskModal,
    setActivePage
  } = useTaskContext();

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
            Academic Subjects
          </h2>
          <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] mt-1">
            Organize coursework, syllabus focus, faculty contacts, and associated deliverables.
          </p>
        </div>

        <button
          onClick={() => openSubjectModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const associatedTasks = tasks.filter((t) => t.subjectId === sub.id);
          const pendingTasks = associatedTasks.filter((t) => !t.completed);
          const completedTasks = associatedTasks.filter((t) => t.completed);
          const totalCount = associatedTasks.length;
          const progressPercent = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

          return (
            <div
              key={sub.id}
              className="group relative rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] p-5 card-shadow card-hover flex flex-col justify-between transition-all"
            >
              {/* Top Row: Code pill, color bar, and edit/delete */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color || '#8B5CF6' }}
                    />
                    {sub.code && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FAF9FC] dark:bg-[#1F1F2B] text-[#555562] dark:text-[#A1A1AF] border border-[#E7E5EC] dark:border-[#2A2A38]">
                        {sub.code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openSubjectModal(sub)}
                      title="Edit Subject"
                      className="p-1.5 rounded-lg text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteSubjectModal(sub)}
                      title="Delete Subject"
                      className="p-1.5 rounded-lg text-[#9B9BA7] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subject Name */}
                <h3 className="text-base font-bold text-[#17171D] dark:text-white leading-snug">
                  {sub.name}
                </h3>

                {/* Faculty */}
                {sub.faculty && (
                  <div className="flex items-center gap-1.5 text-xs text-[#777780] dark:text-[#908FA0] mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#9B9BA7]" />
                    <span>{sub.faculty}</span>
                  </div>
                )}

                {/* Description */}
                {sub.description && (
                  <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-2 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                )}
              </div>

              {/* Bottom: Metrics & Progress */}
              <div className="mt-6 pt-4 border-t border-[#F0EEF5] dark:border-[#242432]">
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="p-2 rounded-xl bg-[#FAF9FC] dark:bg-[#181822]">
                    <span className="text-[10px] font-bold uppercase text-[#777780] dark:text-[#908FA0] block">
                      Total
                    </span>
                    <span className="text-sm font-extrabold font-mono text-[#17171D] dark:text-white">
                      {totalCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/20">
                    <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300 block">
                      Pending
                    </span>
                    <span className="text-sm font-extrabold font-mono text-purple-700 dark:text-purple-300">
                      {pendingTasks.length}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 block">
                      Done
                    </span>
                    <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                      {completedTasks.length}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#F0EEF5] dark:bg-[#20202A] rounded-full h-1.5 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: sub.color || '#8B5CF6'
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActivePage('tasks');
                    }}
                    className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all tasks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => openAddTaskModal(null, sub.id)}
                    className="text-[11px] font-medium text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
