import React from 'react';

const Notification = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };

  return (
    <div className={`border px-4 py-3 rounded-lg flex items-center justify-between my-2 text-sm shadow-sm ${styles[type] || styles.info}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="font-bold ml-4 opacity-70 hover:opacity-100">
          &times;
        </button>
      )}
    </div>
  );
};

export default Notification;
