import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { intelligenceService } from '../../services/intelligenceService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const RecommendedJobs = () => {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [weights, setWeights] = useState({
    skillMatchWeight: 0.60,
    cgpaWeight: 0.20,
    backlogWeight: 0.10,
    graduationYearWeight: 0.10,
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const profRes = await studentService.getProfile();
      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
        const recRes = await intelligenceService.getRecommendations(profRes.data.id, weights);
        if (recRes.success && recRes.data && recRes.data.content) {
          setRecommendations(recRes.data.content);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job recommendations.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Calculating weighted job recommendation rankings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold">🎯 Intelligent Job Recommendations</h1>
        <p className="text-sm text-slate-300 mt-1">
          Ranked using a multi-variable weighted score combining Skill Match (60%), CGPA (20%), Backlogs (10%), and Graduation Year (10%).
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Recommended Jobs Card List */}
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((item, idx) => (
            <Card key={idx} className="hover:shadow-lg hover:border-indigo-300 transition-all border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-indigo-400 font-extrabold text-xl flex items-center justify-center border border-slate-800 shadow-md">
                    #{idx + 1}
                  </div>
                  <div className="space-y-1">
                    <Badge variant="primary" size="xs">{item.job.jobType?.replace('_', ' ')}</Badge>
                    <h3 className="text-lg font-bold text-slate-900">{item.job.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{item.job.recruiter?.companyName} • 📍 {item.job.location}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="info">
                        Overall Score: {Math.round(item.overallScore)}%
                      </Badge>
                      <Badge variant="neutral">
                        Skill Match: {item.skillMatchPercentage}%
                      </Badge>
                      <Badge variant={item.eligible ? 'success' : 'danger'}>
                        {item.eligible ? 'Eligible' : 'Ineligible'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Link to={`/student/jobs/${item.job.id}`}>
                  <Button variant="primary" size="sm">
                    View Details & Apply &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200 shadow-sm">
            No job recommendations available at this time. Add technical skills to your profile to improve matching!
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;
