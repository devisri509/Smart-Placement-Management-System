import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import AppHeader from '../components/common/AppHeader';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import StudentRegisterPage from '../pages/auth/StudentRegisterPage';
import RecruiterRegisterPage from '../pages/auth/RecruiterRegisterPage';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/StudentProfile';
import EducationManager from '../pages/student/EducationManager';
import SkillsManager from '../pages/student/SkillsManager';
import JobSearch from '../pages/student/JobSearch';
import JobDetails from '../pages/student/JobDetails';
import RecommendedJobs from '../pages/student/RecommendedJobs';
import MyApplications from '../pages/student/MyApplications';
import ApplicationDetails from '../pages/student/ApplicationDetails';
import PreparationTracker from '../pages/student/PreparationTracker';
import StudentNotifications from '../pages/student/StudentNotifications';

import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import CreateJobPage from '../pages/recruiter/CreateJobPage';
import EditJobPage from '../pages/recruiter/EditJobPage';
import ManageJobsPage from '../pages/recruiter/ManageJobsPage';
import RecruiterJobDetailsPage from '../pages/recruiter/RecruiterJobDetailsPage';
import JobApplicantsPage from '../pages/recruiter/JobApplicantsPage';
import RecruiterCompanyProfile from '../pages/recruiter/RecruiterCompanyProfile';

import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentManagementPage from '../pages/admin/StudentManagementPage';
import RecruiterManagementPage from '../pages/admin/RecruiterManagementPage';
import JobManagementPage from '../pages/admin/JobManagementPage';
import SkillManagementPage from '../pages/admin/SkillManagementPage';
import ApplicationMonitoringPage from '../pages/admin/ApplicationMonitoringPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';

import UnauthorizedPage from '../pages/UnauthorizedPage';
import { ROLES } from '../utils/constants';

const PublicShell = () => (
  <div className="public-shell">
    <Navbar />
    <main>
      <div className="page-container page-stack">
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

const AuthShell = () => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="auth-shell">
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />
      <div className="auth-body">
        <AppHeader onToggleMobileSidebar={() => setIsMobileOpen((open) => !open)} />
        <main>
          <div className="page-container page-stack">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Unprotected Routes */}
      <Route element={<PublicShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/student" element={<StudentRegisterPage />} />
        <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]} />}>
        <Route element={<AuthShell />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/education" element={<EducationManager />} />
          <Route path="/student/skills" element={<SkillsManager />} />
          <Route path="/student/jobs" element={<JobSearch />} />
          <Route path="/student/jobs/:id" element={<JobDetails />} />
          <Route path="/student/recommended-jobs" element={<RecommendedJobs />} />
          <Route path="/student/applications" element={<MyApplications />} />
          <Route path="/student/applications/:id" element={<ApplicationDetails />} />
          <Route path="/student/preparation" element={<PreparationTracker />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
        </Route>
      </Route>

      {/* Protected Recruiter Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]} />}>
        <Route element={<AuthShell />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<CreateJobPage />} />
          <Route path="/recruiter/jobs" element={<ManageJobsPage />} />
          <Route path="/recruiter/jobs/:id" element={<RecruiterJobDetailsPage />} />
          <Route path="/recruiter/jobs/:id/edit" element={<EditJobPage />} />
          <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicantsPage />} />
          <Route path="/recruiter/company-profile" element={<RecruiterCompanyProfile />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AuthShell />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentManagementPage />} />
          <Route path="/admin/recruiters" element={<RecruiterManagementPage />} />
          <Route path="/admin/jobs" element={<JobManagementPage />} />
          <Route path="/admin/skills" element={<SkillManagementPage />} />
          <Route path="/admin/applications" element={<ApplicationMonitoringPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>

      {/* Catch-all Fallback Route */}
      <Route element={<PublicShell />}>
        <Route path="*" element={<LandingPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
