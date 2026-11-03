import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, MoveRight } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const DeleteSubjectModal = () => {
  const { deleteSubjectModal, closeDeleteSubjectModal, deleteSubject, tasks, subjects } = useTaskContext();
  const [handlingOption, setHandlingOption] = useState('unassign'); // 'unassign' | 'reassign' | 'delete'
  const [targetSubjectId, setTargetSubjectId] = useState('');

  if (!deleteSubjectModal.isOpen || !deleteSubjectModal.subject) return null;

  const subject = deleteSubjectModal.subject;
  const associatedTasks = tasks.filter((t) => t.subjectId === subject.id);
  const otherSubjects = subjects.filter((s) => s.id !== subject.id);

  const handleConfirm = () => {
    deleteSubject(subject.id, handlingOption, targetSubjectId || otherSubjects[0]?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#181822] rounded-3xl border border-[#E7E5EC] dark:border-[#272736] max-w-md w-full shadow-float overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEF5] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E]">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-5 h-5" />
            <h3 className="text-base font-bold tracking-tight text-[#17171D] dark:text-white">
              Delete Subject: {subject.name}
            </h3>
          </div>
          <button
            onClick={closeDeleteSubjectModal}
            className="p-1.5 rounded-xl text-[#777780] hover:text-[#17171D] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0]">
            This subject currently has <strong className="text-[#17171D] dark:text-white font-mono">{associatedTasks.length}</strong> associated {associatedTasks.length === 1 ? 'task' : 'tasks'}. Please choose how you would like to handle them:
          </p>

          <div className="space-y-2">
            {/* Option 1: Unassign */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                ${
                  handlingOption === 'unassign'
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-[#17171D] dark:text-white'
                    : 'border-[#E7E5EC] dark:border-[#272736] text-[#777780] dark:text-[#908FA0]'
                }
              `}
            >
              <input
                type="radio"
                name="handlingOption"
                checked={handlingOption === 'unassign'}
                onChange={() => setHandlingOption('unassign')}
                className="mt-0.5 text-purple-600"
              />
              <div className="text-xs">
                <span className="font-semibold block">Keep tasks as Unassigned</span>
                <span className="text-[11px] opacity-80">
                  Preserves all deadlines, deliverables and progress without assigning them to a specific subject.
                </span>
              </div>
            </label>

            {/* Option 2: Reassign to another subject */}
            {otherSubjects.length > 0 && (
              <label
                className={`flex flex-col gap-2 p-3 rounded-xl border cursor-pointer transition-all
                  ${
                    handlingOption === 'reassign'
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-[#17171D] dark:text-white'
                      : 'border-[#E7E5EC] dark:border-[#272736] text-[#777780] dark:text-[#908FA0]'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="handlingOption"
                    checked={handlingOption === 'reassign'}
                    onChange={() => {
                      setHandlingOption('reassign');
                      if (!targetSubjectId) setTargetSubjectId(otherSubjects[0]?.id || '');
                    }}
                    className="mt-0.5 text-purple-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block">Reassign tasks to another subject</span>
                    <span className="text-[11px] opacity-80">
                      Transfer all {associatedTasks.length} tasks to a different active course module.
                    </span>
                  </div>
                </div>

                {handlingOption === 'reassign' && (
                  <select
                    value={targetSubjectId || otherSubjects[0]?.id}
                    onChange={(e) => setTargetSubjectId(e.target.value)}
                    className="mt-2 w-full h-9 px-3 text-xs rounded-xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none"
                  >
                    {otherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                )}
              </label>
            )}

            {/* Option 3: Delete tasks */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                ${
                  handlingOption === 'delete'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200'
                    : 'border-[#E7E5EC] dark:border-[#272736] text-[#777780] dark:text-[#908FA0]'
                }
              `}
            >
              <input
                type="radio"
                name="handlingOption"
                checked={handlingOption === 'delete'}
                onChange={() => setHandlingOption('delete')}
                className="mt-0.5 text-rose-600"
              />
              <div className="text-xs">
                <span className="font-semibold block text-rose-700 dark:text-rose-400">
                  Delete all associated tasks
                </span>
                <span className="text-[11px] opacity-80">
                  Permanently delete this subject and all its {associatedTasks.length} tasks from your workspace.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EEF5] dark:border-[#242432]">
            <button
              onClick={closeDeleteSubjectModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#555562] dark:text-[#A1A1AF]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Delete Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
