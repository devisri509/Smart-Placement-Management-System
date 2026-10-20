import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { Briefcase, Users, PlusCircle, Building, CheckCircle2, Target } from 'lucide-react';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicantsCount, setApplicantsCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [offersSelectedCount, setOffersSelectedCount] = useState(0);

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await jobService.getRecruiterJobs();
      if (res.success && res.data) {
        const recruiterJobs = Array.isArray(res.data) ? res.data : res.data.content || [];
        setJobs(recruiterJobs);

        if (recruiterJobs.length > 0) {
          try {
            const applicantResults = await Promise.all(
              recruiterJobs.map((j) => applicationService.getJobApplicants(j.id).catch(() => null))
            );

            let totalApps = 0;
            let totalShortlisted = 0;
            let totalSelected = 0;

            applicantResults.forEach((appRes) => {
              if (appRes && appRes.success && appRes.data) {
                const pageData = appRes.data;
                const count = pageData.totalElements ?? (Array.isArray(pageData) ? pageData.length : pageData.content?.length ?? 0);
                totalApps += count;

                const list = Array.isArray(pageData) ? pageData : pageData.content || [];
                totalShortlisted += list.filter(
                  (a) => a.status === 'SHORTLISTED' || a.status === 'TECHNICAL_INTERVIEW' || a.status === 'HR_INTERVIEW' || a.status === 'ASSESSMENT'
                ).length;
                totalSelected += list.filter((a) => a.status === 'SELECTED').length;
              }
            });

            setApplicantsCount(totalApps);
            setShortlistedCount(totalShortlisted);
            setOffersSelectedCount(totalSelected);
          } catch (appErr) {
            setApplicantsCount(0);
            setShortlistedCount(0);
            setOffersSelectedCount(0);
          }
        } else {
          setApplicantsCount(0);
          setShortlistedCount(0);
          setOffersSelectedCount(0);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recruiter openings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchRecruiterData} />;
  }

  const activeJobsCount = jobs.filter((j) => j.active ?? j.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            Recruiter Portal Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.fullName || 'Recruiter'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Manage your campus postings, review candidates, and update placement status rounds.
          </p>
        </div>

        <Button variant="primary" size="lg" icon={PlusCircle} className="shadow-lg shadow-indigo-600/30" onClick={() => navigate('/recruiter/post-job')}>
          Post New Job Opening
        </Button>
      </div>

      {/* 5 Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Openings"
          value={activeJobsCount}
          description="Currently Accepting"
          icon={Briefcase}
          color="indigo"
          onClick={() => navigate('/recruiter/jobs')}
        />
        <StatCard
          title="Total Postings"
          value={jobs.length}
          description="All Created Jobs"
          icon={Building}
          color="sky"
          onClick={() => navigate('/recruiter/jobs')}
        />
        <StatCard
          title="Applicants"
          value={applicantsCount}
          description="Total Submissions"
          icon={Users}
          color="purple"
          onClick={() => navigate(jobs.length > 0 ? `/recruiter/jobs/${jobs[0].id}/applicants` : '/recruiter/jobs')}
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          description="Passed Screening"
          icon={Target}
          color="emerald"
          onClick={() => navigate(jobs.length > 0 ? `/recruiter/jobs/${jobs[0].id}/applicants` : '/recruiter/jobs')}
        />
        <StatCard
          title="Offers Selected"
          value={offersSelectedCount}
          description="Placed Candidates"
          icon={CheckCircle2}
          color="amber"
          className="col-span-2 sm:col-span-1"
          onClick={() => navigate(jobs.length > 0 ? `/recruiter/jobs/${jobs[0].id}/applicants` : '/recruiter/jobs')}
        />
      </div>

      {/* Managed Job Openings Table */}
      <Card title="📋 Active Placement Job Postings" subtitle="Manage candidates and application pipelines">
        {jobs.length > 0 ? (
          <Table
            headers={['Job Title', 'Type', 'Location', 'Min CGPA', 'Openings', 'Status', 'Actions']}
            data={jobs}
            renderRow={(job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5 font-bold text-slate-900">{job.title}</td>
                <td className="px-4 py-3.5">
                  <Badge variant="primary">{job.jobType?.replace('_', ' ')}</Badge>
                </td>
                <td className="px-4 py-3.5 text-slate-600 text-xs">{job.location}</td>
                <td className="px-4 py-3.5 font-extrabold text-indigo-600 text-xs">{job.minCgpa}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">{job.openings}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={(job.active ?? job.isActive) ? 'success' : 'danger'}>
                    {(job.active ?? job.isActive) ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <Button variant="outline" size="xs" onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}>
                    View Applicants &rarr;
                  </Button>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState
            title="No Job Openings Posted Yet"
            description="Create your first placement or internship posting to start receiving candidates."
            actionText="Post New Job Opening"
            onAction={() => (window.location.href = '/recruiter/post-job')}
          />
        )}
      </Card>
    </div>
  );
};

export default RecruiterDashboard;
