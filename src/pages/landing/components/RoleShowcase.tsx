import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Hospital, Droplet, Check, ArrowRight } from 'lucide-react';

export const RoleShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'BLOOD_BANK_OFFICER'>('BLOOD_BANK_OFFICER');

  const roleDetails = {
    SUPER_ADMIN: {
      roleTitle: 'Super Admin Central Portal',
      subtitle: 'Hospital Directory, Clinical Licenses & Grid Governance',
      desc: 'Register and approve participating hospitals, inspect hospital blood inventories across regions, monitor live emergency broadcasts, and ensure complete network integrity.',
      highlights: [
        'Hospital registration with dedicated login credentials',
        'State blood license verification and compliance checks',
        'Hospital-by-hospital inventory inspector for rare blood groups',
        'Real-time emergency request tracking and inter-hospital connection logs',
      ],
      previewStats: [
        { label: 'Verified Hospitals', value: '25 Facilities' },
        { label: 'Active Alerts', value: '4 Critical' },
        { label: 'Grid Integrity', value: '100% Monitored' },
      ],
      route: '/login',
    },
    HOSPITAL_ADMIN: {
      roleTitle: 'Hospital Operational Dashboard',
      subtitle: 'Emergency Coordination, Doctor Management & Stock Ledger',
      desc: 'Log in with hospital credentials, enroll and manage doctors and blood bank officers, raise emergency blood broadcasts for your patients, and respond to incoming requests from peer hospitals.',
      highlights: [
        'Doctor and clinical officer management with instant login access',
        'Broadcast urgent patient blood requirements to network hospitals',
        'Dedicated Incoming Requests and Raised by Us tracking pages',
        'Instant peer hospital phone & coordinator contact reveal upon acceptance',
      ],
      previewStats: [
        { label: 'Affiliated Staff', value: '14 Accounts' },
        { label: 'Monthly Fulfillment', value: '98.4% Success' },
        { label: 'Peer Assistance', value: 'Active' },
      ],
      route: '/login',
    },
    BLOOD_BANK_OFFICER: {
      roleTitle: 'Doctor / Blood Bank Officer Portal',
      subtitle: 'Blood Inventory Ledger & Emergency Broadcast Response',
      desc: 'Direct clinical workstation for hospital doctors and blood bank officers. Manage blood units in the ledger, receive incoming emergency calls from peer hospitals, and accept requests with a single click.',
      highlights: [
        '8-group blood stock ledger (PRBC, Platelets, FFP, Whole Blood)',
        'Receive live emergency broadcasts from nearby hospitals',
        'One-click request acceptance with direct phone coordination',
        'Broadcast emergency patient requirements on behalf of the hospital',
      ],
      previewStats: [
        { label: 'Available Stock', value: '142 Bags' },
        { label: 'Locked Reserves', value: '18 Units' },
        { label: 'Incoming Requests', value: '3 Urgent' },
      ],
      route: '/login',
    },
  };

  const current = roleDetails[activeTab];

  return (
    <section id="roles" className="py-20 bg-white/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0d9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Tailored Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Built for Healthcare Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Granular, role-based workflows designed to eliminate confusion in high-stakes clinical emergencies.
          </p>

          {/* Interactive Role Tabs (Kurnia Majid Style) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200/60 max-w-full overflow-x-auto">
            {[
              { id: 'BLOOD_BANK_OFFICER', label: 'Blood Bank Officer', icon: Droplet },
              { id: 'HOSPITAL_ADMIN', label: 'Hospital Admin', icon: Hospital },
              { id: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldCheck },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0d9488]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Role Card */}
        <div className="bg-[#f0f7f6] rounded-[2.5rem] p-8 sm:p-12 border border-slate-200/80 shadow-lg shadow-teal-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Description & Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#0d9488] uppercase tracking-wider block mb-1">
                  {current.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {current.roleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-3">
                  {current.desc}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-800" />
                    </div>
                    <span className="text-xs text-slate-700 font-semibold">{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate(current.route)}
                  className="px-6 py-3 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md shadow-teal-800/20 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Launch This Role in Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Live Telemetry Preview Box */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Live Module Metrics
              </span>
              <div className="grid grid-cols-1 gap-3">
                {current.previewStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-slate-600">{stat.label}</span>
                    <span className="text-sm font-black text-slate-900">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-900 font-medium">
                🔒 <strong>Zero Cross-Hospital Data Leak:</strong> Hospital records and private donor contact details are securely isolated by hospital tenancy.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
