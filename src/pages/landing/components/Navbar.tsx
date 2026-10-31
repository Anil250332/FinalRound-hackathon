import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface RollingNavLinkProps {
  href: string;
  label: string;
  badge?: React.ReactNode;
}

const RollingNavLink: React.FC<RollingNavLinkProps> = ({ href, label, badge }) => {
  const letters = label.split('');

  return (
    <motion.a
      href={href}
      initial="initial"
      whileHover="hovered"
      className="relative inline-flex items-center overflow-hidden py-1 text-xs font-semibold text-slate-600 cursor-pointer select-none"
    >
      <span className="relative inline-flex overflow-hidden">
        {/* Primary Row (scrolls up on hover) */}
        <span className="inline-flex">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: 0 },
                hovered: { y: '-110%' },
              }}
              transition={{
                duration: 0.28,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.018,
              }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>

        {/* Duplicate Row (scrolls up from bottom into view) */}
        <span className="absolute inset-0 inline-flex">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              variants={{
                initial: { y: '110%' },
                hovered: { y: 0 },
              }}
              transition={{
                duration: 0.28,
                ease: [0.33, 1, 0.68, 1],
                delay: i * 0.018,
              }}
              className="inline-block text-[#0d6659] font-bold"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      </span>

      {badge && <span className="ml-1.5 flex items-center">{badge}</span>}
    </motion.a>
  );
};

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#f0f7f6]/85 backdrop-blur-md border-b border-emerald-950/5 transition-all">
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
                  Pulse<span className="text-[#0d9488]">Relay</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Grid
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Emergency Blood Coordination Network
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links with Staggered Wave Scroll-Up Effect */}
          <nav className="hidden md:flex items-center space-x-8">
            <RollingNavLink href="#how-it-works" label="How It Works" />
            <RollingNavLink
              href="#simulator"
              label="Live Simulator"
              badge={
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              }
            />
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

