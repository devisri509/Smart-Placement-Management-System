import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import { Building, MapPin, Calendar, Award, CheckCircle2, XCircle } from 'lucide-react';

const JobCard = ({ job, matchPercentage, eligible, overallScore, rank }) => {
  if (!job) return null;

  return (
    <Card className="hover:shadow-lg hover:border-indigo-300 transition-all border-slate-200/90 relative overflow-hidden">
      {rank && (
        <div className="absolute top-0 left-0 bg-slate-900 text-indigo-400 font-black text-xs px-3 py-1 rounded-br-xl border-r border-b border-slate-800">
          Rank #{rank}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <Badge variant="primary">{job.jobType?.replace('_', ' ')}</Badge>
            <span className="text-xs text-slate-400 font-mono">
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>
          
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-500" />
              {job.recruiter?.companyName || 'Corporate Enterprise'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {job.location}
            </span>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap gap-2 pt-1">
            {overallScore !== undefined && (
              <Badge variant="info">
                Recommendation Score: {Math.round(overallScore)}%
              </Badge>
            )}
            {matchPercentage !== undefined && (
              <Badge variant="neutral">
                Skill Match: {matchPercentage}%
              </Badge>
            )}
            {eligible !== undefined && (
              <Badge variant={eligible ? 'success' : 'danger'}>
                {eligible ? 'Eligible' : 'Ineligible'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Package</span>
            <span className="text-base font-extrabold text-emerald-600">
              {job.packageOrStipend ? `₹${(job.packageOrStipend / 100000).toFixed(2)} LPA` : 'Competitive'}
            </span>
          </div>

          <Link to={`/student/jobs/${job.id}`} className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto">
              View Job & Eligibility &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
