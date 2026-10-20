import React, { useState, useEffect } from 'react';
import { recruiterService } from '../../services/recruiterService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Notification from '../../components/common/Notification';

const RecruiterCompanyProfile = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    location: '',
    description: '',
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
      const res = await recruiterService.getProfile();
      if (res.success && res.data) {
        setFormData({
          companyName: res.data.companyName || '',
          website: res.data.website || '',
          location: res.data.location || '',
          description: res.data.description || '',
        });
      }
    } catch (err) {
      setError('Failed to load corporate profile.');
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
      const res = await recruiterService.updateProfile(formData);
      if (res.success) {
        setSuccess('Corporate profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update corporate profile.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={2} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-2">
        <h1 className="text-2xl font-black">🏢 Corporate Company Profile</h1>
        <p className="text-sm text-slate-300">Maintain corporate branding details for student candidate visibility.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold underline text-rose-900 ml-2">Dismiss</button>
        </div>
      )}
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      <Card title="Corporate Details">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
            <Input label="Website URL" type="url" name="website" value={formData.website} onChange={handleChange} />
            <Input label="Office Location" name="location" value={formData.location} onChange={handleChange} required className="sm:col-span-2" />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={updating} className="w-full py-3 mt-4">
            Save Corporate Profile
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterCompanyProfile;
