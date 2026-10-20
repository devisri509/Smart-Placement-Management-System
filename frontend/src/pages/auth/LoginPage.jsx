import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Notification from '../../components/common/Notification';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      if (response && response.success && response.data) {
        setAuthUser(response.data);
        const role = response.data.role;
        if (role === 'ROLE_STUDENT' || role === 'STUDENT') {
          navigate('/student/dashboard');
        } else if (role === 'ROLE_RECRUITER' || role === 'RECRUITER') {
          navigate('/recruiter/dashboard');
        } else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(response?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Panel: Branding & Benefits */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              CAMPUS PLACEMENT SYSTEM
            </div>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Welcome Back to <br />
              <span className="text-indigo-400">Smart Placement</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Sign in to access your automated candidate profile, job eligibility evaluations, skill match analytics, and application tracking.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated CGPA & Skill Match Screening</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Verified Corporate Job Openings</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-200">
                <Target className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>7-Stage Recruitment Status Audit Trail</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Smart Placement Platform &copy; 2026
          </div>
        </div>

        {/* Right Panel: Sign In Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Sign In</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Enter your credentials to access your portal.
            </p>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />
          <Notification type="success" message={successMessage} onClose={() => setSuccessMessage('')} />

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={Lock}
              endIcon={showPassword ? EyeOff : Eye}
              onEndIconClick={() => setShowPassword(!showPassword)}
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/30 mt-2">
              Sign In &rarr;
            </Button>
          </form>

          {/* Registration Options Footer */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">Don't have an account?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register/student">
                <Button variant="outline" size="xs" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  Student Register
                </Button>
              </Link>
              <Link to="/register/recruiter">
                <Button variant="outline" size="xs" className="text-slate-700 border-slate-300 hover:bg-slate-50">
                  Recruiter Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
