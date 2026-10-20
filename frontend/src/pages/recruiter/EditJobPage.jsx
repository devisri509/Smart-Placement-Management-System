import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Notification from '../../components/common/Notification';

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'FULL_TIME',
    packageOrStipend: 0,
    minCgpa: 0,
    allowedBranches: '',
    minGraduationYear: 2026,
    maxBacklogsAllowed: 0,
    openings: 1,
    deadline: '',
  });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await jobService.getJobById(id);
      if (res.success && res.data) {
        const job = res.data;
        const formattedDeadline = job.deadline ? job.deadline.split('T')[0] : '';
        setFormData({
          title: job.title || '',
          description: job.description || '',
          location: job.location || '',
          jobType: job.jobType || 'FULL_TIME',
          packageOrStipend: job.packageOrStipend || 0,
          minCgpa: job.minCgpa || 0,
          allowedBranches: job.allowedBranches || '',
          minGraduationYear: job.minGraduationYear || 2026,
          maxBacklogsAllowed: job.maxBacklogsAllowed || 0,
          openings: job.openings || 1,
          deadline: formattedDeadline,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job posting details for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const res = await jobService.updateJob(id, formData);
      if (res.success) {
        setSuccess('Job opening details updated successfully!');
        setTimeout(() => {
          navigate('/recruiter/jobs');
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job posting.');
    } finally {
      setUpdating(false);
    }
  };

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Full Time Placement' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'INTERNSHIP_WITH_PPO', label: 'Internship with PPO Option' },
  ];

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error && !formData.title) {
    return <ErrorState message={error} onRetry={fetchJobDetails} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/recruiter/jobs" className="text-indigo-600 font-bold hover:underline text-xs inline-block">
        &larr; Back to Managed Jobs
      </Link>

      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black">Edit Placement Job Posting</h1>
        <p className="text-sm text-slate-300">
          Update job details, package, eligibility criteria, and application deadline.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold underline text-rose-900 ml-2">Dismiss</button>
        </div>
      )}
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="1. Job Overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
            <Select label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange} options={jobTypeOptions} required />
            <Input label="Office Location" name="location" value={formData.location} onChange={handleChange} required />
            <Input label="Package / Stipend (INR per Annum)" type="number" name="packageOrStipend" value={formData.packageOrStipend} onChange={handleChange} required />
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Detailed Description & Responsibilities *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>
        </Card>

        <Card title="2. Automated Eligibility Criteria">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Input label="Minimum CGPA (0 - 10)" type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleChange} required />
            <Input label="Allowed Branches" name="allowedBranches" value={formData.allowedBranches} onChange={handleChange} required />
            <Input label="Min Graduation Year" type="number" name="minGraduationYear" value={formData.minGraduationYear} onChange={handleChange} required />
            <Input label="Max Backlogs Allowed" type="number" name="maxBacklogsAllowed" value={formData.maxBacklogsAllowed} onChange={handleChange} required />
            <Input label="Total Openings" type="number" name="openings" value={formData.openings} onChange={handleChange} required />
            <Input label="Application Deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
          </div>
        </Card>

        <Button type="submit" variant="primary" size="lg" loading={updating} className="w-full py-4 text-base font-bold shadow-lg shadow-indigo-600/30">
          Save & Update Job Posting &rarr;
        </Button>
      </form>
    </div>
  );
};

export default EditJobPage;
