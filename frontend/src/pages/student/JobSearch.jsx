import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (jobType) params.jobType = jobType;
      if (location) params.location = location;

      const res = await jobService.getAllJobs(params);
      if (res.success && res.data && res.data.content) {
        setJobs(res.data.content);
      } else if (res.data) {
        setJobs(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch active job openings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold">💼 Active Campus Placement & Internship Openings</h1>
        <p className="text-sm text-slate-300 mt-1">
          Search job postings, inspect required skills, and check automated eligibility screening.
        </p>

        {/* Search & Filter Controls */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
          <input
            type="text"
            placeholder="Search job title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Job Types</option>
            <option value="FULL_TIME">FULL_TIME</option>
            <option value="INTERNSHIP">INTERNSHIP</option>
            <option value="INTERNSHIP_WITH_PPO">INTERNSHIP_WITH_PPO</option>
          </select>

          <input
            type="text"
            placeholder="Filter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Button type="submit" variant="primary" size="md">
            Search Openings
          </Button>
        </form>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading message="Fetching active job postings..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg hover:border-indigo-300 transition-all border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="primary" size="xs">
                        {job.jobType?.replace('_', ' ')}
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{job.title}</h3>
                      <p className="text-xs font-semibold text-indigo-600">{job.recruiter?.companyName || 'Corporate Enterprise'}</p>
                    </div>
                    <div className="text-right font-extrabold text-emerald-600 text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {job.packageOrStipend ? `₹${(job.packageOrStipend / 100000).toFixed(2)} LPA` : 'Competitive'}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-2 gap-2 my-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>📍 Location: <span className="font-semibold text-slate-800">{job.location}</span></div>
                    <div>🎓 Min CGPA: <span className="font-bold text-indigo-600">{job.minCgpa}</span></div>
                    <div>🌿 Branches: <span className="font-semibold text-slate-800">{job.allowedBranches}</span></div>
                    <div>⏳ Openings: <span className="font-semibold text-slate-800">{job.openings}</span></div>
                  </div>

                  {/* Required Skills Badges */}
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requiredSkills.map((ks, i) => (
                        <Badge key={i} variant={ks.mandatory ? 'dark' : 'neutral'} size="xs">
                          {ks.skillName} {ks.mandatory && '*'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                  <span className="text-[11px] text-slate-400 font-mono">Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  <Link to={`/student/jobs/${job.id}`}>
                    <Button variant="primary" size="sm">
                      View Details & Eligibility &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 py-16 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200 shadow-sm">
              No active job openings found matching your search parameters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
