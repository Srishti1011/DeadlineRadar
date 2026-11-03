import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';

export const ConfirmDialog = () => {
  const { confirmDialog, closeConfirmDialog } = useTaskContext();

  if (!confirmDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#181822] rounded-2xl border border-[#E7E5EC] dark:border-[#272736] max-w-md w-full shadow-float overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                ${
                  confirmDialog.danger
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                }
              `}
            >
              {confirmDialog.danger ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17171D] dark:text-white">
                {confirmDialog.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#777780] dark:text-[#908FA0] leading-relaxed">
            {confirmDialog.message}
          </p>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#F0EEF5] dark:border-[#242432]">
            <button
              onClick={closeConfirmDialog}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#555562] dark:text-[#A1A1AF] hover:bg-[#F5F4F8] dark:hover:bg-[#20202A] transition-colors"
            >
              {confirmDialog.cancelLabel || 'Cancel'}
            </button>
            <button
              onClick={() => {
                confirmDialog.onConfirm();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]
                ${
                  confirmDialog.danger
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#17171D] dark:bg-white dark:text-[#17171D] hover:bg-black dark:hover:bg-gray-100'
                }
              `}
            >
              {confirmDialog.confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
