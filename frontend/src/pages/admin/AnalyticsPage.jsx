import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  CheckCircle2,
  FileCheck,
  Building,
  GraduationCap,
  Percent,
  Clock,
  Target,
  XCircle,
  PieChart,
  Activity,
} from 'lucide-react';

const AnalyticsPage = () => {
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const extractList = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.content)) return res.content;
    if (Array.isArray(res.data?.content)) return res.data.content;
    return [];
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [stRes, recRes, jobRes, appRes, skillRes] = await Promise.all([
        adminService.getAllStudents().catch(() => null),
        adminService.getAllRecruiters().catch(() => null),
        adminService.getAllJobs().catch(() => null),
        adminService.getAllApplications().catch(() => null),
        adminService.getAllSkills().catch(() => null),
      ]);

      setStudents(extractList(stRes));
      setRecruiters(extractList(recRes));
      setJobs(extractList(jobRes));
      setApplications(extractList(appRes));
      setSkills(extractList(skillRes));
    } catch (err) {
      setError('Failed to fetch real-time database analytics metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  // Safe Guarded Array Access
  const studentList = Array.isArray(students) ? students : [];
  const recruiterList = Array.isArray(recruiters) ? recruiters : [];
  const jobList = Array.isArray(jobs) ? jobs : [];
  const appList = Array.isArray(applications) ? applications : [];
  const masterSkillList = Array.isArray(skills) ? skills : [];

  // Real Metric Computations
  const totalStudentsCount = studentList.length;
  const totalRecruitersCount = recruiterList.length;
  const totalJobsCount = jobList.length;
  const totalAppsCount = appList.length;

  // 1. Applications by Status
  const selectedApps = appList.filter((a) => a && a.status === 'SELECTED');
  const shortlistedApps = appList.filter((a) =>
    a && ['SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'].includes(a.status)
  );
  const appliedApps = appList.filter((a) => a && a.status === 'APPLIED');
  const rejectedApps = appList.filter((a) => a && (a.status === 'REJECTED' || a.status === 'WITHDRAWN'));

  // 2. Placement Percentage
  const placementPercentage = totalStudentsCount > 0
    ? ((selectedApps.length / totalStudentsCount) * 100).toFixed(1)
    : 0;

  // 3. Jobs by Category / Type
  const activeJobsCount = jobList.filter((j) => j && (j.active ?? j.isActive)).length;
  const inactiveJobsCount = totalJobsCount - activeJobsCount;
  const fullTimeJobs = jobList.filter((j) => j && j.jobType === 'FULL_TIME').length;
  const internshipJobs = jobList.filter((j) => j && j.jobType === 'INTERNSHIP').length;
  const internPlusFteJobs = jobList.filter((j) => j && j.jobType === 'INTERN_PLUS_FTE').length;

  // 4. Recruiter Hiring Statistics
  const approvedRecruitersCount = recruiterList.filter((r) => r && (r.approved ?? r.isApproved)).length;
  const pendingRecruitersCount = totalRecruitersCount - approvedRecruitersCount;
  const avgAppsPerJob = totalJobsCount > 0 ? (totalAppsCount / totalJobsCount).toFixed(1) : 0;

  // 5. Student Application Statistics
  const avgAppsPerStudent = totalStudentsCount > 0 ? (totalAppsCount / totalStudentsCount).toFixed(1) : 0;
  const uniqueApplicantsCount = new Set(appList.map((a) => a.student?.id || a.studentId).filter(Boolean)).size;

  // 6. Most Demanded Skills (derived from real job.requiredSkills & master skills database)
  const skillCountMap = {};
  jobList.forEach((j) => {
    if (j && Array.isArray(j.requiredSkills)) {
      j.requiredSkills.forEach((s) => {
        const skillName = s.skill?.name || s.name || s.skillName;
        if (skillName) {
          skillCountMap[skillName] = (skillCountMap[skillName] || 0) + 1;
        }
      });
    }
  });

  // No fallback: only show real skill demand data derived from job.requiredSkills.
  // If jobs do not include requiredSkills in the list response, the chart renders an honest empty state.

  const sortedDemandedSkills = Object.entries(skillCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skillName, count]) => ({
      name: skillName,
      count,
      percentage: totalJobsCount > 0 ? Math.round((count / totalJobsCount) * 100) : 0,
    }));

  // Helper Percentages
  const getAppPercentage = (count) => (totalAppsCount > 0 ? Math.round((count / totalAppsCount) * 100) : 0);
  const getJobPercentage = (count) => (totalJobsCount > 0 ? Math.round((count / totalJobsCount) * 100) : 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          Enterprise Placement Analytics & Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Campus Placement Analytics Dashboard</h1>
        <p className="text-sm text-slate-300">Real-time metrics, candidate outcomes, hiring demand, and application funnel analysis.</p>
      </div>

      {/* Top Stat Cards (Key Performance Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Placement Ratio"
          value={`${placementPercentage}%`}
          description={`${selectedApps.length} Placed / ${totalStudentsCount} Students`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Applications"
          value={totalAppsCount}
          description="Candidate Applications Logged"
          icon={FileCheck}
          color="indigo"
        />
        <StatCard
          title="Active Placement Jobs"
          value={activeJobsCount}
          description={`Out of ${totalJobsCount} Total Postings`}
          icon={Briefcase}
          color="amber"
        />
        <StatCard
          title="Verified Recruiters"
          value={approvedRecruitersCount}
          description={`${pendingRecruitersCount} Approvals Pending`}
          icon={Building}
          color="sky"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category 1: Applications by Status */}
        <Card title="📊 Applications Distribution by Status">
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Applied / Screening Phase</span>
                <span className="text-sky-600 font-mono">{appliedApps.length} ({getAppPercentage(appliedApps.length)}%)</span>
              </div>
              <ProgressBar value={getAppPercentage(appliedApps.length)} max={100} showPercentage={false} variant="sky" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Shortlisted / Interviews</span>
                <span className="text-indigo-600 font-mono">{shortlistedApps.length} ({getAppPercentage(shortlistedApps.length)}%)</span>
              </div>
              <ProgressBar value={getAppPercentage(shortlistedApps.length)} max={100} showPercentage={false} variant="primary" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Selected Offers</span>
                <span className="text-emerald-600 font-mono">{selectedApps.length} ({getAppPercentage(selectedApps.length)}%)</span>
              </div>
              <ProgressBar value={getAppPercentage(selectedApps.length)} max={100} showPercentage={false} variant="success" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Rejected / Closed</span>
                <span className="text-rose-600 font-mono">{rejectedApps.length} ({getAppPercentage(rejectedApps.length)}%)</span>
              </div>
              <ProgressBar value={getAppPercentage(rejectedApps.length)} max={100} showPercentage={false} variant="danger" size="sm" />
            </div>
          </div>
        </Card>

        {/* Category 2: Jobs by Category / Type */}
        <Card title="💼 Job Openings Distribution by Type">
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Full-Time Openings (FTE)</span>
                <span className="text-indigo-600 font-mono">{fullTimeJobs} ({getJobPercentage(fullTimeJobs)}%)</span>
              </div>
              <ProgressBar value={getJobPercentage(fullTimeJobs)} max={100} showPercentage={false} variant="primary" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Internship + FTE Roles</span>
                <span className="text-purple-600 font-mono">{internPlusFteJobs} ({getJobPercentage(internPlusFteJobs)}%)</span>
              </div>
              <ProgressBar value={getJobPercentage(internPlusFteJobs)} max={100} showPercentage={false} variant="warning" size="sm" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Internship Roles</span>
                <span className="text-sky-600 font-mono">{internshipJobs} ({getJobPercentage(internshipJobs)}%)</span>
              </div>
              <ProgressBar value={getJobPercentage(internshipJobs)} max={100} showPercentage={false} variant="sky" size="sm" />
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-semibold block">Active Openings</span>
                <span className="text-lg font-black text-emerald-900">{activeJobsCount} Postings</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block">Inactive / Closed</span>
                <span className="text-lg font-black text-slate-800">{inactiveJobsCount} Postings</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Category 3: Most Demanded Skills */}
        <Card title="🔥 Most Demanded Technical Skills">
          {sortedDemandedSkills.length > 0 ? (
            <div className="space-y-4 pt-2">
              {sortedDemandedSkills.map((sk) => (
                <div key={sk.name}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-900">{sk.name}</span>
                    <span className="text-indigo-600 font-mono">{sk.count} Jobs ({sk.percentage}%)</span>
                  </div>
                  <ProgressBar value={sk.percentage} max={100} showPercentage={false} variant="primary" size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400">No skill requirements specified in job listings.</div>
          )}
        </Card>

        {/* Category 4: Student & Candidate Statistics */}
        <Card title="🎓 Student Candidate Application Statistics">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold block">Total Registered Candidates</span>
              <span className="text-2xl font-black text-slate-900">{totalStudentsCount}</span>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <span className="text-xs text-indigo-700 font-semibold block">Active Job Applicants</span>
              <span className="text-2xl font-black text-indigo-900">{uniqueApplicantsCount}</span>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className="text-xs text-emerald-700 font-semibold block">Placed Students</span>
              <span className="text-2xl font-black text-emerald-900">{selectedApps.length}</span>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
              <span className="text-xs text-purple-700 font-semibold block">Avg Applications / Student</span>
              <span className="text-2xl font-black text-purple-900">{avgAppsPerStudent}</span>
            </div>
          </div>
        </Card>

        {/* Category 5: Recruiter & Corporate Statistics */}
        <Card title="🏢 Corporate Recruiter Hiring Statistics">
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-700 font-bold block">Approved Recruiters</span>
                <span className="text-2xl font-black text-emerald-900">{approvedRecruitersCount}</span>
              </div>
              <Badge variant="success">APPROVED</Badge>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-700 font-bold block">Pending Approvals</span>
                <span className="text-2xl font-black text-amber-900">{pendingRecruitersCount}</span>
              </div>
              <Badge variant="warning">PENDING</Badge>
            </div>
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl col-span-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-sky-700 font-bold block">Average Applications per Job Opening</span>
                <span className="text-xs text-sky-600 font-medium">Total Submissions / Total Job Postings</span>
              </div>
              <span className="text-2xl font-black text-sky-900">{avgAppsPerJob} Apps/Job</span>
            </div>
          </div>
        </Card>

        {/* Category 6: Skill Taxonomy Catalog Metric */}
        <Card title="⚡ Technical Skill Taxonomy Summary">
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div>
                <span className="text-xs text-indigo-700 font-bold block uppercase">Master Skill Tags</span>
                <span className="text-2xl font-black text-indigo-900">{masterSkillList.length} Registered Skills</span>
              </div>
              <Award className="w-8 h-8 text-indigo-500 opacity-80" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-bold block uppercase">Calculated Placement Rate</span>
                <span className="text-2xl font-black text-slate-900">{placementPercentage}%</span>
              </div>
              <TrendingUp className="w-8 h-8 text-slate-500 opacity-80" />
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AnalyticsPage;
