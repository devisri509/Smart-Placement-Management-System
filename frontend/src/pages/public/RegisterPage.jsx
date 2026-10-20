import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, GraduationCap, Building2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const RegisterPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    rollNumber: '',
    branch: 'CSE',
    cgpa: '8.0',
    graduationYear: '2026',
    activeBacklogs: '0',
    companyName: '',
    website: '',
    description: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = role === 'STUDENT' ? '/auth/register/student' : '/auth/register/recruiter';

    try {
      const res = await api.post(endpoint, formData);
      if (res.data.success) {
        navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Create Your Account</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.25rem' }}>Select your user role to complete registration</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`btn ${role === 'STUDENT' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setRole('STUDENT')}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button
            type="button"
            className={`btn ${role === 'RECRUITER' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setRole('RECRUITER')}
          >
            <Building2 size={18} /> Recruiter
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} />
          </div>

          {role === 'STUDENT' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" className="form-input" required value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input type="text" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input type="text" name="rollNumber" className="form-input" required value={formData.rollNumber} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select name="branch" className="form-select" value={formData.branch} onChange={handleChange}>
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="ECE">Electronics & Comm (ECE)</option>
                    <option value="EEE">Electrical & Electronics (EEE)</option>
                    <option value="MECH">Mechanical Eng (MECH)</option>
                    <option value="CIVIL">Civil Eng (CIVIL)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">CGPA *</label>
                  <input type="number" step="0.01" name="cgpa" className="form-input" required value={formData.cgpa} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Grad Year *</label>
                  <input type="number" name="graduationYear" className="form-input" required value={formData.graduationYear} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Backlogs</label>
                  <input type="number" name="activeBacklogs" className="form-input" value={formData.activeBacklogs} onChange={handleChange} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" name="companyName" className="form-input" required value={formData.companyName} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input type="url" name="website" className="form-input" value={formData.website} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Account</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
