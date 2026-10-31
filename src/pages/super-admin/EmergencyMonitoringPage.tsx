import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setFilterStatus, setFilterUrgency } from '../../store/slices/emergencySlice';
import { StatusBadge } from '../../components/common/Badge';
import { RequestStatus, UrgencyLevel } from '../../types';
import {
  Radio,
  Clock,
  Building2,
  Droplet,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  HeartHandshake,
  Navigation,
} from 'lucide-react';

export const EmergencyMonitoringPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, filterStatus, filterUrgency } = useAppSelector((state) => state.emergency);

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesUrgency = filterUrgency === 'ALL' || r.urgency === filterUrgency;
    return matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Network Emergency Monitoring
            </h1>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-centre emergency broadcast stream & allocation telemetry
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterUrgency}
            onChange={(e) => dispatch(setFilterUrgency(e.target.value as any))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="URGENT">Urgent Only</option>
            <option value="NORMAL">Normal</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => dispatch(setFilterStatus(e.target.value as any))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="ALL">All Lifecycles</option>
            <option value="SEARCHING">Searching</option>
            <option value="OFFERS_RECEIVED">Offers Received</option>
            <option value="PARTIALLY_ALLOCATED">Partially Allocated</option>
            <option value="FULLY_ALLOCATED">Fully Allocated</option>
            <option value="DISPATCH_INITIATED">Dispatch Initiated</option>
            <option value="HANDOVER_COMPLETED">Handover Completed</option>
          </select>
        </div>
      </div>

      {/* Emergency Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className={`bg-white rounded-3xl border p-5 shadow-xs transition-all ${
              req.urgency === 'CRITICAL'
                ? 'border-rose-200 hover:border-rose-400'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            {/* Header of Card */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${
                    req.urgency === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {req.bloodGroup}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{req.requestId}</span>
                    <StatusBadge status={req.urgency} />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
                    {req.requiredUnits} Units {req.component}
                  </h3>
                </div>
              </div>

              <StatusBadge status={req.status} />
            </div>

            {/* Request Details */}
            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {req.requestingHospitalName}
                </span>
                <span className="flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  <Clock className="w-3.5 h-3.5" />
                  {req.requiredByTime}
                </span>
              </div>

              {req.clinicalNotes && (
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed text-[11px]">
                  <strong>Clinical note:</strong> {req.clinicalNotes}
                </p>
              )}

              {/* Allocation Progress Bar */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Allocation Progress</span>
                  <span>
                    {req.allocatedUnits} / {req.requiredUnits} Units (
                    {Math.round((req.allocatedUnits / req.requiredUnits) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      req.allocatedUnits >= req.requiredUnits
                        ? 'bg-emerald-500'
                        : req.allocatedUnits > 0
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (req.allocatedUnits / req.requiredUnits) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Offers Summary */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    Participating Hospital Offers ({req.offers.length})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {req.offers.filter((o) => o.status === 'ACCEPTED').length} accepted
                  </span>
                </div>

                <div className="mt-2 space-y-1.5">
                  {req.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-[11px] border border-slate-100"
                    >
                      <div className="truncate max-w-[220px]">
                        <span className="font-bold text-slate-900">{offer.hospitalName}</span>
                        <span className="text-slate-500 text-[10px] block">
                          {offer.distanceKm} km away • Transit est: {offer.estimatedTransitMinutes}m
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{offer.offeredUnits} Units</span>
                        <StatusBadge status={offer.status} />
                      </div>
                    </div>
                  ))}
                  {req.offers.length === 0 && (
                    <p className="text-[11px] text-slate-400 italic py-1">
                      Searching regional network centres... Notifications dispatched.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
