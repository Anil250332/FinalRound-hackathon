import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive',
  color = 'emerald',
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/60',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200/60',
      iconBg: 'bg-teal-100 text-teal-800',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200/60',
      iconBg: 'bg-rose-100 text-rose-800',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/60',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/60',
      iconBg: 'bg-blue-100 text-blue-800',
    },
  };

  const scheme = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-600 font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold text-[11px] ${
                trendType === 'positive'
                  ? 'text-emerald-700'
                  : trendType === 'negative'
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
