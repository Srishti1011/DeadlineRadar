import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, PlusCircle, Check } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { getTodayISO } from '../utils/dateUtils';

const CATEGORIES = [
  'Assignment',
  'Quiz',
  'Examination',
  'Lab Evaluation',
  'Presentation',
  'Project',
  'Other'
];

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    defaultTaskDate,
    defaultSubjectId,
    subjects,
    addTask,
    updateTask,
    openSubjectModal
  } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState('medium');
  const [estimatedHours, setEstimatedHours] = useState('2.0');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setSubjectId(editingTask.subjectId || '');
      setCategory(editingTask.category || 'Assignment');
      setDueDate(editingTask.dueDate || getTodayISO());
      setDueTime(editingTask.dueTime || '23:59');
      setPriority(editingTask.priority || 'medium');
      setEstimatedHours(editingTask.estimatedHours ? String(editingTask.estimatedHours) : '2.0');
      setNotes(editingTask.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(defaultSubjectId || (subjects.length > 0 ? subjects[0].id : ''));
      setCategory('Assignment');
      setDueDate(defaultTaskDate || getTodayISO());
      setDueTime('23:59');
      setPriority('medium');
      setEstimatedHours('2.0');
      setNotes('');
    }
    setErrors({});
  }, [editingTask, isTaskModalOpen, defaultTaskDate, defaultSubjectId, subjects]);

  if (!isTaskModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    }
    if (!dueDate) {
      errs.dueDate = 'Deadline date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const subjectName = selectedSubject ? selectedSubject.name : 'General / Unassigned';

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      subjectId: subjectId || null,
      subjectName,
      category,
      dueDate,
      dueTime: dueTime || '23:59',
      priority,
      estimatedHours: parseFloat(estimatedHours) || 1.0,
      notes: notes.trim()
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#181822] rounded-3xl border border-[#E7E5EC] dark:border-[#272736] max-w-xl w-full shadow-float my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EEF5] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E]">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#17171D] dark:text-white">
              {editingTask ? 'Edit Academic Task' : 'Add New Academic Task'}
            </h3>
            <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-0.5">
              Enter deadline, subject, and complexity details for workload scoring.
            </p>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-1.5 rounded-xl text-[#777780] hover:text-[#17171D] dark:hover:text-white hover:bg-[#EBE9F2] dark:hover:bg-[#252535] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Red-Black Tree Insertion & Invariant Verification"
              className={`w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none transition-all
                ${errors.title ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-[#E7E5EC] dark:border-[#2A2A38] focus:border-purple-500'}
              `}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          {/* Subject & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Subject Dropdown with Add Option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0]">
                  Subject
                </label>
                <button
                  type="button"
                  onClick={() => openSubjectModal()}
                  className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                >
                  <PlusCircle className="w-3 h-3" /> New
                </button>
              </div>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500 transition-all"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code ? `[${s.code}] ` : ''}{s.name}
                  </option>
                ))}
                <option value="">General / Unassigned</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500 transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Deadline Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border text-[#17171D] dark:text-white focus:outline-none transition-all
                    ${errors.dueDate ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-[#E7E5EC] dark:border-[#2A2A38] focus:border-purple-500'}
                  `}
                />
              </div>
              {errors.dueDate && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" /> {errors.dueDate}
                </p>
              )}
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Deadline Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Priority & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority Segmented Control */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38]">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all
                      ${
                        priority === p
                          ? 'bg-white dark:bg-[#15151C] text-[#17171D] dark:text-white shadow-xs'
                          : 'text-[#777780] dark:text-[#888899] hover:text-[#17171D] dark:hover:text-white'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Est. Hours Needed
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="40"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Task Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of work, key deliverables, problem sets..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Submission Notes / Reference Links (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Submit to Moodle Hall B, bring scientific calculator"
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EEF5] dark:border-[#242432]">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#555562] dark:text-[#A1A1AF] hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {editingTask ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
