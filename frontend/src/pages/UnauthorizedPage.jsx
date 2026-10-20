import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md text-center shadow-lg p-8">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
          403
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          You do not have the required role or permission to view this resource.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary" size="md">
              Go to Home
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="md">
              Switch Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
