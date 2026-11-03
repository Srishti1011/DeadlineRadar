import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { ConfirmDialog } from './components/ConfirmDialog';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { SubjectModal } from './components/SubjectModal';
import { DeleteSubjectModal } from './components/DeleteSubjectModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { CalendarView } from './pages/CalendarView';
import { Analytics } from './pages/Analytics';
import { Subjects } from './pages/Subjects';
import { Settings } from './pages/Settings';

const MainLayout = () => {
  const { activePage, sidebarCollapsed } = useTaskContext();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <Analytics />;
      case 'subjects':
        return <Subjects />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen text-[#17171D] dark:text-[#F0EFF4] transition-colors duration-200">
      {/* Global Navigation */}
      <Sidebar />
      <Header />

      {/* Main Content Area */}
      <main
        className={`px-4 sm:px-8 py-6 max-w-7xl mx-auto transition-all duration-300
          ${sidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72'}
        `}
      >
        {renderActivePage()}
      </main>

      {/* Global Modals, Dialogs & Toast Notifications */}
      <TaskModal />
      <TaskDetailModal />
      <SubjectModal />
      <DeleteSubjectModal />
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  );
}

