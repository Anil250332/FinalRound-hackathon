import React from 'react';
import {
  Lock,
  Zap,
  Split,
  Thermometer,
  ShieldCheck,
  FileCheck2,
  Activity,
  ArrowRight,
} from 'lucide-react';

export const ClinicalFeatures: React.FC = () => {
  const features = [
    {
      title: 'Atomic Reservation Locks',
      desc: 'When an offer is accepted, blood units are instantly locked in MongoDB Atlas transactions. No two emergency surgeries can ever claim the same physical unit.',
      icon: Lock,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Multi-Source Partial Allocation',
      desc: 'Can’t find 4 units in one facility? The grid aggregates available stock across multiple neighboring hospitals to fulfill urgent surgical demands simultaneously.',
      icon: Split,
      color: 'bg-teal-50 text-[#0d9488]',
    },
    {
      title: 'Real-Time WebSocket Sync',
      desc: 'Built on bidirectional Socket.IO channels. Emergency requests, incoming offers, and cancellations trigger instantaneous browser alerts without refreshing.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Direct Peer Hospital Coordination',
      desc: 'When an emergency request is accepted, direct hospital contact numbers, attending doctor details, and facility addresses are unlocked for instant peer-to-peer clinical handover.',
      icon: Activity,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'CDSCO Compliance & Verification',
      desc: 'Unverified facilities cannot participate in the live transfer network until official state blood licenses and blood centre credentials are vetted.',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Cryptographic Audit Trail',
      desc: 'Immutable logs of every requirement raised, offer submitted, officer identity, timestamp, and IP address for full clinical governance and post-op review.',
      icon: FileCheck2,
      color: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0d9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Engineered for High-Stakes Clinical Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Designed to withstand hospital network stress, power latency, and high-volume surgical demands.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-5 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-[11px] font-bold text-[#0d9488] space-x-1">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
