import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { studentService } from '../../services/studentService';
import { intelligenceService } from '../../services/intelligenceService';
import { applicationService } from '../../services/applicationService';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SkillChip from '../../components/ui/SkillChip';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import Notification from '../../components/common/Notification';

import { Building, MapPin, Calendar, Award, CheckCircle2, XCircle, FileCheck, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [skillMatch, setSkillMatch] = useState(null);
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [jobRes, profRes] = await Promise.all([
        jobService.getJobById(id),
        studentService.getProfile(),
      ]);

      if (jobRes.success && jobRes.data) {
        setJob(jobRes.data);
      }

      if (profRes.success && profRes.data) {
        const studentId = profRes.data.id;
        setProfile(profRes.data);

        const [eligRes, matchRes, gapRes] = await Promise.all([
          intelligenceService.getEligibility(studentId, id).catch(() => null),
          intelligenceService.getSkillMatch(studentId, id).catch(() => null),
          intelligenceService.getSkillGap(studentId, id).catch(() => null),
        ]);

        if (eligRes?.data) setEligibility(eligRes.data);
        if (matchRes?.data) setSkillMatch(matchRes.data);
        if (gapRes?.data) setSkillGap(gapRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job posting details.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setError('');
    setSuccess('');
    setApplying(true);

    try {
      const res = await applicationService.applyForJob(id);
      if (res.success) {
        setSuccess('Application submitted successfully!');
        setTimeout(() => {
          navigate('/student/applications');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error || !job) {
    return <ErrorState message={error || 'Job posting not found.'} onRetry={fetchJobDetails} />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link to="/student/jobs" className="text-indigo-600 font-bold hover:underline text-xs inline-flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Active Job Openings
      </Link>

      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      {/* Main Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Badge variant="primary">{job.jobType?.replace('_', ' ')}</Badge>
          <h1 className="text-3xl font-black">{job.title}</h1>
          <p className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <span>{job.recruiter?.companyName || 'Corporate Enterprise'}</span>
            <span>•</span>
            <span>📍 {job.location}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4 w-full md:w-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Package / Stipend</span>
            <span className="text-2xl font-black text-emerald-400">
              {job.packageOrStipend ? `₹${(job.packageOrStipend / 100000).toFixed(2)} LPA` : 'Competitive'}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleApply}
            loading={applying}
            disabled={eligibility && !eligibility.eligible}
            className="shadow-lg shadow-indigo-600/30"
          >
            {eligibility && !eligibility.eligible ? 'Ineligible to Apply' : 'Submit Application'}
          </Button>
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Eligibility Engine Result */}
        <Card title="⚡ Eligibility Evaluation" subtitle="Spring Boot Eligibility Engine">
          {eligibility ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl text-center font-extrabold text-xs border ${
                eligibility.eligible ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {eligibility.eligible ? '✅ ELIGIBLE TO APPLY' : '❌ NOT ELIGIBLE'}
              </div>

              {eligibility.passedCriteria && eligibility.passedCriteria.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-1">Passed Criteria:</p>
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {eligibility.passedCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {eligibility.failedCriteria && eligibility.failedCriteria.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-rose-800 mb-1">Failed Criteria:</p>
                  <ul className="text-xs text-rose-600 space-y-1 pl-4 list-disc">
                    {eligibility.failedCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Loading eligibility evaluation...</p>
          )}
        </Card>

        {/* Skill Match Score Result */}
        <Card title="🎯 Skill Match Breakdown" subtitle="Prerequisites alignment">
          {skillMatch ? (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-indigo-600 bg-indigo-50 text-indigo-900 font-black text-2xl shadow-inner">
                {Math.round(skillMatch.matchPercentage)}%
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Matched <span className="font-bold text-slate-900">{skillMatch.matchedSkillsCount}</span> out of <span className="font-bold text-slate-900">{skillMatch.totalRequiredSkills}</span> required skills
              </p>

              {skillMatch.missingSkills && skillMatch.missingSkills.length > 0 && (
                <div className="text-left bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                  <p className="text-xs font-bold text-amber-900 mb-1">Missing Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {skillMatch.missingSkills.map((ms, i) => (
                      <SkillChip key={i} name={ms.skillName} isMatched={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Calculating skill match percentage...</p>
          )}
        </Card>

        {/* Skill Gap Action Plan */}
        <Card title="📚 Skill Gap Action Steps" subtitle="Recommended preparation plan">
          {skillGap && skillGap.recommendedActionSteps && skillGap.recommendedActionSteps.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">Action Plan:</p>
              <ul className="text-xs text-slate-600 space-y-2 pl-4 list-disc leading-relaxed">
                {skillGap.recommendedActionSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No skill gaps identified! Your profile meets all mandatory prerequisites.
            </p>
          )}
        </Card>
      </div>

      {/* Description & Requirements */}
      <Card title="📋 Job Description & Eligibility Requirements">
        <div className="space-y-6 text-slate-700 text-sm">
          <div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Role Overview & Responsibilities</h4>
            <p className="leading-relaxed whitespace-pre-line text-slate-600">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Minimum CGPA</span>
              <span className="text-base font-extrabold text-indigo-600">{job.minCgpa}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Allowed Branches</span>
              <span className="text-base font-extrabold text-slate-900">{job.allowedBranches}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Max Backlogs</span>
              <span className="text-base font-extrabold text-slate-900">{job.maxBacklogsAllowed}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Openings</span>
              <span className="text-base font-extrabold text-slate-900">{job.openings}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;
