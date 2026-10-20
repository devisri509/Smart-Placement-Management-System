import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

const ManageJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await jobService.getRecruiterJobs();
      if (res.success && res.data) {
        setJobs(Array.isArray(res.data) ? res.data : res.data.content || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job postings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchJobs} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Manage Job Postings</h1>
          <p className="text-sm text-slate-300 mt-1">Review active corporate job postings and candidate applications.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/recruiter/post-job')}>
          + Post New Job
        </Button>
      </div>

      <Card title="Corporate Postings List">
        {jobs.length > 0 ? (
          <Table
            headers={['Title', 'Job Type', 'Location', 'Min CGPA', 'Deadline', 'Status', 'Action']}
            data={jobs}
            renderRow={(j) => (
              <tr key={j.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5 font-bold text-slate-900">{j.title}</td>
                <td className="px-4 py-3.5"><Badge variant="primary">{j.jobType}</Badge></td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{j.location}</td>
                <td className="px-4 py-3.5 font-bold text-indigo-600 text-xs">{j.minCgpa}</td>
                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">{new Date(j.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-3.5"><Badge variant={(j.active ?? j.isActive) ? 'success' : 'danger'}>{(j.active ?? j.isActive) ? 'ACTIVE' : 'INACTIVE'}</Badge></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="xs" onClick={() => navigate(`/recruiter/jobs/${j.id}/applicants`)}>
                      View Applicants &rarr;
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => navigate(`/recruiter/jobs/${j.id}`)}>
                      Details
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => navigate(`/recruiter/jobs/${j.id}/edit`)}>
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No Jobs Found" description="You have not created any job postings yet." />
        )}
      </Card>
    </div>
  );
};

export default ManageJobsPage;
