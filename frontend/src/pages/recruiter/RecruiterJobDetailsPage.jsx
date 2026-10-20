import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { Building, MapPin, Briefcase, Calendar, Users, Award, ShieldAlert } from 'lucide-react';

const RecruiterJobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await jobService.getJobById(id);
      if (res.success && res.data) {
        setJob(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job posting details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error || !job) {
    return <ErrorState message={error || 'Job posting not found.'} onRetry={fetchJobDetails} />;
  }

  const isJobActive = job.active ?? job.isActive;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/recruiter/jobs" className="text-indigo-600 font-bold hover:underline text-xs inline-block">
        &larr; Back to Managed Jobs
      </Link>

      {/* Header Info */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              {job.recruiter?.companyName || 'Corporate Job Posting'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{job.title}</h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.jobType}</span>
            </p>
          </div>
          <Badge variant={isJobActive ? 'success' : 'danger'}>
            {isJobActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="primary" size="sm" onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}>
            View Applicants &rarr;
          </Button>
          <Button variant="outline" size="sm" className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700" onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}>
            Edit Job Details
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Package / Stipend</p>
          <p className="text-lg font-black text-indigo-600 mt-1">₹{job.packageOrStipend?.toLocaleString() || 'N/A'}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Min CGPA</p>
          <p className="text-lg font-black text-emerald-600 mt-1">{job.minCgpa}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Openings</p>
          <p className="text-lg font-black text-slate-900 mt-1">{job.openings}</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Deadline</p>
          <p className="text-xs font-mono font-bold text-rose-600 mt-2">{new Date(job.deadline).toLocaleDateString()}</p>
        </Card>
      </div>

      {/* Detailed Description */}
      <Card title="Job Description & Responsibilities">
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed mt-2">{job.description}</p>
      </Card>

      {/* Automated Eligibility Requirements */}
      <Card title="Eligibility & Screening Criteria">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Allowed Branches</span>
            <span className="font-bold text-slate-900">{job.allowedBranches}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Min Graduation Year</span>
            <span className="font-bold text-slate-900">{job.minGraduationYear || 'Any'}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Max Backlogs Allowed</span>
            <span className="font-bold text-slate-900">{job.maxBacklogsAllowed}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-semibold text-slate-600">Created On</span>
            <span className="font-mono text-slate-800">{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* Required Technical Skills */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <Card title="Required Skills Taxonomy">
          <div className="flex flex-wrap gap-2 mt-2">
            {job.requiredSkills.map((sk) => (
              <span
                key={sk.id}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center gap-2"
              >
                <span>{sk.skill?.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900 uppercase font-bold">
                  {sk.minimumProficiency}
                </span>
                {sk.mandatory && <span className="text-[10px] text-rose-600 font-bold">*Mandatory</span>}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecruiterJobDetailsPage;
