import React from 'react';

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 animate-pulse w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-slate-200/70 rounded-2xl border border-slate-200 space-y-3">
          <div className="h-4 bg-slate-300 rounded w-1/3"></div>
          <div className="h-3 bg-slate-300 rounded w-2/3"></div>
          <div className="h-3 bg-slate-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
