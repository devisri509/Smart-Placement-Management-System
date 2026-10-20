import React from 'react';
import Badge from './Badge';
import { Clock, User } from 'lucide-react';

const Timeline = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative border-l-2 border-indigo-200 ml-4 my-6 space-y-6">
      {items.map((item, index) => (
        <div key={index} className="relative pl-6">
          {/* Dot */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow"></div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5 hover:border-indigo-300 transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
              <Badge variant={item.status}>{item.status}</Badge>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(item.changedAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium pt-1 leading-relaxed">{item.remarks}</p>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              Updated By: {item.changedBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
