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
import { Eye, Trash2, Search, Filter, AlertTriangle, GraduationCap, Award, BookOpen } from 'lucide-react';

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState('0');

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await adminService.getAllStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      } else {
        setStudents(res.data || []);
      }
    } catch (err) {
      setError('Failed to fetch candidate records from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.deleteStudent(studentToDelete.id);
      if (res.success || res.message) {
        setActionSuccess(`Student profile for "${studentToDelete.fullName}" was successfully deleted.`);
        fetchStudents();
      } else {
        setActionError(res.message || 'Failed to delete student record.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting student profile.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  const branches = Array.from(new Set(students.map((s) => s.branch).filter(Boolean)));

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.branch?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());

    const matchesBranch = branchFilter === 'ALL' || s.branch === branchFilter;
    const matchesCgpa = (s.cgpa ?? 0) >= parseFloat(minCgpaFilter);

    return matchesSearch && matchesBranch && matchesCgpa;
  });

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchStudents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Student Candidate Directory</h1>
            <p className="text-sm text-slate-300 mt-1">Manage and audit student profiles, academic qualifications, and CGPA metrics.</p>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Registered Candidates</span>
            <span className="text-2xl font-black text-indigo-400">{students.length}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, roll number, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">All Engineering Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="0">All CGPA Scores</option>
              <option value="6.0">Min CGPA &ge; 6.0</option>
              <option value="7.0">Min CGPA &ge; 7.0</option>
              <option value="7.5">Min CGPA &ge; 7.5</option>
              <option value="8.0">Min CGPA &ge; 8.0</option>
              <option value="9.0">Min CGPA &ge; 9.0</option>
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

      {/* Table Card */}
      <Card title={`Candidates List (${filteredStudents.length} of ${students.length})`}>
        {filteredStudents.length > 0 ? (
          <Table
            headers={['Candidate Name', 'Roll Number', 'Branch', 'CGPA', 'Backlogs', 'Grad Year', 'Phone', 'Actions']}
            data={filteredStudents}
            renderRow={(st) => (
              <tr key={st.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 text-sm">{st.fullName}</div>
                  {st.user?.email && <div className="text-xs text-slate-500">{st.user.email}</div>}
                </td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-600 font-medium">{st.rollNumber}</td>
                <td className="px-4 py-3.5 text-xs text-slate-700">{st.branch}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded-md font-extrabold text-xs ${st.cgpa >= 8.0 ? 'bg-emerald-100 text-emerald-800' : st.cgpa >= 6.5 ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                    {st.cgpa ?? 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs">
                  {st.activeBacklogs > 0 ? (
                    <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">{st.activeBacklogs} Active</span>
                  ) : (
                    <span className="text-slate-500">0</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{st.graduationYear}</td>
                <td className="px-4 py-3.5 text-xs text-slate-600 font-mono">{st.phone || 'N/A'}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      icon={Eye}
                      onClick={() => {
                        setSelectedStudent(st);
                        setIsViewModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      icon={Trash2}
                      onClick={() => {
                        setStudentToDelete(st);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No Candidates Match Filters" description="Try adjusting your search criteria or CGPA/branch filters." />
        )}
      </Card>

      {/* View Student Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="🎓 Student Profile Details">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {selectedStudent.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{selectedStudent.fullName}</h4>
                <p className="text-xs text-slate-500 font-mono">{selectedStudent.rollNumber} | {selectedStudent.branch}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Cumulative CGPA</span>
                <span className="font-black text-lg text-emerald-600">{selectedStudent.cgpa ?? 'N/A'} / 10.0</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Active Backlogs</span>
                <span className="font-black text-lg text-slate-800">{selectedStudent.activeBacklogs ?? 0}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Graduation Year</span>
                <span className="font-bold text-slate-700">{selectedStudent.graduationYear ?? 'N/A'}</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-slate-400 font-semibold block">Phone Contact</span>
                <span className="font-bold text-slate-700 font-mono">{selectedStudent.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Additional System Metadata
              </h5>
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600">
                <div>Student Profile ID: #{selectedStudent.id}</div>
                {selectedStudent.userId && <div>User System Account ID: #{selectedStudent.userId}</div>}
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button variant="outline" size="sm" onClick={() => setIsViewModalOpen(false)}>
                Close Modal
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="⚠️ Confirm Student Deletion">
        {studentToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 space-y-1">
                <p className="font-bold text-sm">Are you sure you want to delete this candidate?</p>
                <p>Deleting candidate <strong className="font-mono">{studentToDelete.fullName}</strong> ({studentToDelete.rollNumber}) will permanently delete their profile data from the database.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteStudent} loading={deleting}>
                Confirm & Delete Student
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentManagementPage;
