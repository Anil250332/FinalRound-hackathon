import React from 'react';
import { Quote, Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'During mass-casualty expressway trauma cases, calling 6 different blood banks manually wasted 40 minutes of golden hour resuscitation. With PulseRelay, we had 4 units of O-negative locked from AIIMS and Safdarjung within 3.5 minutes.',
      author: 'Dr. Ananya Sen',
      role: 'Chief of Trauma & Acute Surgery',
      hospital: 'AIIMS Central Trauma Centre',
      avatar: 'https://images.unsplash.com/photo-1594824813515-5a2a07c11f7c?w=150',
    },
    {
      quote:
        'The atomic reservation mechanism is a game changer. We no longer worry about promising units to two different hospitals. Once an offer is accepted, the system handles the lock and notifies our cold-chain team automatically.',
      author: 'Dr. R. K. Bhatt',
      role: 'Director of Transfusion Medicine',
      hospital: 'Regional Blood Transfusion Centre',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    },
    {
      quote:
        'Clinical compliance and audit traceability are paramount in blood banking. Having cryptographic logs of who offered units, when they were reserved, and recipient verification gives our hospital complete governance confidence.',
      author: 'Dr. Neha Malhotra',
      role: 'Head of Quality & Compliance',
      hospital: 'Max Healthcare Institute',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0d9488] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Clinical Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Trusted by Critical Care Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Read how chief surgeons and blood bank officers rely on PulseRelay during life-or-death decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center space-x-3.5">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-[#0d9488] font-semibold">{t.role}</p>
                  <p className="text-[10px] text-slate-400">{t.hospital}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
