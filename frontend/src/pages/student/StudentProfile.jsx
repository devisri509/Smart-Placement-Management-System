import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Notification from '../../components/common/Notification';

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    phone: '',
    branch: '',
    cgpa: 0,
    graduationYear: 2026,
    activeBacklogs: 0,
    resumeUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await studentService.getProfile();
      if (response.success && response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          rollNumber: response.data.rollNumber || '',
          phone: response.data.phone || '',
          branch: response.data.branch || 'CSE',
          cgpa: response.data.cgpa || 0.0,
          graduationYear: response.data.graduationYear || 2026,
          activeBacklogs: response.data.activeBacklogs || 0,
          resumeUrl: response.data.resumeUrl || '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidate profile.');
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
      const response = await studentService.updateProfile(formData);
      if (response.success) {
        setSuccess('Candidate academic profile updated successfully!');
      } else {
        setError(response.message || 'Profile update failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading message="Fetching student profile details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">👤 Candidate Academic Profile</h1>
        <p className="text-sm text-slate-300 mt-1">
          Maintain accurate CGPA, branch, backlog, and resume data for automated eligibility screening.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      <Card title="Academic & Contact Profile Details">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <Input label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm font-medium text-slate-700">Engineering Branch *</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <Input label="Cumulative CGPA (0 - 10)" type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Graduation Year" type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required />
            <Input label="Active Backlogs Count" type="number" name="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} required />
          </div>

          <Input label="Resume PDF Document URL" type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/my-resume.pdf" />

          <Button type="submit" variant="primary" className="w-full py-3 mt-4 text-base" loading={updating}>
            Save Student Candidate Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfile;
