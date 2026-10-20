import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700',
    error: 'bg-rose-900/90 text-white border-rose-700',
    info: 'bg-indigo-900/90 text-white border-indigo-700',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type] || Info;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up ${styles[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="text-xs font-bold leading-tight">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
