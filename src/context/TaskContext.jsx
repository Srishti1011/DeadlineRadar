import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { storage } from '../utils/storageUtils';
import { INITIAL_SUBJECTS, INITIAL_SETTINGS, generateInitialTasks } from '../data/initialData';
import { isTaskOverdue, getTodayISO } from '../utils/dateUtils';

const TaskContext = createContext();

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  // 1. Persistent State
  const [tasks, setTasks] = useState(() => storage.get('tasks', generateInitialTasks()));
  const [subjects, setSubjects] = useState(() => storage.get('subjects', INITIAL_SUBJECTS));
  const [settings, setSettings] = useState(() => storage.get('settings', INITIAL_SETTINGS));

  // 2. Navigation & UI State
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 3. Modals & Dialogs State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultTaskDate, setDefaultTaskDate] = useState(null);
  const [defaultSubjectId, setDefaultSubjectId] = useState(null);

  const [viewingTask, setViewingTask] = useState(null);

  const [subjectModal, setSubjectModal] = useState({ isOpen: false, editingSubject: null });
  const [deleteSubjectModal, setDeleteSubjectModal] = useState({ isOpen: false, subject: null });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: false,
    onConfirm: () => {}
  });

  const [toasts, setToasts] = useState([]);

  // Sync to LocalStorage
  useEffect(() => {
    storage.set('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    storage.set('subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    storage.set('settings', settings);
    // Apply theme class to <html> element
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Toast System
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Celebration animation
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']
      });
    } catch {
      // safe fallback if canvas not available
    }
  };

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      id: 'task-' + Date.now(),
      createdAt: getTodayISO(),
      completed: false,
      completedAt: null,
      ...taskData
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" scheduled successfully`, 'success');
    closeTaskModal();
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Task updated successfully', 'success');
    closeTaskModal();
    if (viewingTask && viewingTask.id === id) {
      setViewingTask((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  const deleteTask = (id) => {
    const target = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(`Deleted "${target?.title || 'task'}"`, 'info');
    if (viewingTask && viewingTask.id === id) {
      setViewingTask(null);
    }
  };

  const toggleTaskComplete = (id) => {
    let nowCompleted = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nowCompleted = !t.completed;
          return {
            ...t,
            completed: nowCompleted,
            completedAt: nowCompleted ? getTodayISO() : null
          };
        }
        return t;
      })
    );

    if (nowCompleted) {
      triggerConfetti();
      showToast('Task marked as completed! Keep up the momentum.', 'success');
    } else {
      showToast('Task marked as pending.', 'info');
    }
  };

  const changeTaskPriority = (id, priority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
    showToast(`Priority changed to ${priority.toUpperCase()}`, 'info');
  };

  // Subject Actions
  const addSubject = (subjectData) => {
    const newSubject = {
      id: 'sub-' + Date.now(),
      ...subjectData
    };
    setSubjects((prev) => [...prev, newSubject]);
    showToast(`Subject "${newSubject.name}" added`, 'success');
    closeSubjectModal();
    return newSubject;
  };

  const updateSubject = (id, updatedFields) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );

    // Also update subjectName on related tasks if name changed
    if (updatedFields.name) {
      setTasks((prev) =>
        prev.map((t) =>
          t.subjectId === id ? { ...t, subjectName: updatedFields.name } : t
        )
      );
    }

    showToast('Subject updated successfully', 'success');
    closeSubjectModal();
  };

  const deleteSubject = (id, taskAction = 'unassign', targetSubjectId = null) => {
    const subToDelete = subjects.find((s) => s.id === id);
    const affectedTasks = tasks.filter((t) => t.subjectId === id);

    if (taskAction === 'delete') {
      // Delete all tasks associated
      setTasks((prev) => prev.filter((t) => t.subjectId !== id));
    } else if (taskAction === 'reassign' && targetSubjectId) {
      const targetSub = subjects.find((s) => s.id === targetSubjectId);
      setTasks((prev) =>
        prev.map((t) =>
          t.subjectId === id
            ? { ...t, subjectId: targetSubjectId, subjectName: targetSub?.name || '' }
            : t
        )
      );
    } else {
      // Unassign tasks
      setTasks((prev) =>
        prev.map((t) =>
          t.subjectId === id
            ? { ...t, subjectId: null, subjectName: 'General / Unassigned' }
            : t
        )
      );
    }

    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast(`Subject "${subToDelete?.name || ''}" removed`, 'info');
    closeDeleteSubjectModal();
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully', 'success');
  };

  const toggleTheme = () => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  };

  const resetToDemoData = () => {
    const demoTasks = generateInitialTasks();
    setTasks(demoTasks);
    setSubjects(INITIAL_SUBJECTS);
    setSettings(INITIAL_SETTINGS);
    showToast('Application reset to initial demo state', 'info');
  };

  const clearAllData = () => {
    setTasks([]);
    setSubjects([]);
    storage.clearAll();
    showToast('All tasks and subjects cleared', 'info');
  };

  // Modal openers
  const openAddTaskModal = (dateStr = null, subjectId = null) => {
    setEditingTask(null);
    setDefaultTaskDate(dateStr);
    setDefaultSubjectId(subjectId);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultTaskDate(null);
    setDefaultSubjectId(null);
  };

  const openTaskDetail = (task) => {
    setViewingTask(task);
  };

  const closeTaskDetail = () => {
    setViewingTask(null);
  };

  const openSubjectModal = (subject = null) => {
    setSubjectModal({ isOpen: true, editingSubject: subject });
  };

  const closeSubjectModal = () => {
    setSubjectModal({ isOpen: false, editingSubject: null });
  };

  const openDeleteSubjectModal = (subject) => {
    setDeleteSubjectModal({ isOpen: true, subject });
  };

  const closeDeleteSubjectModal = () => {
    setDeleteSubjectModal({ isOpen: false, subject: null });
  };

  const openConfirmDialog = (options) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure?',
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      danger: options.danger || false,
      onConfirm: () => {
        options.onConfirm?.();
        closeConfirmDialog();
      }
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Dynamic statistics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const overdueTasksCount = tasks.filter(isTaskOverdue).length;
  const dueThisWeekCount = tasks.filter((t) => {
    if (t.completed) return false;
    const diff = Math.round((new Date(t.dueDate + 'T00:00:00') - new Date(getTodayISO() + 'T00:00:00')) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <TaskContext.Provider
      value={{
        // Data
        tasks,
        subjects,
        settings,
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,

        // Statistics
        totalTasksCount,
        completedTasksCount,
        pendingTasksCount,
        overdueTasksCount,
        dueThisWeekCount,

        // Task operations
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        changeTaskPriority,

        // Subject operations
        addSubject,
        updateSubject,
        deleteSubject,

        // Settings operations
        updateSettings,
        toggleTheme,
        resetToDemoData,
        clearAllData,

        // Modals & Dialogs
        isTaskModalOpen,
        editingTask,
        defaultTaskDate,
        defaultSubjectId,
        openAddTaskModal,
        openEditTaskModal,
        closeTaskModal,

        viewingTask,
        openTaskDetail,
        closeTaskDetail,

        subjectModal,
        openSubjectModal,
        closeSubjectModal,

        deleteSubjectModal,
        openDeleteSubjectModal,
        closeDeleteSubjectModal,

        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,

        // Toasts
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
