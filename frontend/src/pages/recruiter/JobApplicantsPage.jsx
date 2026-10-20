import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const JobApplicantsPage = () => {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedApp, setSelectedApp] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [remarks, setRemarks] = useState('Qualified based on CGPA and technical skill match.');

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await applicationService.getJobApplicants(id);
      if (res.success && res.data) {
        const applicantList = Array.isArray(res.data) ? res.data : (res.data.content || []);
        setApplicants(applicantList);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusModalOpen(true);
  };

  const handleOpenProfileModal = async (appId) => {
    setLoadingProfile(true);
    setProfileModalOpen(true);
    setCandidateProfile(null);

    try {
      const res = await applicationService.getCandidateProfile(appId);
      if (res.success && res.data) {
        setCandidateProfile(res.data);
      }
    } catch (err) {
      alert('Failed to load candidate profile details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    try {
      const res = await applicationService.updateApplicationStatus(selectedApp.id, newStatus, remarks);
      if (res.success) {
        setStatusModalOpen(false);
        fetchApplicants();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <div className="space-y-6">
      <Link to="/recruiter/jobs" className="text-indigo-600 font-bold hover:underline text-xs inline-block">
        &larr; Back to Managed Jobs
      </Link>

      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <h1 className="text-2xl font-black">Candidate Applications Review</h1>
        <p className="text-sm text-slate-300 mt-1">Review student profiles, skill match scores, and update recruitment status rounds.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold underline text-rose-900 ml-2">Dismiss</button>
        </div>
      )}

      <Card title="Submitted Candidate Applications">
        {applicants.length > 0 ? (
          <Table
            headers={['Candidate Name', 'Email', 'Phone', 'Roll Number', 'Branch', 'CGPA', 'Skill Match', 'Status', 'Applied Date', 'Actions']}
            data={applicants}
            renderRow={(app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5 font-bold text-slate-900">{app.student?.fullName || 'Candidate'}</td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{app.student?.user?.email || '-'}</td>
                <td className="px-4 py-3.5 text-xs text-slate-600 font-mono">{app.student?.phone || '-'}</td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-600">{app.student?.rollNumber}</td>
                <td className="px-4 py-3.5 text-xs text-slate-700">{app.student?.branch}</td>
                <td className="px-4 py-3.5 font-extrabold text-emerald-600 text-xs">{app.student?.cgpa}</td>
                <td className="px-4 py-3.5 font-bold text-indigo-600 text-xs">{app.skillMatchPercentage}%</td>
                <td className="px-4 py-3.5"><Badge variant={app.status}>{app.status}</Badge></td>
                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="xs" onClick={() => handleOpenProfileModal(app.id)}>
                      View Profile
                    </Button>
                    <Button variant="primary" size="xs" onClick={() => handleOpenStatusModal(app)}>
                      Status &rarr;
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No Applicants Yet" description="No candidate applications have been submitted for this job opening." />
        )}
      </Card>

      {/* Candidate Profile Details & Skill Match Modal */}
      <Modal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} title="Candidate Profile & Skill Match Report">
        {loadingProfile ? (
          <LoadingSkeleton count={3} />
        ) : candidateProfile ? (
          <div className="space-y-6 pt-2 max-h-[75vh] overflow-y-auto pr-1">
            {/* Student Header */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-start flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">{candidateProfile.student?.fullName}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {candidateProfile.student?.rollNumber} | {candidateProfile.student?.branch} | Graduation: {candidateProfile.student?.graduationYear}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Email: {candidateProfile.student?.user?.email} | Phone: {candidateProfile.student?.phone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block uppercase">CGPA Score</span>
                <span className="text-xl font-black text-emerald-600">{candidateProfile.student?.cgpa} / 10.0</span>
              </div>
            </div>

            {/* Match Score & Skill Gap Analysis */}
            {candidateProfile.skillGap && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">Skill Taxonomy Match Score</span>
                  <span className="text-2xl font-black text-indigo-700">{candidateProfile.skillGap.matchPercentage}%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${candidateProfile.skillGap.matchPercentage}%` }}></div>
                </div>

                {candidateProfile.eligibility && (
                  <div className="text-xs space-y-1 pt-1">
                    <p className="font-bold text-slate-800">
                      Automated Eligibility Check:{' '}
                      <span className={candidateProfile.eligibility.eligible ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                        {candidateProfile.eligibility.eligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                      </span>
                    </p>
                    {candidateProfile.eligibility.failedCriteria?.length > 0 && (
                      <p className="text-rose-600 font-medium">Failed Requirements: {candidateProfile.eligibility.failedCriteria.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Candidate Technical Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Student Technical Skills</h4>
              {candidateProfile.skills && candidateProfile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((s) => (
                    <span key={s.id} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-sm">
                      <span>{s.skill?.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase font-bold">
                        {s.proficiency}
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No skills listed on candidate profile.</p>
              )}
            </div>

            {/* Candidate Education History */}
            {candidateProfile.education && candidateProfile.education.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Education History</h4>
                <div className="space-y-2">
                  {candidateProfile.education.map((e) => (
                    <div key={e.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{e.degree} - {e.fieldOfStudy}</p>
                        <p className="text-slate-500">{e.institution} ({e.startYear} - {e.endYear})</p>
                      </div>
                      <span className="font-bold text-emerald-600">{e.percentageOrCgpa} CGPA/%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No profile data available.</p>
        )}
      </Modal>

      {/* Update Application Status Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Recruitment Status Round">
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Next Status Round *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
            >
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="ASSESSMENT">ASSESSMENT</option>
              <option value="TECHNICAL_INTERVIEW">TECHNICAL_INTERVIEW</option>
              <option value="HR_INTERVIEW">HR_INTERVIEW</option>
              <option value="SELECTED">SELECTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Audit Log Remarks *</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="3"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm"
            ></textarea>
          </div>

          <Button variant="primary" size="md" onClick={handleUpdateStatus} className="w-full">
            Save Status & Log Audit Trail
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default JobApplicantsPage;
