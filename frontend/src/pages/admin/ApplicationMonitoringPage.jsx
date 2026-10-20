import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { FileCheck, Search, Filter, Eye, CheckCircle2, XCircle, Clock, Target, Building, GraduationCap, Calendar, Award } from 'lucide-react';

const ApplicationMonitoringPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await adminService.getAllApplications({ size: 200 });
      if (res.success && res.data) {
        setApplications(res.data.content || res.data || []);
      } else {
        setApplications(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch system student placement applications.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'SELECTED':
        return 'success';
      case 'SHORTLISTED':
      case 'ASSESSMENT':
      case 'TECHNICAL_INTERVIEW':
      case 'HR_INTERVIEW':
        return 'primary';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'danger';
      case 'APPLIED':
      default:
        return 'warning';
    }
  };

  const filteredApplications = applications.filter((app) => {
    const studentName = app.student?.fullName || '';
    const rollNumber = app.student?.rollNumber || '';
    const jobTitle = app.job?.title || '';
    const companyName = app.job?.recruiter?.companyName || '';

    const matchesSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const appliedCount = applications.filter((a) => a.status === 'APPLIED').length;
  const shortlistedCount = applications.filter((a) =>
    ['SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'].includes(a.status)
  ).length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchApplications} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Global Application Audit & Monitoring</h1>
            <p className="text-sm text-slate-300 mt-1">Live database audit of student candidate applications across all corporate jobs.</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Submissions</span>
            <span className="text-2xl font-black text-indigo-400">{applications.length}</span>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by student name, roll number, job, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="APPLIED">Applied ({appliedCount})</option>
              <option value="SHORTLISTED">Shortlisted ({shortlistedCount})</option>
              <option value="SELECTED">Selected / Placed ({selectedCount})</option>
              <option value="REJECTED">Rejected ({rejectedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Applied"
          value={appliedCount}
          description="Pending Screening"
          icon={Clock}
          color="sky"
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          description="Interview Pipeline"
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Selected"
          value={selectedCount}
          description="Offers Issued"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          description="Not Selected"
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Table Card */}
      <Card title={`Application Monitoring Audit Trail (${filteredApplications.length} of ${applications.length})`}>
        {filteredApplications.length > 0 ? (
          <Table
            headers={['ID', 'Candidate Student', 'Job Title & Company', 'Skill Match', 'Applied Date', 'Current Status', 'Actions']}
            data={filteredApplications}
            renderRow={(app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500">#{app.id}</td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 text-sm">{app.student?.fullName || 'Candidate'}</div>
                  <div className="text-xs text-slate-500 font-mono">{app.student?.rollNumber || 'N/A'} &bull; {app.student?.branch || 'N/A'}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-indigo-900 text-sm">{app.job?.title || 'Job Opening'}</div>
                  <div className="text-xs text-slate-600 font-semibold">{app.job?.recruiter?.companyName || 'Corporate Partner'}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                    {app.matchScore != null ? `${Math.round(app.matchScore)}%` : app.skillMatchPercentage != null ? `${Math.round(app.skillMatchPercentage)}%` : 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                  {app.appliedDate || app.createdAt ? new Date(app.appliedDate || app.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={getStatusBadgeVariant(app.status)}>
                    {app.status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Eye}
                    onClick={() => {
                      setSelectedApp(app);
                      setIsViewModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No Applications Found" description="No student application records match your current search and filter settings." />
        )}
      </Card>

      {/* Application Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="📄 Application Audit Record">
        {selectedApp && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{selectedApp.job?.title || 'Job Opening'}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-semibold">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  {selectedApp.job?.recruiter?.companyName || 'Corporate Enterprise'}
                </p>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedApp.status)}>
                {selectedApp.status}
              </Badge>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
              <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" /> Candidate Student Profile
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Student Name</span>
                  <span className="font-bold text-slate-900">{selectedApp.student?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Roll Number</span>
                  <span className="font-mono text-slate-800">{selectedApp.student?.rollNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Branch</span>
                  <span className="font-semibold text-slate-700">{selectedApp.student?.branch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">CGPA</span>
                  <span className="font-black text-emerald-600">{selectedApp.student?.cgpa ?? 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-indigo-600 font-semibold block">Skill Match Percentage</span>
                <span className="font-black text-lg text-indigo-900">
                  {selectedApp.matchScore != null ? `${Math.round(selectedApp.matchScore)}%` : selectedApp.skillMatchPercentage != null ? `${Math.round(selectedApp.skillMatchPercentage)}%` : 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Submission Date</span>
                <span className="font-mono text-slate-800 font-bold">
                  {selectedApp.appliedDate || selectedApp.createdAt ? new Date(selectedApp.appliedDate || selectedApp.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-600 border-t border-slate-100">
              <div>Application ID: #{selectedApp.id}</div>
              <div>Job ID: #{selectedApp.job?.id || 'N/A'} &bull; Student ID: #{selectedApp.student?.id || 'N/A'}</div>
            </div>

            <div className="pt-2 text-right">
              <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicationMonitoringPage;
