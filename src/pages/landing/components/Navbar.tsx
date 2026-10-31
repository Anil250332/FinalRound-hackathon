import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';

interface RollingNavLinkProps {
  href: string;
  label: string;
}

const RollingNavLink: React.FC<RollingNavLinkProps> = ({ href, label }) => {
  const letters = label.split('');

  return (
    <a
      href={href}
      className="group relative inline-flex items-center overflow-hidden px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-teal-900 rounded-xl hover:bg-teal-500/10 transition-colors duration-200 cursor-pointer select-none"
    >
      <span className="inline-flex overflow-hidden">
        {letters.map((char, i) => (
          <span
            key={i}
            className="relative inline-flex flex-col overflow-hidden leading-tight py-0.5"
          >
            {/* Primary Char */}
            <span
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[125%]"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>

            {/* Duplicate Char (rolls in from bottom) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 inline-flex items-center text-[#0d6659] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-[125%] group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
};

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f0f7f6]/90 backdrop-blur-md border-b border-emerald-950/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0d6659] to-[#14b8a6] flex items-center justify-center text-white shadow-md shadow-teal-900/15 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Pulse<span className="">Relay</span>
                </span>
                
              </div>
            
            </div>
          </Link>

          {/* Desktop Nav Links with Silky Smooth Rolling Wave Effect */}
          <nav className="hidden md:flex items-center space-x-1">
            <RollingNavLink href="#how-it-works" label="How It Works" />
            <RollingNavLink href="#simulator" label="Live Simulator" />
            <RollingNavLink href="#features" label="Clinical Features" />
            <RollingNavLink href="#roles" label="Hospital Roles" />
            <RollingNavLink href="#impact" label="Impact" />
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-teal-800/20 flex items-center space-x-1.5 transition-all cursor-pointer group"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 space-y-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xl">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            How It Works
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Live Simulator
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Clinical Features
          </a>
          <a
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Hospital Roles
          </a>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-3 rounded-2xl bg-[#0d9488] text-white font-bold text-xs text-center"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
