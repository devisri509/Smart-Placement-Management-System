import React from 'react';

const Card = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="font-semibold text-slate-900 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
