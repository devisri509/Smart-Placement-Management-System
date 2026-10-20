import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const linkClass = (path) =>
    `text-sm font-medium whitespace-nowrap px-1 py-2 ${
      location.pathname === path ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="page-container h-16 flex items-center justify-between gap-6">
        <BrandMark />

        <div className="hidden md:flex items-center gap-8">
          <Link to="/login" className={linkClass('/login')}>
            Login
          </Link>
          <Link to="/register/student" className={linkClass('/register/student')}>
            Student Register
          </Link>
          <Link to="/register/recruiter" className={linkClass('/register/recruiter')}>
            Recruiter Register
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="page-container py-3 flex flex-col gap-1">
            <Link to="/login" className={linkClass('/login')} onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link
              to="/register/student"
              className={linkClass('/register/student')}
              onClick={() => setOpen(false)}
            >
              Student Register
            </Link>
            <Link
              to="/register/recruiter"
              className={linkClass('/register/recruiter')}
              onClick={() => setOpen(false)}
            >
              Recruiter Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
