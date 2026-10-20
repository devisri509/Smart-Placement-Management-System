import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'There are no records to display at this time.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-bold text-slate-800 text-base">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm font-medium">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
