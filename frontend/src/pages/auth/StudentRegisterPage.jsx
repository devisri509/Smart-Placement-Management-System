import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudentRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    rollNumber: '',
    branch: 'CSE',
    cgpa: 8.5,
    graduationYear: 2026,
    activeBacklogs: 0,
    resumeUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.registerStudent(formData);
      if (response.success) {
        navigate('/login', { state: { message: 'Student registration successful! Please log in.' } });
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const branchOptions = [
    { value: 'CSE', label: 'Computer Science & Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'ECE', label: 'Electronics & Communication' },
    { value: 'EEE', label: 'Electrical & Electronics' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'CIVIL', label: 'Civil Engineering' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Student Register</h1>
        <p className="text-sm text-slate-500 mt-1">Create your candidate profile.</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Account">
          <div className="form-grid mt-1">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full name" />
            <Input label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required placeholder="CS2026_01" />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@gmail.com" />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" className="span-2" />
          </div>
        </Card>

        <Card title="Academics">
          <div className="form-grid mt-1">
            <Select label="Branch" name="branch" value={formData.branch} onChange={handleChange} options={branchOptions} required />
            <Input label="CGPA" type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} required />
            <Input label="Graduation Year" type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required />
            <Input label="Active Backlogs" type="number" name="activeBacklogs" value={formData.activeBacklogs} onChange={handleChange} required />
          </div>
        </Card>

        <Card title="Resume">
          <Input label="Resume URL" type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/resume.pdf" />
        </Card>

        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
          Register
        </Button>

        <p className="text-sm text-center text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegisterPage;
