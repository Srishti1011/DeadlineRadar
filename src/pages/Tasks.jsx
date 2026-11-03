import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowUpDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { isTaskOverdue, getDaysDiff } from '../utils/dateUtils';

const CATEGORIES = [
  'All Categories',
  'Assignment',
  'Quiz',
  'Examination',
  'Lab Evaluation',
  'Presentation',
  'Project',
  'Other'
];

export const Tasks = () => {
  const {
    tasks,
    subjects,
    searchQuery,
    setSearchQuery,
    openAddTaskModal,
    pendingTasksCount,
    completedTasksCount,
    overdueTasksCount
  } = useTaskContext();

  const [statusTab, setStatusTab] = useState('all'); // 'all' | 'pending' | 'completed' | 'overdue'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('deadline-asc'); // 'deadline-asc' | 'deadline-desc' | 'priority-desc' | 'created-desc' | 'title-asc'

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Status Tab filter
      if (statusTab === 'pending' && task.completed) return false;
      if (statusTab === 'completed' && !task.completed) return false;
      if (statusTab === 'overdue' && !isTaskOverdue(task)) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesSub = task.subjectName?.toLowerCase().includes(query);
        const matchesCat = task.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSub && !matchesCat) return false;
      }

      // 3. Subject filter
      if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) {
        if (selectedSubject === 'unassigned' && task.subjectId) return false;
        if (selectedSubject !== 'unassigned') return false;
      }

      // 4. Category filter
      if (selectedCategory !== 'All Categories' && task.category !== selectedCategory) {
        return false;
      }

      // 5. Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };

      if (sortBy === 'deadline-asc') {
        return getDaysDiff(a.dueDate) - getDaysDiff(b.dueDate);
      }
      if (sortBy === 'deadline-desc') {
        return getDaysDiff(b.dueDate) - getDaysDiff(a.dueDate);
      }
      if (sortBy === 'priority-desc') {
        return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      }
      if (sortBy === 'created-desc') {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, statusTab, searchQuery, selectedSubject, selectedCategory, selectedPriority, sortBy]);

  const clearAllFilters = () => {
    setStatusTab('all');
    setSelectedSubject('all');
    setSelectedCategory('All Categories');
    setSelectedPriority('all');
    setSearchQuery('');
    setSortBy('deadline-asc');
  };

  const hasActiveFilters =
    statusTab !== 'all' ||
    selectedSubject !== 'all' ||
    selectedCategory !== 'All Categories' ||
    selectedPriority !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner / Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
            Academic Task Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] mt-1">
            Track, filter, and schedule your assignments, quizzes, labs, and exam preparations.
          </p>
        </div>

        <button
          onClick={() => openAddTaskModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Tabs & Search Filter Controls Bar */}
      <div className="space-y-3 bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-4 sm:p-5 card-shadow">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EEF5] dark:border-[#242432] pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736]">
            {[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              { id: 'pending', label: 'Pending', count: pendingTasksCount },
              { id: 'completed', label: 'Completed', count: completedTasksCount },
              { id: 'overdue', label: 'Overdue', count: overdueTasksCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${
                    statusTab === tab.id
                      ? 'bg-white dark:bg-[#15151C] text-[#17171D] dark:text-white shadow-xs'
                      : 'text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white'
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    tab.id === 'overdue' && tab.count > 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 font-bold'
                      : 'bg-[#ECEAF2] dark:bg-[#252535] text-[#777780] dark:text-[#A1A1AF]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Quick search input on mobile/tablet or secondary */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BA7]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full h-8 pl-8 pr-7 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white placeholder-[#9B9BA7] focus:outline-none focus:border-purple-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns Row: Subject, Category, Priority, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="unassigned">General / Unassigned</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-8 px-2.5 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-400"
            >
              <option value="deadline-asc">Deadline: Soonest first</option>
              <option value="deadline-desc">Deadline: Furthest first</option>
              <option value="priority-desc">Priority: High to Low</option>
              <option value="created-desc">Date Created: Newest</option>
              <option value="title-asc">Title: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#F0EEF5] dark:border-[#242432] text-xs">
            <span className="text-[#777780] dark:text-[#908FA0]">
              Showing <strong className="text-[#17171D] dark:text-white">{filteredTasks.length}</strong> of{' '}
              {tasks.length} total tasks
            </span>
            <button
              onClick={clearAllFilters}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Task Cards Grid or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#15151C] border border-dashed border-[#E7E5EC] dark:border-[#272736] card-shadow">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6 opacity-80" />
          </div>
          <h3 className="text-base font-bold text-[#17171D] dark:text-white">
            No matching academic tasks found
          </h3>
          <p className="text-xs text-[#777780] dark:text-[#908FA0] max-w-sm mx-auto mt-1 leading-relaxed">
            Try adjusting your search criteria, category filters, or add a new task to your schedule.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F5F4F8] dark:bg-[#1E1E28] text-[#17171D] dark:text-white hover:bg-[#EAE8F2]"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={() => openAddTaskModal()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100"
            >
              + Create Task
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
