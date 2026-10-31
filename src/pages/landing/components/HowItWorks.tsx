import React from 'react';
import { Radio, Search, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Broadcast Requirement',
      desc: 'Authorized clinical staff select blood group, required units, and urgency level (Critical, Urgent, Normal). A structured digital beacon broadcasts across the hospital network.',
      icon: Radio,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Instant Network Discovery',
      desc: 'Participating blood centres within the regional grid receive high-priority alerts with matching stock availability, estimated travel distance, and transit times.',
      icon: Search,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Offer Submission & Lock',
      desc: 'Available blood banks submit unit commitments. The requesting facility reviews and accepts allocation, instantly locking the units to prevent double-reservation.',
      icon: CheckCircle2,
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Verified Transit & Audit',
      desc: 'Dispatched blood units are tracked under strict cold-chain parameters. The entire transaction is permanently recorded in immutable audit logs for regulatory compliance.',
      icon: ShieldCheck,
      badge: 'Step 4',
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0d9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Emergency Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            How PulseRelay Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            From critical trauma alarm to verified unit reservation in four seamless stages.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-200">{item.step}</span>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5 text-[#0d9488]" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0d9488]">
                  <span>{item.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
