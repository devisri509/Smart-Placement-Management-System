import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const StudentNotifications = () => {
  const notifications = [
    { title: 'Application Shortlisted', message: 'Your application for Java Software Engineer at Apex Solutions has been Shortlisted!', date: 'Today, 2:30 PM', type: 'SHORTLISTED' },
    { title: 'New Matching Job Alert', message: 'InnovateX Labs posted a new job requiring Java & Spring Boot (Match Score 90%).', date: 'Yesterday', type: 'APPLIED' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">🔔 System Notifications & Placement Alerts</h1>
        <p className="text-sm text-slate-300 mt-1">Real-time alerts for application status updates and job matches.</p>
      </div>

      <Card title="Notifications Feed">
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white flex items-start justify-between shadow-sm hover:border-indigo-300 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Badge variant={n.type}>{n.title}</Badge>
                  <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium pt-1">{n.message}</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1 flex-shrink-0"></span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentNotifications;
