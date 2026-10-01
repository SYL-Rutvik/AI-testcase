import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Toast Component
 * Displays floating alert notifications in the bottom-right corner of the application.
 */
export default function Toast({ toasts = [], onClose }) {
  if (!toasts || toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-slate-900/90 text-white border-emerald-500/40 shadow-emerald-950/20';
      case 'error':
        return 'bg-rose-950/90 text-white border-rose-500/40 shadow-rose-950/20';
      case 'warning':
        return 'bg-amber-950/90 text-white border-amber-500/40 shadow-amber-950/20';
      default:
        return 'bg-slate-900/90 text-white border-indigo-500/40 shadow-indigo-950/20';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 animate-slide-up ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {getToastIcon(toast.type)}
            <span>{toast.message}</span>
          </div>

          <button
            onClick={() => onClose(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
