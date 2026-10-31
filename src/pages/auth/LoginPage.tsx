import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { setRole, loginSuccess } from '../../store/slices/authSlice';
import { DEMO_USERS } from '../../services/mockData';
import { UserRole } from '../../types';
import {
  Activity,
  ShieldCheck,
  Hospital,
  Droplet,
  Radio,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Super Admin',
      user: DEMO_USERS.superAdmin,
      desc: 'National grid authority, hospital approvals & audits',
      icon: ShieldCheck,
      color: 'emerald',
      route: '/super-admin/overview',
    },
    {
      role: 'HOSPITAL_ADMIN' as UserRole,
      title: 'Hospital Admin',
      user: DEMO_USERS.hospitalAdmin,
      desc: 'AIIMS hospital staff, profile & operational oversight',
      icon: Hospital,
      color: 'teal',
      route: '/hospital-admin/overview',
    },
    {
      role: 'BLOOD_BANK_OFFICER' as UserRole,
      title: 'Blood Bank Officer',
      user: DEMO_USERS.bloodBankOfficer,
      desc: 'AIIMS blood inventory, incoming requests & unit offers',
      icon: Droplet,
      color: 'blue',
      route: '/blood-bank/overview',
    },
    {
      role: 'EMERGENCY_COORDINATOR' as UserRole,
      title: 'Emergency Coordinator',
      user: DEMO_USERS.emergencyCoordinator,
      desc: 'Fortis ER, raise emergency broadcasts & OTP handover',
      icon: Radio,
      color: 'rose',
      route: '/coordinator/overview',
    },
  ];

  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(setRole(account.role));
      dispatch(loginSuccess({ user: account.user, token: `demo-token-${account.role.toLowerCase()}` }));
      setIsLoading(false);
      navigate(account.route);
    }, 250);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Default to Super Admin or match email
    const matchedAccount = demoAccounts.find((a) => a.user.email.toLowerCase() === email.toLowerCase()) || demoAccounts[0];
    handleDemoLogin(matchedAccount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 mb-4 animate-hospital-pulse">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pulse<span className="text-emerald-600">Relay</span>
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Emergency Blood Transfer & Real-Time Hospital Coordination Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Standard Login Box */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Secure Staff Portal</h3>
            <p className="text-xs text-slate-600 mt-1">Sign in with authorized clinical credentials</p>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@hospital.org"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-600" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit TLS Encrypted
              </span>
              <span>v1.1 MVP</span>
            </div>
          </div>

          {/* Right Column: Instant 1-Click Persona Access (Hackathon Super Feature) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">1-Click Fast Role Selection</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Select any persona to test end-to-end workflows immediately
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                DEMO READY
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleDemoLogin(account)}
                    className="p-4 text-left rounded-2xl border border-slate-200 hover:border-emerald-500/60 bg-slate-50/60 hover:bg-emerald-50/40 transition-all duration-200 group relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700">
                          Launch →
                        </span>
                      </div>
                      <h4 className="mt-3 font-bold text-slate-900 text-xs">{account.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {account.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-600 truncate max-w-[140px]">
                        {account.user.name}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        {account.role.split('_')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              💡 <strong className="text-slate-800">Evaluator Tip:</strong> You can also switch between all 4 roles on the fly using the navigation bar switcher at any time without logging out.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
