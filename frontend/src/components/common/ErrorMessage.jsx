import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center justify-between my-4 text-sm">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-500 hover:text-rose-700 font-bold ml-4"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
