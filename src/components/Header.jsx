import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { NotificationPanel } from './NotificationPanel';
import { isTaskOverdue, isTaskDueToday } from '../utils/dateUtils';

export const Header = () => {
  const {
    activePage,
    searchQuery,
    setSearchQuery,
    sidebarCollapsed,
    setMobileMenuOpen,
    openAddTaskModal,
    settings,
    toggleTheme,
    tasks,
    setActivePage
  } = useTaskContext();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pageTitles = {
    dashboard: 'Overview',
    tasks: 'My Tasks',
    calendar: 'Academic Calendar',
    analytics: 'Workload Analytics',
    subjects: 'Subject Directory',
    settings: 'Settings'
  };

  // Formatted today's date
  const now = new Date();
  const formattedToday = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const overdueCount = tasks.filter(isTaskOverdue).length;
  const todayCount = tasks.filter(isTaskDueToday).length;
  const alertCount = overdueCount + todayCount;

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#15151C]/90 backdrop-blur-md border-b border-[#E7E5EC] dark:border-[#242432] px-4 sm:px-6 flex items-center justify-between transition-all duration-300
        ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-68'}
      `}
    >
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 rounded-xl text-[#777780] hover:text-[#17171D] hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#17171D] dark:text-white leading-tight">
            {pageTitles[activePage] || 'Dashboard'}
          </h1>
          <span className="text-[11px] font-medium text-[#777780] dark:text-[#908FA0] hidden sm:block">
            {formattedToday}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BA7] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activePage !== 'tasks' && e.target.value.trim().length > 0) {
                // Keep activePage or allow quick search
              }
            }}
            placeholder="Search tasks, subjects..."
            className="w-full h-9 pl-9 pr-12 text-xs rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-transparent focus:border-purple-300 dark:focus:border-purple-600 focus:bg-white dark:focus:bg-[#15151C] text-[#17171D] dark:text-white placeholder-[#9B9BA7] dark:placeholder-[#6B6B7B] transition-all outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#9B9BA7] bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#272736] rounded shadow-xs pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#555562]" />
          )}
        </button>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-[#777780] dark:text-[#908FA0] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#15151C] animate-pulse-subtle" />
            )}
          </button>

          <NotificationPanel
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* Primary Action: Add Task Button */}
        <button
          onClick={() => openAddTaskModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
};
