import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { Briefcase, Eye, Ban, Trash2, Search, Filter, AlertTriangle, Building, MapPin, Calendar, Award, DollarSign } from 'lucide-react';

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [jobToDeactivate, setJobToDeactivate] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await adminService.getAllJobs({ size: 100 });
      if (res.success && res.data) {
        setJobs(res.data.content || res.data || []);
      } else {
        setJobs(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch campus job postings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateJob = async () => {
    if (!jobToDeactivate) return;
    setDeactivating(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.deactivateJob(jobToDeactivate.id);
      if (res.success || res.message) {
        setActionSuccess(`Job opening "${jobToDeactivate.title}" was deactivated.`);
        fetchJobs();
      } else {
        setActionError(res.message || 'Failed to deactivate job opening.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deactivating job posting.');
    } finally {
      setDeactivating(false);
      setIsDeactivateModalOpen(false);
      setJobToDeactivate(null);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.deleteJob(jobToDelete.id);
      if (res.success || res.message) {
        setActionSuccess(`Job opening "${jobToDelete.title}" was deleted.`);
        fetchJobs();
      } else {
        setActionError(res.message || 'Failed to delete job posting.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting job opening.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const isActive = j.active ?? j.isActive;
    const companyName = j.recruiter?.companyName || '';

    const matchesSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());

    const matchesType = jobTypeFilter === 'ALL' || j.jobType === jobTypeFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isActive) ||
      (statusFilter === 'INACTIVE' && !isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeJobsCount = jobs.filter((j) => j.active ?? j.isActive).length;

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJobs} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Job Postings Management</h1>
            <p className="text-sm text-slate-300 mt-1">Audit active placement drives, de-list expired postings, and manage criteria.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl text-right">
              <span className="text-xs text-emerald-300 block font-medium">Active Openings</span>
              <span className="text-2xl font-black text-emerald-400">{activeJobsCount}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
              <span className="text-xs text-slate-400 block font-medium">Total Postings</span>
              <span className="text-2xl font-black text-indigo-400">{jobs.length}</span>
            </div>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search title, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME">Full-Time (FTE)</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="INTERN_PLUS_FTE">Internship + FTE</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only ({activeJobsCount})</option>
              <option value="INACTIVE">Inactive Only ({jobs.length - activeJobsCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Feedback Alerts */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex justify-between items-center">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold rounded-2xl flex justify-between items-center">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-rose-600 hover:text-rose-900">&times;</button>
        </div>
      )}

      {/* Table Card */}
      <Card title={`Job Openings Directory (${filteredJobs.length} of ${jobs.length})`}>
        {filteredJobs.length > 0 ? (
          <Table
            headers={['Job Title', 'Recruiter / Company', 'Location', 'Job Type', 'Min CGPA', 'Status', 'Actions']}
            data={filteredJobs}
            renderRow={(j) => {
              const isActive = j.active ?? j.isActive;
              return (
                <tr key={j.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{j.title}</div>
                    {j.salaryPackage && <div className="text-xs text-emerald-600 font-mono font-semibold">{j.salaryPackage}</div>}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700 font-semibold">
                    {j.recruiter?.companyName || 'Corporate Partner'}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{j.location}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="primary">{j.jobType}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-extrabold text-indigo-600 text-xs">{j.minCgpa ?? 'N/A'}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={isActive ? 'success' : 'danger'}>
                      {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        icon={Eye}
                        onClick={() => {
                          setSelectedJob(j);
                          setIsViewModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                      {isActive && (
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Ban}
                          className="text-amber-600 hover:bg-amber-50"
                          onClick={() => {
                            setJobToDeactivate(j);
                            setIsDeactivateModalOpen(true);
                          }}
                        >
                          Deactivate
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="xs"
                        icon={Trash2}
                        onClick={() => {
                          setJobToDelete(j);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        ) : (
          <EmptyState title="No Jobs Match Search Criteria" description="Try adjusting your filter options or search keyword." />
        )}
      </Card>

      {/* View Job Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="💼 Job Opening Details">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{selectedJob.title}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  {selectedJob.recruiter?.companyName || 'Corporate Enterprise'} &bull; <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedJob.location}
                </p>
              </div>
              <Badge variant={(selectedJob.active ?? selectedJob.isActive) ? 'success' : 'danger'}>
                {(selectedJob.active ?? selectedJob.isActive) ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Job Type</span>
                <span className="font-bold text-indigo-600">{selectedJob.jobType}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Min CGPA Cutoff</span>
                <span className="font-extrabold text-emerald-600">{selectedJob.minCgpa ?? 'N/A'}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Package / Stipend</span>
                <span className="font-mono text-slate-800">{selectedJob.salaryPackage || 'Not Specified'}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Application Deadline</span>
                <span className="font-mono text-slate-800">{selectedJob.applicationDeadline || 'N/A'}</span>
              </div>
            </div>

            {selectedJob.description && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Job Description</span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600 border-t border-slate-100">
              <div>Job ID: #{selectedJob.id}</div>
              {selectedJob.recruiter?.id && <div>Recruiter ID: #{selectedJob.recruiter.id}</div>}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
                Close Modal
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal isOpen={isDeactivateModalOpen} onClose={() => setIsDeactivateModalOpen(false)} title="🚫 Deactivate Job Opening">
        {jobToDeactivate && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold text-sm">Deactivate Job Posting?</p>
                <p>Deactivating <strong className="font-bold">{jobToDeactivate.title}</strong> will mark status as INACTIVE and stop accepting new student applications.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDeactivateModalOpen(false)} disabled={deactivating}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDeactivateJob} loading={deactivating}>
                Confirm & Deactivate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="⚠️ Delete Job Posting">
        {jobToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 space-y-1">
                <p className="font-bold text-sm">Delete Job Permanent Action</p>
                <p>Permanently delete <strong className="font-bold">{jobToDelete.title}</strong> from system database.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteJob} loading={deleting}>
                Confirm & Delete Job
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobManagementPage;
