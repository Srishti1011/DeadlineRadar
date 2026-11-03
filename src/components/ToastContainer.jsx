import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTaskContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
        let borderClass = 'border-emerald-200 dark:border-emerald-900/60';

        if (toast.type === 'danger') {
          icon = <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-200 dark:border-rose-900/60';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 dark:border-amber-900/60';
        } else if (toast.type === 'info') {
          icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;
          borderClass = 'border-blue-200 dark:border-blue-900/60';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-white dark:bg-[#181822] text-[#17171D] dark:text-white rounded-xl border ${borderClass} shadow-float animate-fade-in`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <p className="text-xs font-medium truncate">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9B9BA7] hover:text-[#17171D] dark:hover:text-white p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
