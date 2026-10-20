import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Timeline from '../../components/ui/Timeline';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { ArrowLeft } from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [appRes, histRes] = await Promise.all([
        applicationService.getApplicationById(id),
        applicationService.getApplicationHistory(id),
      ]);

      if (appRes.success && appRes.data) {
        setApplication(appRes.data);
      }
      if (histRes.success && histRes.data) {
        setHistory(histRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch application history log.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error || !application) {
    return <ErrorState message={error || 'Application record not found.'} onRetry={fetchApplicationDetails} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/student/applications" className="text-indigo-600 font-bold hover:underline text-xs inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Applications
      </Link>

      {/* Main Overview Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-indigo-600 text-white rounded-md">
            Application Record #{application.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">{application.job.title}</h1>
          <p className="text-sm font-semibold text-indigo-300">
            {application.job.recruiter?.companyName || 'Corporate Enterprise'} • 📍 {application.job.location}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">Current Status</span>
          <Badge variant={application.status} size="md">
            {application.status}
          </Badge>
          <span className="text-xs text-slate-300 block mt-2 font-mono">Skill Match: {application.skillMatchPercentage}%</span>
        </div>
      </div>

      {/* Status Audit Trail Timeline */}
      <Card title="📜 Application Status Audit Trail Timeline" subtitle="Multi-stage recruitment progression log">
        <Timeline items={history} />
      </Card>
    </div>
  );
};

export default ApplicationDetails;
