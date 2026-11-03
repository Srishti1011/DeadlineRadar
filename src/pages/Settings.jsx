import React, { useState } from 'react';
import {
  User,
  Calendar,
  Moon,
  Sun,
  Bell,
  Trash2,
  RotateCcw,
  Check,
  Save,
  ShieldAlert
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const Settings = () => {
  const {
    settings,
    updateSettings,
    toggleTheme,
    resetToDemoData,
    clearAllData,
    openConfirmDialog,
    showToast
  } = useTaskContext();

  const [displayName, setDisplayName] = useState(settings.displayName || 'Srishti');
  const [avatarInitials, setAvatarInitials] = useState(settings.avatarInitials || 'SR');
  const [dateFormat, setDateFormat] = useState(settings.dateFormat || 'MMM DD, YYYY');
  const [notifications, setNotifications] = useState(settings.notifications || {
    deadlineAlerts: true,
    soundEnabled: true,
    reminderHoursBefore: 24,
    dailyDigest: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateSettings({
      displayName: displayName.trim() || 'Student',
      avatarInitials: avatarInitials.trim().toUpperCase() || 'ST',
      dateFormat,
      notifications
    });
  };

  const handleToggleNotification = (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updated);
    updateSettings({ notifications: updated });
  };

  const handleClearAll = () => {
    openConfirmDialog({
      title: 'Clear All Application Data',
      message: 'This will permanently remove all tasks, subjects, and custom settings from your browser LocalStorage. This action cannot be reversed.',
      confirmLabel: 'Clear All Data',
      danger: true,
      onConfirm: () => clearAllData()
    });
  };

  const handleResetDemo = () => {
    openConfirmDialog({
      title: 'Reset to Sample Demo Data',
      message: 'This will replace your current tasks and subjects with the original curated academic demo dataset.',
      confirmLabel: 'Reset Data',
      danger: false,
      onConfirm: () => resetToDemoData()
    });
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#242432] card-shadow">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17171D] dark:text-white">
          Platform Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] mt-1">
          Customize your profile, visual appearance, date preferences, and workspace storage.
        </p>
      </div>

      {/* 1. Profile & Identity */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-6 card-shadow space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
          <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-[#17171D] dark:text-white uppercase tracking-wider">
            Student Identity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
              Avatar Initials (1-2 chars)
            </label>
            <input
              type="text"
              maxLength={3}
              value={avatarInitials}
              onChange={(e) => setAvatarInitials(e.target.value)}
              className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl bg-[#F5F4F8] dark:bg-[#1E1E28] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#777780] dark:text-[#908FA0] mb-1.5">
            Preferred Date Display Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['MMM DD, YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setDateFormat(fmt)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all
                  ${
                    dateFormat === fmt
                      ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                      : 'border-[#E7E5EC] dark:border-[#272736] text-[#777780] dark:text-[#908FA0] hover:bg-[#F5F4F8] dark:hover:bg-[#1E1E28]'
                  }
                `}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17171D] dark:bg-white text-white dark:text-[#17171D] text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* 2. Theme & Visual Appearance */}
      <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
          <Sun className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-[#17171D] dark:text-white uppercase tracking-wider">
            Appearance & Editorial Theme
          </h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#191924] border border-[#E7E5EC] dark:border-[#252535]">
          <div>
            <span className="text-xs font-bold text-[#17171D] dark:text-white block">
              Color Palette Theme
            </span>
            <span className="text-xs text-[#777780] dark:text-[#908FA0]">
              Currently using {settings.theme === 'dark' ? 'Dark Minimalist' : 'Soft Off-White Light'} theme.
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#15151C] border border-[#E7E5EC] dark:border-[#272736] text-[#17171D] dark:text-white shadow-xs hover:border-purple-400"
          >
            {settings.theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#555562]" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Notification Preferences (Simulated) */}
      <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
          <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-[#17171D] dark:text-white uppercase tracking-wider">
            Alerts & Deadline Reminders
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'deadlineAlerts',
              label: 'Imminent Deadline Notifications',
              desc: 'Display banner badges and alerts for items due in under 24 hours.'
            },
            {
              key: 'dailyDigest',
              label: 'Morning Workload Briefing',
              desc: 'Compute daily task volume and display focus suggestions at 08:00.'
            },
            {
              key: 'soundEnabled',
              label: 'Completion Sound & Celebration Confetti',
              desc: 'Trigger interactive confetti and sound effects on marking tasks complete.'
            }
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => handleToggleNotification(item.key)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF9FC] dark:bg-[#191924] border border-[#E7E5EC] dark:border-[#252535] cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-[#17171D] dark:text-white block">
                  {item.label}
                </span>
                <span className="text-[11px] text-[#777780] dark:text-[#908FA0]">
                  {item.desc}
                </span>
              </div>

              <div
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  notifications[item.key] ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    notifications[item.key] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Data Management & Reset */}
      <div className="bg-white dark:bg-[#15151C] rounded-2xl border border-[#E7E5EC] dark:border-[#242432] p-6 card-shadow space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F0EEF5] dark:border-[#242432]">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-[#17171D] dark:text-white uppercase tracking-wider">
            Workspace Data & LocalStorage
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-[#E7E5EC] dark:border-[#272736] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#17171D] dark:text-white block mb-1">
                Reset Demo Dataset
              </span>
              <p className="text-[11px] text-[#777780] dark:text-[#908FA0] leading-relaxed">
                Repopulates the 5 original subjects and realistic assignments to test all chart visualizations.
              </p>
            </div>
            <button
              onClick={handleResetDemo}
              className="mt-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block mb-1">
                Clear All Application Data
              </span>
              <p className="text-[11px] text-[#777780] dark:text-[#908FA0] leading-relaxed">
                Wipes all stored records from browser LocalStorage for a completely fresh start.
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="mt-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
