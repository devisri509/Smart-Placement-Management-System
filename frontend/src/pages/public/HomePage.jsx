import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, TrendingUp, ShieldCheck, ArrowRight, BrainCircuit } from 'lucide-react';

const HomePage = () => {
  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', margin: '3rem 0 5rem' }}>
        <div className="badge badge-match-high" style={{ marginBottom: '1.25rem', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
          <BrainCircuit size={16} /> Intelligent Placement Engine v1.0
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          Smart Placement & Internship System <br />
          <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Powered by Skill-Gap Analytics
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#9ca3af', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          Eliminate placement friction with automated academic eligibility verification, real-time skill matching algorithms, complement skill gap analysis, and transparent multi-stage application tracking.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Sign In to Portal
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Eligibility Engine</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Instant dynamic evaluation against CGPA thresholds, allowed engineering branches, graduation year, and active backlogs.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Sparkles size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Skill Match % Engine</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Calculates exact match percentages comparing student candidate skill proficiencies directly against recruiter requirements.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <TrendingUp size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Skill Gap Analyzer</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Provides clear action-oriented lists of missing target skills required to qualify for top-tier company job openings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
