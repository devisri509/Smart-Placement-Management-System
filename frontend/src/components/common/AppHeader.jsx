import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import Button from '../ui/Button';

const PAGE_TITLES = {
  '/student/dashboard': 'Dashboard',
  '/student/profile': 'My Profile',
  '/student/education': 'Education',
  '/student/skills': 'My Skills',
  '/student/jobs': 'Browse Jobs',
  '/student/recommended-jobs': 'Recommended Jobs',
  '/student/applications': 'My Applications',
  '/student/preparation': 'Preparation',
  '/student/notifications': 'Notifications',
  '/recruiter/dashboard': 'Dashboard',
  '/recruiter/post-job': 'Post Job',
  '/recruiter/jobs': 'Manage Jobs',
  '/recruiter/company-profile': 'Company Profile',
  '/admin/dashboard': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/recruiters': 'Recruiters',
  '/admin/jobs': 'Jobs',
  '/admin/skills': 'Skills',
  '/admin/analytics': 'Analytics',
};

const resolveTitle = (pathname) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/student/jobs/')) return 'Job Details';
  if (pathname.startsWith('/student/applications/')) return 'Application';
  if (pathname.includes('/applicants')) return 'Applicants';
  return 'Smart Placement';
};

const AppHeader = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const roleLabel = user?.role?.replace('ROLE_', '') || '';
  const isStudent = user?.role === ROLES.STUDENT;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="page-container h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
            {resolveTitle(location.pathname)}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-slate-900">{user?.fullName || user?.email}</span>
            <span className="text-xs text-indigo-600 font-medium">{roleLabel}</span>
          </div>

          {isStudent ? (
            <Link
              to="/student/notifications"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
          ) : (
            <span className="p-2 rounded-lg text-slate-400" title="Notifications">
              <Bell className="w-5 h-5" />
            </span>
          )}

          <Button variant="outline" size="sm" onClick={handleLogout} icon={LogOut}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
