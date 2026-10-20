import React from 'react';
import Badge from './Badge';

const SkillChip = ({ name, proficiency, category, isMatched = true, onRemove }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm ${
      isMatched
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
        : 'bg-amber-50 text-amber-800 border-amber-200'
    }`}>
      <span>{name}</span>
      {proficiency && (
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
          {proficiency}
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-rose-600 transition font-bold ml-1"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SkillChip;
