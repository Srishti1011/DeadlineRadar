import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

const PRESET_COLORS = [
  '#8B5CF6', // Violet
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#F43F5E', // Rose/Coral
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export const SubjectModal = () => {
  const { subjectModal, closeSubjectModal, addSubject, updateSubject } = useTaskContext();
  const isEditing = Boolean(subjectModal.editingSubject);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [faculty, setFaculty] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectModal.editingSubject) {
      setName(subjectModal.editingSubject.name || '');
      setCode(subjectModal.editingSubject.code || '');
      setFaculty(subjectModal.editingSubject.faculty || '');
      setColor(subjectModal.editingSubject.color || '#8B5CF6');
      setDescription(subjectModal.editingSubject.description || '');
    } else {
      setName('');
      setCode('');
      setFaculty('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      setDescription('');
    }
    setError('');
  }, [subjectModal]);

  if (!subjectModal.isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject title is required');
      return;
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      faculty: faculty.trim(),
      color,
      description: description.trim()
    };

    if (isEditing) {
      updateSubject(subjectModal.editingSubject.id, payload);
    } else {
      addSubject(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#181822] rounded-3xl border border-[#E7E5EC] dark:border-[#272736] max-w-md w-full shadow-float overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EEF5] dark:border-[#242432] bg-[#FAF9FC] dark:bg-[#15151E]">
          <div>
            <h3 className="text-base font-bold tracking-tight text-[#17171D] dark:text-white">
              {isEditing ? 'Edit Academic Subject' : 'Add Academic Subject'}
            </h3>
            <p className="text-xs text-[#777780] dark:text-[#908FA0] mt-0.5">
              Course module details for curriculum organization.
            </p>
          </div>
          <button
            onClick={closeSubjectModal}
            className="p-1.5 rounded-xl text-[#777780] hover:text-[#17171D] dark:hover:text-white hover:bg-[#EBE9F2] dark:hover:bg-[#252535] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Subject Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Deep Learning & Neural Computation"
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all"
            />
            {error && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., CS401"
                className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
                Faculty Name
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder="e.g., Prof. Sarah Chen"
                className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Subject Accent Color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-[#181822]' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Brief Syllabus / Focus (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key concepts, lab assignments, prerequisites..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1F1F2B] border border-[#E7E5EC] dark:border-[#2A2A38] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EEF5] dark:border-[#242432]">
            <button
              type="button"
              onClick={closeSubjectModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#555562] dark:text-[#A1A1AF] hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 shadow-sm transition-all"
            >
              {isEditing ? 'Save Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

