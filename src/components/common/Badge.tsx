import React from 'react';
import { RequestStatus, UrgencyLevel, TransferStatus } from '../../types';

interface BadgeProps {
  status?: RequestStatus | TransferStatus | UrgencyLevel | string;
  variant?: 'emerald' | 'rose' | 'amber' | 'blue' | 'slate' | 'purple';
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, variant, children }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = children || status;

  if (variant) {
    switch (variant) {
      case 'emerald':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'rose':
        style = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'amber':
        style = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'blue':
        style = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'purple':
        style = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
    }
  } else if (status) {
    switch (status) {
      case 'CRITICAL':
        style = 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold animate-pulse';
        label = 'CRITICAL';
        break;
      case 'URGENT':
        style = 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
        label = 'URGENT';
        break;
      case 'NORMAL':
        style = 'bg-blue-50 text-blue-700 border-blue-200';
        label = 'NORMAL';
        break;
      case 'SEARCHING':
        style = 'bg-blue-50 text-blue-700 border-blue-200';
        label = 'Searching Network';
        break;
      case 'OFFERS_RECEIVED':
        style = 'bg-purple-50 text-purple-700 border-purple-200';
        label = 'Offers Received';
        break;
      case 'PARTIALLY_ALLOCATED':
        style = 'bg-amber-50 text-amber-800 border-amber-300';
        label = 'Partially Allocated';
        break;
      case 'FULLY_ALLOCATED':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
        label = 'Fully Allocated';
        break;
      case 'DISPATCH_INITIATED':
      case 'IN_TRANSIT':
        style = 'bg-teal-50 text-teal-700 border-teal-300 font-semibold';
        label = status === 'IN_TRANSIT' ? 'In Transit' : 'Dispatch Initiated';
        break;
      case 'HANDOVER_COMPLETED':
        style = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        label = 'Handover Completed';
        break;
      case 'VERIFIED':
      case 'ACTIVE':
        style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        label = 'Verified';
        break;
      case 'PENDING_VERIFICATION':
      case 'PENDING':
        style = 'bg-amber-50 text-amber-700 border-amber-200';
        label = 'Pending';
        break;
      case 'SUSPENDED':
      case 'CANCELLED':
        style = 'bg-rose-50 text-rose-700 border-rose-200';
        label = 'Suspended';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}
    >
      {label}
    </span>
  );
};
