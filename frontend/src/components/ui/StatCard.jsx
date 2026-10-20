import React from 'react';

const StatCard = ({ title, value, description, icon: Icon, color = 'indigo', className = '', onClick }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const clickableClasses = onClick
    ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm transition-all duration-200 flex items-start justify-between ${clickableClasses} ${className}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        {description && <p className="text-[11px] font-medium text-slate-400 mt-1">{description}</p>}
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl border ${colors[color] || colors.indigo} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
