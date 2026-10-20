import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'System Error Occurred',
  message = 'Failed to communicate with Placement System backend services.',
  onRetry,
}) => {
  return (
    <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-rose-900 text-base">{title}</h4>
      <p className="text-xs text-rose-700 max-w-md font-medium">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-2">
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
