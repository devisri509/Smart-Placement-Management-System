import React from 'react';

const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    dark: 'bg-slate-900 text-white border-slate-800',

    // Application Status Badges
    APPLIED: 'bg-slate-100 text-slate-700 border-slate-300',
    SHORTLISTED: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold',
    ASSESSMENT: 'bg-sky-100 text-sky-800 border-sky-300 font-bold',
    TECHNICAL_INTERVIEW: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    HR_INTERVIEW: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    SELECTED: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold shadow-sm',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold border rounded-full ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
