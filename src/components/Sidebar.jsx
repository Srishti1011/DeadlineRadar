import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radar,
  Sparkles,
  X
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const Sidebar = () => {
  const {
    activePage,
    setActivePage,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    pendingTasksCount,
    settings
  } = useTaskContext();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Workload Analytics', icon: BarChart3 },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#15151C] border-r border-[#E7E5EC] dark:border-[#242432] transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#E7E5EC] dark:border-[#242432]">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5 text-purple-400 dark:text-purple-600 animate-spin-slow" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-[15px] tracking-tight text-[#17171D] dark:text-white leading-tight">
                  Deadline Radar
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#777780] dark:text-[#908FA0]">
                  Academic Workload
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-[#777780] hover:text-[#17171D] hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase text-[#9B9BA7] dark:text-[#676778]">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all group relative
                  ${
                    isActive
                      ? 'bg-[#F2EEFF] text-[#6D28D9] dark:bg-purple-950/40 dark:text-purple-300 font-semibold shadow-sm'
                      : 'text-[#555562] dark:text-[#A1A1AF] hover:text-[#17171D] dark:hover:text-white hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28]'
                  }
                  ${sidebarCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-[19px] h-[19px] shrink-0 transition-colors
                    ${
                      isActive
                        ? 'text-[#6D28D9] dark:text-purple-300'
                        : 'text-[#777780] dark:text-[#888899] group-hover:text-[#17171D] dark:group-hover:text-white'
                    }
                  `}
                />

                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!sidebarCollapsed && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold
                      ${
                        isActive
                          ? 'bg-[#6D28D9] text-white dark:bg-purple-400 dark:text-purple-950'
                          : 'bg-[#ECEAF2] text-[#555562] dark:bg-[#252535] dark:text-[#A1A1AF]'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot for badge */}
                {sidebarCollapsed && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6D28D9] ring-2 ring-white dark:ring-[#15151C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Profile & Collapse Toggle */}
        <div className="p-3 border-t border-[#E7E5EC] dark:border-[#242432] space-y-2">
          {/* User profile card */}
          <div
            onClick={() => handleNavClick('settings')}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors
              ${sidebarCollapsed ? 'justify-center p-1.5' : ''}
            `}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {settings.avatarInitials || 'SR'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#17171D] dark:text-white truncate">
                  {settings.displayName || 'Srishti'}
                </div>
                <div className="text-[11px] text-[#777780] dark:text-[#908FA0] truncate">
                  College Scholar
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-[#777780] dark:text-[#888899] hover:text-[#17171D] dark:hover:text-white rounded-lg hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28] transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

