import React from 'react';

const ProgressBar = ({ value = 0, max = 100, label, showPercentage = true, variant = 'primary', size = 'md', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variants = {
    primary: 'bg-indigo-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    sky: 'bg-sky-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-700">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-bold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${heights[size] || heights.md}`}>
        <div
          className={`${variants[variant] || variants.primary} ${heights[size] || heights.md} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
