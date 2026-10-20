import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getMyApplications(0, 20);
      if (res.success && res.data && res.data.content) {
        setApplications(res.data.content);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidate applications.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading submitted job applications..." />;
  }

  const tableHeaders = ['Job Title', 'Company', 'Location', 'Skill Match', 'Status', 'Applied Date', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">📝 My Submitted Applications</h1>
        <p className="text-sm text-slate-300 mt-1">
          Track multi-stage recruitment status transitions and view interview audit trail logs.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <Card title="Submitted Job Applications">
        <Table
          headers={tableHeaders}
          data={applications}
          emptyMessage="You have not submitted any job applications yet."
          renderRow={(app) => (
            <tr key={app.id} className="hover:bg-slate-50 transition">
              <td className="px-4 py-3.5 font-bold text-slate-900">{app.job.title}</td>
              <td className="px-4 py-3.5 text-slate-700 text-xs font-medium">{app.job.recruiter?.companyName || 'Corporate Enterprise'}</td>
              <td className="px-4 py-3.5 text-slate-600 text-xs">{app.job.location}</td>
              <td className="px-4 py-3.5 font-bold text-indigo-600 text-xs">{app.skillMatchPercentage}%</td>
              <td className="px-4 py-3.5">
                <Badge variant={app.status}>{app.status}</Badge>
              </td>
              <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">
                {new Date(app.appliedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3.5">
                <Link to={`/student/applications/${app.id}`}>
                  <Button variant="outline" size="xs">
                    View Audit Log &rarr;
                  </Button>
                </Link>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default MyApplications;
