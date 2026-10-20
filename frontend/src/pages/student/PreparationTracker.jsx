import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Loading from '../../components/common/Loading';

const PreparationTracker = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await studentService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading candidate preparation tracker..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">📚 Preparation Progress & Skill Gap Learning Tracker</h1>
        <p className="text-sm text-slate-300 mt-1">
          Track learning milestones for technical skills identified by the Placement Intelligence Engine.
        </p>
      </div>

      <Card title="🎯 Recommended Skill Learning Paths" subtitle="Bridge identified skill gaps for targeted companies">
        <div className="space-y-4">
          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Java Enterprise Architecture & Spring Boot</h4>
                <p className="text-xs text-slate-500">Backend System Microservices & REST Services</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                75% Completed
              </span>
            </div>
            <ProgressBar value={75} max={100} showPercentage={false} variant="success" size="md" />
          </div>

          <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-base">React.js Single Page Web Applications</h4>
                <p className="text-xs text-slate-500">Frontend State Management & API Integration</p>
              </div>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                50% Completed
              </span>
            </div>
            <ProgressBar value={50} max={100} showPercentage={false} variant="primary" size="md" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PreparationTracker;
