import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Building2,
  CheckCircle2,
  Droplet,
  Radio,
  Sparkles,
  MapPin,
} from 'lucide-react';
import CrystalizedBall from './CrystalizedBall';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [simulatedAccepted, setSimulatedAccepted] = useState(true);

  return (
    <section className="relative pt-4 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Organic Card Container */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#094e43] via-[#0d6659] to-[#043d35] text-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-teal-950/25 overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[32rem] h-[32rem] rounded-full bg-teal-400/15 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline, Narrative & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Pill */}
          

              {/* High-Impact Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Emergency Blood. <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                  Coordinated in Seconds.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal max-w-xl">
                PulseRelay replaces frantic manual calling with an automated, multi-hospital digital beacon.
                Broadcast urgent unit requirements, compare instant certified offers, and lock stock with zero double-allocation.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-4 rounded-2xl bg-white text-[#0d6659] hover:bg-emerald-50 font-black text-xs shadow-xl shadow-teal-950/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Launch Interactive Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#0d6659]" />
                </button>

                <a
                  href="#simulator"
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs backdrop-blur-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-300" />
                  <span>Test Match Simulator</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-emerald-100/80">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Atomic Unit Locks
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  State License Verified
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Real-Time Sockets
                </span>
              </div>
            </div>

            {/* Right Column: Interactive 3D Crystalized Ball from React Bits (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="w-full h-[450px] sm:h-[500px] lg:h-[540px] relative flex items-center justify-center">
                <CrystalizedBall
                  preset="aurora"
                  color="#5CFFC8"
                  size={0.88}
                  crackle={0.7}
                  flares={0.65}
                  glow={1.15}
                  sparks={0.75}
                  particleCount={18000}
                  fill={0.55}
                  interactive={true}
                  hoverStrength={0.85}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Floating Achievement Cards Overlapping Hero (Kurnia Majid Style) */}
        <div className="relative -mt-10 sm:-mt-12 z-20 grid grid-cols-1 md:grid-cols-3 gap-5 px-4 sm:px-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0d9488] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6 text-[#0d9488]" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Speed
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
              &lt; 4.2 Mins
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-1">Average Network Response</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Nearby blood banks respond with confirmed unit allocations within minutes of broadcast.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                Security
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
              100% Verified
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-1">Certified Participating Facilities</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              State blood licenses and accredited testing standards vetted by the Super Admin authority.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Droplet className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-[10px] font-black tracking-wider uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                Live Inventory
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
              8 Rare Groups
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-1">Multi-Component Grid</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              PRBC, Platelets, Whole Blood, FFP, and Cryo tracked across interconnected regional centres.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
