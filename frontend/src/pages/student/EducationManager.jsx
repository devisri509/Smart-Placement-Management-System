import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Notification from '../../components/common/Notification';

const EducationManager = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    degree: 'B.Tech',
    institution: '',
    fieldOfStudy: 'Computer Science and Engineering',
    startYear: 2022,
    endYear: 2026,
    percentageOrCgpa: 8.5,
  });

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    setLoading(true);
    try {
      const profRes = await studentService.getProfile();
      if (profRes.success && profRes.data) {
        const eduRes = await studentService.getEducation(profRes.data.id);
        if (eduRes.success && eduRes.data) {
          setEducationList(eduRes.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch education records.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);

    try {
      const res = await studentService.addEducation(formData);
      if (res.success) {
        setSuccess('Academic degree record added successfully!');
        setFormData({
          degree: 'B.Tech',
          institution: '',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: 2022,
          endYear: 2026,
          percentageOrCgpa: 8.5,
        });
        fetchEducationData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add academic record.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      const res = await studentService.deleteEducation(id);
      if (res.success) {
        setSuccess('Academic record deleted.');
        fetchEducationData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  if (loading) {
    return <Loading message="Loading candidate academic history..." />;
  }

  const tableHeaders = ['Degree', 'Institution', 'Field of Study', 'Timeline', 'CGPA / %', 'Actions'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">🎓 Academic Education History</h1>
        <p className="text-sm text-slate-300 mt-1">
          Record your secondary, higher secondary, diploma, and undergraduate degree qualifications.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      {/* Add New Academic Record Form */}
      <Card title="Add Qualification Record">
        <form onSubmit={handleAddEducation} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Degree / Qualification" name="degree" value={formData.degree} onChange={handleChange} required placeholder="e.g. B.Tech / Class XII" />
            <Input label="Institution / School" name="institution" value={formData.institution} onChange={handleChange} required placeholder="e.g. National Institute of Technology" />
            <Input label="Field of Study / Major" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required placeholder="e.g. Computer Science" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Start Year" type="number" name="startYear" value={formData.startYear} onChange={handleChange} required />
            <Input label="End Year" type="number" name="endYear" value={formData.endYear} onChange={handleChange} required />
            <Input label="Percentage / CGPA" type="number" step="0.01" name="percentageOrCgpa" value={formData.percentageOrCgpa} onChange={handleChange} required />
          </div>

          <Button type="submit" variant="primary" className="py-2.5 px-6" loading={adding}>
            Add Education Record
          </Button>
        </form>
      </Card>

      {/* Saved Education Records Table */}
      <Card title="Saved Academic History">
        <Table
          headers={tableHeaders}
          data={educationList}
          emptyMessage="No academic records added yet."
          renderRow={(edu) => (
            <tr key={edu.id} className="hover:bg-slate-50 transition">
              <td className="px-4 py-3 font-bold text-slate-800">{edu.degree}</td>
              <td className="px-4 py-3 text-slate-700 text-sm">{edu.institution}</td>
              <td className="px-4 py-3 text-slate-600 text-xs">{edu.fieldOfStudy}</td>
              <td className="px-4 py-3 text-slate-500 font-mono text-xs">{edu.startYear} - {edu.endYear}</td>
              <td className="px-4 py-3 font-extrabold text-emerald-600 text-sm">{edu.percentageOrCgpa}</td>
              <td className="px-4 py-3">
                <Button variant="danger" size="xs" onClick={() => handleDelete(edu.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default EducationManager;
