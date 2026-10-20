import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  ShieldCheck,
  Target,
  TrendingUp,
  Sparkles,
  FileCheck,
  Building,
} from 'lucide-react';

const LandingPage = () => {
  const featureCards = [
    { icon: ShieldCheck, title: 'Intelligent Eligibility' },
    { icon: Target, title: 'Skill Matching' },
    { icon: TrendingUp, title: 'Skill Gap Analysis' },
    { icon: Sparkles, title: 'Job Recommendations' },
    { icon: FileCheck, title: 'Application Tracking' },
    { icon: Building, title: 'Recruitment Management' },
  ];

  return (
    <div className="space-y-14">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-indigo-600">
            Smart Placement Platform
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-snug">
            Smart Internship & Placement Management System
          </h1>
          <p className="text-sm text-slate-600 max-w-lg">
            Connect students and recruiters with eligibility checks, skill matching, and application tracking.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/register/student">
              <Button variant="primary" size="lg">
                Student Portal
              </Button>
            </Link>
            <Link to="/register/recruiter">
              <Button variant="outline" size="lg">
                Recruiter Portal
              </Button>
            </Link>
          </div>
        </div>

        <div className="preview-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-900">Skill match preview</span>
            <span className="text-xs font-semibold text-indigo-600">91%</span>
          </div>
          <p className="text-sm font-medium text-slate-900 mt-4">Java Backend Engineer</p>
          <p className="text-xs text-slate-500 mt-1">Matched skills: Java, SQL, Spring Boot</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-indigo-600" style={{ width: '91%' }} />
          </div>
          <p className="text-xs text-slate-500 mt-3">Eligible · Shortlisted</p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 text-center">Why Smart Placement?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="!p-5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
