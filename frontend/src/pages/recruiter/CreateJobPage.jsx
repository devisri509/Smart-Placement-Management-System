import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { skillService } from '../../services/skillService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Notification from '../../components/common/Notification';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [masterSkills, setMasterSkills] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Bengaluru, India',
    jobType: 'FULL_TIME',
    packageOrStipend: 1200000,
    minCgpa: 7.5,
    allowedBranches: 'CSE, IT, ECE',
    minGraduationYear: 2026,
    maxBacklogsAllowed: 0,
    openings: 5,
    deadline: '2026-12-31',
    requiredSkills: [],
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await skillService.getAllSkills();
      if (res.success && res.data) {
        setMasterSkills(res.data);
      }
    } catch (err) {}
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await jobService.createJob(formData);
      if (res.success) {
        setSuccess('Job opening created successfully!');
        setTimeout(() => {
          navigate('/recruiter/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setLoading(false);
    }
  };

  const jobTypeOptions = [
    { value: 'FULL_TIME', label: 'Full Time Placement' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'INTERNSHIP_WITH_PPO', label: 'Internship with PPO Option' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black">Post Campus Job Opening</h1>
        <p className="text-sm text-slate-300">
          Define job title, package, CGPA criteria, allowed branches, and required technical skills.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="1. Job Overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} required placeholder="Java Backend Engineer" />
            <Select label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange} options={jobTypeOptions} required />
            <Input label="Office Location" name="location" value={formData.location} onChange={handleChange} required placeholder="Bengaluru / Hybrid" />
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
              placeholder="Describe candidate responsibilities, tech stack, and evaluation process..."
            ></textarea>
          </div>
        </Card>

        <Card title="2. Automated Eligibility Criteria">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Input label="Minimum CGPA (0 - 10)" type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleChange} required />
            <Input label="Allowed Branches" name="allowedBranches" value={formData.allowedBranches} onChange={handleChange} required placeholder="CSE, IT, ECE" />
            <Input label="Min Graduation Year" type="number" name="minGraduationYear" value={formData.minGraduationYear} onChange={handleChange} required />
            <Input label="Max Backlogs Allowed" type="number" name="maxBacklogsAllowed" value={formData.maxBacklogsAllowed} onChange={handleChange} required />
            <Input label="Total Openings" type="number" name="openings" value={formData.openings} onChange={handleChange} required />
            <Input label="Application Deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
          </div>
        </Card>

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full py-4 text-base font-bold shadow-lg shadow-indigo-600/30">
          Publish Job Opening &rarr;
        </Button>
      </form>
    </div>
  );
};

export default CreateJobPage;
