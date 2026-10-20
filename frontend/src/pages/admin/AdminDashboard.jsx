import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { GraduationCap, Building, Briefcase, FileCheck, Target, CheckCircle2, Award, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const [stRes, recRes, jobRes, appRes, skillRes] = await Promise.all([
        adminService.getAllStudents().catch(() => ({ data: [] })),
        adminService.getAllRecruiters().catch(() => ({ data: [] })),
        adminService.getAllJobs().catch(() => ({ data: { content: [] } })),
        adminService.getAllApplications().catch(() => ({ data: { content: [] } })),
        adminService.getAllSkills().catch(() => ({ data: [] })),
      ]);

      const studentList = stRes.data || [];
      const recruiterList = recRes.data || [];
      const jobList = jobRes.data?.content || jobRes.data || [];
      const appList = appRes.data?.content || appRes.data || [];
      const skillList = skillRes.data || [];

      setStudents(studentList);
      setRecruiters(recruiterList);
      setJobs(jobList);
      setApplications(appList);
      setSkills(skillList);
    } catch (err) {
      setError('Failed to fetch administrative metrics from database.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAdminData} />;
  }

  const activeJobs = jobs.filter((j) => j.active ?? j.isActive);
  const pendingApprovals = recruiters.filter((r) => !(r.approved ?? r.isApproved)).length;
  const shortlistedApps = applications.filter((a) =>
    ['SHORTLISTED', 'ASSESSMENT', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'].includes(a.status)
  );
  const selectedApps = applications.filter((a) => a.status === 'SELECTED');

  const placementPercentage = students.length > 0
    ? ((selectedApps.length / students.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          Administrator Control Panel
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">System Database & Placement Intelligence Overview</h1>
        <p className="text-sm text-slate-300">Live operational metrics, audit logs, student profiles, and placement outcomes.</p>
      </div>

      {/* Real Metric StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard
          title="Total Students"
          value={students.length}
          description="Registered Candidates"
          icon={GraduationCap}
          color="indigo"
          onClick={() => navigate('/admin/students')}
        />
        <StatCard
          title="Recruiters"
          value={recruiters.length}
          description="Corporate Partners"
          icon={Building}
          color="sky"
          onClick={() => navigate('/admin/recruiters')}
        />
        <StatCard
          title="Active Jobs"
          value={activeJobs.length}
          description="Live Openings"
          icon={Briefcase}
          color="purple"
          onClick={() => navigate('/admin/jobs')}
        />
        <StatCard
          title="Applications"
          value={applications.length}
          description="Total Submissions"
          icon={FileCheck}
          color="slate"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedApps.length}
          description="Passed Screening"
          icon={Target}
          color="emerald"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          title="Selected"
          value={selectedApps.length}
          description="Placed Offers"
          icon={CheckCircle2}
          color="amber"
          onClick={() => navigate('/admin/applications')}
        />
        <StatCard
          title="Placement %"
          value={`${placementPercentage}%`}
          description="Real Placed Ratio"
          icon={Award}
          color="rose"
          onClick={() => navigate('/admin/analytics')}
          className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-1"
        />
      </div>

      {/* Overview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="🎓 Recent Student Candidate Profiles">
          {students.length > 0 ? (
            <Table
              headers={['Name', 'Roll Number', 'Branch', 'CGPA', 'Grad Year']}
              data={students.slice(0, 5)}
              renderRow={(st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900">{st.fullName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{st.rollNumber}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{st.branch}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-600 text-xs">{st.cgpa}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{st.graduationYear}</td>
                </tr>
              )}
            />
          ) : (
            <p className="text-xs text-slate-400 p-4">No registered student profiles in database.</p>
          )}
          <div className="pt-3 text-right">
            <Link to="/admin/students" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage All Students ({students.length}) &rarr;
            </Link>
          </div>
        </Card>

        <Card title="🏢 Recruiter Companies & Approvals">
          {recruiters.length > 0 ? (
            <Table
              headers={['Company', 'Location', 'Website', 'Approval Status']}
              data={recruiters.slice(0, 5)}
              renderRow={(r) => {
                const isApproved = r.approved ?? r.isApproved;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{r.companyName}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.location}</td>
                    <td className="px-4 py-3 text-xs text-indigo-600 font-mono">{r.website || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isApproved ? 'success' : 'warning'}>
                        {isApproved ? 'APPROVED' : 'PENDING'}
                      </Badge>
                    </td>
                  </tr>
                );
              }}
            />
          ) : (
            <p className="text-xs text-slate-400 p-4">No corporate recruiter accounts found.</p>
          )}
          <div className="pt-3 text-right flex justify-between items-center">
            {pendingApprovals > 0 && (
              <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {pendingApprovals} Pending Approvals
              </span>
            )}
            <Link to="/admin/recruiters" className="text-xs font-bold text-indigo-600 hover:underline ml-auto">
              Manage Recruiter Approvals &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
