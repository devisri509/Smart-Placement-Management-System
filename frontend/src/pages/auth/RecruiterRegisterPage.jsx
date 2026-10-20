import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const RecruiterRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    description: '',
    website: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.registerRecruiter(formData);
      if (response.success) {
        navigate('/login', { state: { message: 'Recruiter registration submitted for approval! Please log in.' } });
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Recruiter Register</h1>
        <p className="text-sm text-slate-500 mt-1">Create a company recruiter account.</p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Company">
          <div className="form-grid mt-1">
            <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Company name" />
            <Input label="Website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://company.com" />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} required placeholder="Bengaluru, India" className="span-2" />
          </div>
        </Card>

        <Card title="Account">
          <div className="form-grid mt-1">
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="recruiter@company.com" />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
          </div>
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

export default RecruiterRegisterPage;
