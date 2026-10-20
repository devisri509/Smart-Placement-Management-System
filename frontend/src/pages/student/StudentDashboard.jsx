import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { studentService } from '../../services/studentService';
import { applicationService } from '../../services/applicationService';
import { intelligenceService } from '../../services/intelligenceService';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import StatCard from '../../components/ui/StatCard';
import JobCard from '../../components/ui/JobCard';
import Table from '../../components/ui/Table';
import SkillChip from '../../components/ui/SkillChip';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';

import {
  FileCheck,
  CheckCircle2,
  Calendar,
  Target,
  UserCheck,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const profRes = await studentService.getProfile();
      if (profRes.success && profRes.data) {
        const studentData = profRes.data;
        setProfile(studentData);

        const [eduRes, skillRes, appRes, recRes] = await Promise.all([
          studentService.getEducation(studentData.id).catch(() => ({ data: [] })),
          studentService.getStudentSkills(studentData.id).catch(() => ({ data: [] })),
          applicationService.getMyApplications(0, 10).catch(() => ({ data: { content: [] } })),
          intelligenceService.getRecommendations(studentData.id).catch(() => ({ data: { content: [] } })),
        ]);

        if (eduRes.data) setEducationList(eduRes.data);
        if (skillRes.data) setStudentSkills(skillRes.data);
        if (appRes.data && appRes.data.content) setApplications(appRes.data.content);
        if (recRes.data && recRes.data.content) setRecommendations(recRes.data.content);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.fullName) score += 15;
    if (profile.phone) score += 15;
    if (profile.branch) score += 10;
    if (profile.cgpa && profile.cgpa > 0) score += 15;
    if (profile.graduationYear) score += 10;
    if (profile.resumeUrl) score += 15;
    if (educationList.length > 0) score += 10;
    if (studentSkills.length > 0) score += 10;
    return Math.min(100, score);
  };

  const profileCompletion = calculateProfileCompletion();
  const totalApps = applications.length;
  const countShortlisted = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'ASSESSMENT').length;
  const countInterviews = applications.filter((a) => a.status === 'TECHNICAL_INTERVIEW' || a.status === 'HR_INTERVIEW').length;
  const countSelected = applications.filter((a) => a.status === 'SELECTED').length;

  const interviewApplications = applications.filter(
    (a) => a.status === 'TECHNICAL_INTERVIEW' || a.status === 'HR_INTERVIEW'
  );

  const topRec = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        {profile?.fullName || user?.fullName || 'Student'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Profile Completion" value={`${profileCompletion}%`} icon={UserCheck} color="indigo" />
        <StatCard title="Applications" value={totalApps} icon={FileCheck} color="sky" />
        <StatCard title="Shortlisted" value={countShortlisted} icon={Target} color="purple" />
        <StatCard title="Interviews" value={countInterviews} icon={Calendar} color="amber" />
        <StatCard title="Selected" value={countSelected} icon={CheckCircle2} color="emerald" />
      </div>

      <Card title="Profile Completion">
        <ProgressBar value={profileCompletion} max={100} variant={profileCompletion >= 80 ? 'success' : 'primary'} />
        <div className="mt-3">
          <Link to="/student/profile">
            <Button variant="outline" size="sm">
              Update profile
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Recommended Jobs">
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((item, idx) => (
                  <JobCard
                    key={idx}
                    job={item.job}
                    matchPercentage={item.skillMatchPercentage}
                    eligible={item.eligible}
                    overallScore={item.overallScore}
                    rank={idx + 1}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No recommended jobs"
                description="Add skills to see backend recommendations."
                actionText="My Skills"
                onAction={() => {
                  window.location.href = '/student/skills';
                }}
              />
            )}
          </Card>

          <Card title="Recent Applications">
            {applications.length > 0 ? (
              <Table
                headers={['Job Title', 'Company', 'Status', 'Applied Date', 'Action']}
                data={applications.slice(0, 5)}
                renderRow={(app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{app.job.title}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{app.job.recruiter?.companyName || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={app.status}>{app.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/student/applications/${app.id}`}>
                        <Button variant="outline" size="xs">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )}
              />
            ) : (
              <EmptyState
                title="No applications"
                actionText="Browse Jobs"
                onAction={() => {
                  window.location.href = '/student/jobs';
                }}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Skill Match">
            {topRec ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-3xl font-semibold text-indigo-600">{topRec.skillMatchPercentage}%</p>
                  <p className="text-xs text-slate-500 mt-1">{topRec.job?.title}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {studentSkills.length > 0 ? (
                    studentSkills.map((sk) => (
                      <SkillChip key={sk.id} name={sk.skillName} proficiency={sk.proficiency} isMatched={true} />
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills yet</span>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState title="No skill match data" />
            )}
          </Card>

          <Card title="Skill Gap">
            {topRec?.missingSkills && topRec.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {topRec.missingSkills.map((ms, idx) => (
                  <SkillChip key={idx} name={ms.skillName} isMatched={false} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No skill gaps from the server.</p>
            )}
          </Card>

          <Card title="Upcoming Interviews">
            {interviewApplications.length > 0 ? (
              <div className="space-y-3">
                {interviewApplications.map((app) => (
                  <div key={app.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-center gap-2">
                      <h5 className="font-medium text-sm text-slate-900">{app.job.title}</h5>
                      <Badge variant={app.status} size="xs">
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{app.job.recruiter?.companyName}</p>
                    <Link to={`/student/applications/${app.id}`} className="text-xs text-indigo-600 font-medium mt-2 inline-block">
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming interviews" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
