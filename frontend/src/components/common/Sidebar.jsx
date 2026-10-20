import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import BrandMark from './BrandMark';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Target,
  FileCheck,
  BookOpen,
  Bell,
  PlusCircle,
  Building,
  X,
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  if (!user) return null;

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile', icon: User },
    { to: '/student/education', label: 'Education', icon: GraduationCap },
    { to: '/student/skills', label: 'My Skills', icon: Award },
    { to: '/student/jobs', label: 'Browse Jobs', icon: Briefcase },
    { to: '/student/recommended-jobs', label: 'Recommended Jobs', icon: Target },
    { to: '/student/applications', label: 'My Applications', icon: FileCheck },
    { to: '/student/preparation', label: 'Preparation', icon: BookOpen },
    { to: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/post-job', label: 'Post Job Opening', icon: PlusCircle },
    { to: '/recruiter/jobs', label: 'Manage Job Openings', icon: Briefcase },
    { to: '/recruiter/company-profile', label: 'Company Profile', icon: Building },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Manage Students', icon: GraduationCap },
    { to: '/admin/recruiters', label: 'Approve Recruiters', icon: Building },
    { to: '/admin/jobs', label: 'Job Management', icon: Briefcase },
    { to: '/admin/skills', label: 'Skill Taxonomy', icon: Award },
    { to: '/admin/applications', label: 'Application Monitoring', icon: FileCheck },
    { to: '/admin/analytics', label: 'Analytics', icon: Target },
  ];

  const links =
    user.role === ROLES.STUDENT
      ? studentLinks
      : user.role === ROLES.RECRUITER
      ? recruiterLinks
      : user.role === ROLES.ADMIN
      ? adminLinks
      : [];

  const navItems = (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto p-4 gap-6">
        <BrandMark />
        {navItems}
      </aside>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[85vw] h-full bg-white p-4 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <BrandMark />
              <button type="button" onClick={onCloseMobile} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            {navItems}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
