import React, { useState } from 'react';
import { Star, Building2, ShieldCheck, CheckCircle2, Quote } from 'lucide-react';

interface HospitalTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  hospital: string;
  city: string;
  facilityType: string;
  badge: string;
  avatar: string;
  initials: string;
}

const DoctorAvatar: React.FC<{ src: string; alt: string; initials: string }> = ({
  src,
  alt,
  initials,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d6659] to-[#043d35] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/20 shrink-0">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 bg-slate-100"
      />
      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-[9px] text-white font-bold">
        ✓
      </span>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials: HospitalTestimonial[] = [
    {
      id: 'apollo-indore',
      quote:
        'During a 3 AM acute postpartum hemorrhage, our in-house reserve fell short of B-negative PRBC. Instead of wasting 45 minutes making frantic phone calls to multiple facilities, we broadcasted on PulseRelay. City Care Hospital accepted within 2 minutes and our clinical teams coordinated direct handover immediately. It literally saved a young mother’s life.',
      author: 'Dr. Vikramaditya Rathore',
      role: 'Chief Medical Superintendent & HOD Emergency Medicine',
      hospital: 'Apollo Super Speciality Hospital',
      city: 'Indore, Madhya Pradesh',
      facilityType: 'NABH Accredited Multi-Speciality',
      badge: 'B- Negative Emergency Saved',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
      initials: 'VR',
    },
    {
      id: 'citycare-hospital',
      quote:
        'PulseRelay has completely redefined inter-hospital mutual assistance. When our ICU was overwhelmed with multiple road-traffic trauma admissions, peer hospitals responded within seconds to our emergency broadcast. Knowing we can directly connect doctor-to-doctor without administrative red tape gives our surgical team immense confidence.',
      author: 'Dr. Sunita Deshmukh',
      role: 'Medical Director & Head of Surgery',
      hospital: 'City Care Multi-Speciality Hospital',
      city: 'Indore, Madhya Pradesh',
      facilityType: 'Certified Regional Trauma Node',
      badge: 'Golden Hour Resuscitation',
      avatar: 'https://images.unsplash.com/photo-1594824813515-5a2a07c11f7c?w=200&auto=format&fit=crop&q=80',
      initials: 'SD',
    },
    {
      id: 'max-delhi',
      quote:
        'In blood banking, speed and mutual cooperation between hospitals are paramount. PulseRelay provides real-time visibility across participating hospital inventories. When a neighboring hospital requests help, our officers accept with a single click, unlocking direct phone coordination and rapid peer handover.',
      author: 'Dr. Rajesh K. Singhal',
      role: 'Director of Transfusion Medicine & Blood Centre',
      hospital: 'Max Super Speciality Hospital',
      city: 'Saket, New Delhi',
      facilityType: 'Central Blood Transfusion Hub',
      badge: 'Direct Peer Coordination',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
      initials: 'RS',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-[#0d9488] text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Network Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trusted by Participating Hospitals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Hear from medical directors and emergency heads on how PulseRelay enables hospitals to help each other and save lives during acute blood shortages.
          </p>
        </div>

        {/* 3 Hospital Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Card Header: Rating & Hospital Node Tag */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-50 text-[#0d9488] border border-teal-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Hospital
                  </span>
                </div>

                {/* Outcome Badge */}
                <div className="mb-4 inline-block">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                    ⚡ {t.badge}
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  "{t.quote}"
                </p>
              </div>

              {/* Card Footer: Doctor & Hospital Metadata */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center space-x-3.5">
                <DoctorAvatar src={t.avatar} alt={t.author} initials={t.initials} />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{t.author}</h4>
                  <p className="text-[11px] text-[#0d9488] font-semibold truncate">{t.role}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    {t.hospital} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
