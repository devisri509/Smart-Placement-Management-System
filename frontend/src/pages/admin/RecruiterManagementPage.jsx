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
import { Building, CheckCircle2, Trash2, Eye, Search, Filter, AlertTriangle, ExternalLink, Clock } from 'lucide-react';

const RecruiterManagementPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [recruiterToApprove, setRecruiterToApprove] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const [recruiterToDelete, setRecruiterToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await adminService.getAllRecruiters();
      if (res.success && res.data) {
        setRecruiters(res.data);
      } else {
        setRecruiters(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch corporate recruiter records.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRecruiter = async () => {
    if (!recruiterToApprove) return;
    setApproving(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.approveRecruiter(recruiterToApprove.id);
      if (res.success || res.message) {
        setActionSuccess(`Corporate recruiter "${recruiterToApprove.companyName}" was successfully approved!`);
        fetchRecruiters();
      } else {
        setActionError(res.message || 'Failed to approve recruiter account.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error approving recruiter corporate profile.');
    } finally {
      setApproving(false);
      setIsApproveModalOpen(false);
      setRecruiterToApprove(null);
    }
  };

  const handleDeleteRecruiter = async () => {
    if (!recruiterToDelete) return;
    setDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.deleteRecruiter(recruiterToDelete.id);
      if (res.success || res.message) {
        setActionSuccess(`Corporate recruiter account for "${recruiterToDelete.companyName}" was deleted.`);
        fetchRecruiters();
      } else {
        setActionError(res.message || 'Failed to delete recruiter account.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting recruiter profile.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setRecruiterToDelete(null);
    }
  };

  const filteredRecruiters = recruiters.filter((r) => {
    const isApproved = r.approved ?? r.isApproved;
    const matchesSearch =
      r.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase()) ||
      r.website?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'APPROVED' && isApproved) ||
      (statusFilter === 'PENDING' && !isApproved);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = recruiters.filter((r) => !(r.approved ?? r.isApproved)).length;

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchRecruiters} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Corporate Recruiter Management</h1>
            <p className="text-sm text-slate-300 mt-1">Review corporate profile registrations and approve hiring partners for campus placement.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-right">
              <span className="text-xs text-amber-300 block font-medium">Pending Approvals</span>
              <span className="text-2xl font-black text-amber-400">{pendingCount}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
              <span className="text-xs text-slate-400 block font-medium">Total Partners</span>
              <span className="text-2xl font-black text-sky-400">{recruiters.length}</span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by company name, location, website..."
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
              <option value="ALL">All Account Statuses</option>
              <option value="PENDING">Pending Approval ({pendingCount})</option>
              <option value="APPROVED">Approved Corporate Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Recruiter Table */}
      <Card title={`Recruiter Directory (${filteredRecruiters.length} of ${recruiters.length})`}>
        {filteredRecruiters.length > 0 ? (
          <Table
            headers={['Company Name', 'Location', 'Website', 'Approval Status', 'Actions']}
            data={filteredRecruiters}
            renderRow={(r) => {
              const isApproved = r.approved ?? r.isApproved;
              return (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{r.companyName}</div>
                    {r.industry && <div className="text-xs text-slate-500">{r.industry}</div>}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{r.location || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-indigo-600">
                    {r.website ? (
                      <a href={r.website.startsWith('http') ? r.website : `https://${r.website}`} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                        {r.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={isApproved ? 'success' : 'warning'}>
                      {isApproved ? 'APPROVED' : 'PENDING APPROVAL'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="xs"
                        icon={Eye}
                        onClick={() => {
                          setSelectedRecruiter(r);
                          setIsViewModalOpen(true);
                        }}
                      >
                        View
                      </Button>
                      {!isApproved && (
                        <Button
                          variant="success"
                          size="xs"
                          icon={CheckCircle2}
                          onClick={() => {
                            setRecruiterToApprove(r);
                            setIsApproveModalOpen(true);
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="xs"
                        icon={Trash2}
                        onClick={() => {
                          setRecruiterToDelete(r);
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
          <EmptyState title="No Corporate Recruiters Found" description="No recruiter records match your current search and status filters." />
        )}
      </Card>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="🏢 Corporate Recruiter Details">
        {selectedRecruiter && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {selectedRecruiter.companyName?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{selectedRecruiter.companyName}</h4>
                  <p className="text-xs text-slate-500">{selectedRecruiter.location || 'Location Not Specified'}</p>
                </div>
              </div>
              <Badge variant={(selectedRecruiter.approved ?? selectedRecruiter.isApproved) ? 'success' : 'warning'}>
                {(selectedRecruiter.approved ?? selectedRecruiter.isApproved) ? 'APPROVED' : 'PENDING'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Official Website</span>
                <span className="font-mono text-indigo-600">{selectedRecruiter.website || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Industry Vertical</span>
                <span className="font-bold text-slate-800">{selectedRecruiter.industry || 'Information Technology'}</span>
              </div>
            </div>

            {selectedRecruiter.companyDescription && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-700 block">Company Profile Overview</span>
                <p className="text-slate-600 leading-relaxed">{selectedRecruiter.companyDescription}</p>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600 border-t border-slate-100">
              <div>Recruiter ID: #{selectedRecruiter.id}</div>
              {selectedRecruiter.userId && <div>Associated User ID: #{selectedRecruiter.userId}</div>}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {!(selectedRecruiter.approved ?? selectedRecruiter.isApproved) && (
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setRecruiterToApprove(selectedRecruiter);
                    setIsApproveModalOpen(true);
                  }}
                >
                  Approve Now
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
                Close Modal
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="✅ Approve Recruiter Account">
        {recruiterToApprove && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 space-y-1">
                <p className="font-bold text-sm">Grant Campus Posting Authorization?</p>
                <p>Approving <strong className="font-bold">{recruiterToApprove.companyName}</strong> will allow them to post official campus placement and internship jobs to all students.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsApproveModalOpen(false)} disabled={approving}>
                Cancel
              </Button>
              <Button variant="success" size="sm" onClick={handleApproveRecruiter} loading={approving}>
                Confirm & Approve Partner
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="⚠️ Confirm Account Deletion">
        {recruiterToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 space-y-1">
                <p className="font-bold text-sm">Delete Corporate Account?</p>
                <p>Permanently remove recruiter profile for <strong className="font-bold">{recruiterToDelete.companyName}</strong> from database.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteRecruiter} loading={deleting}>
                Confirm & Delete Account
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecruiterManagementPage;
