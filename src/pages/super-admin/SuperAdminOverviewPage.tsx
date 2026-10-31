import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Building2,
  Droplet,
  Radio,
  Truck,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuperAdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const { requests } = useAppSelector((state) => state.emergency);
  const { transfers } = useAppSelector((state) => state.transfer);
  const { items } = useAppSelector((state) => state.inventory);

  const totalHospitals = hospitals.length;
  const verifiedHospitals = hospitals.filter((h) => h.verified).length;
  const pendingApprovals = hospitals.filter((h) => h.status === 'PENDING_VERIFICATION').length;
  const activeEmergencies = requests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  ).length;
  const completedTransfers = transfers.filter((t) => t.status === 'HANDOVER_COMPLETED').length;
  const totalUnitsInGrid = items.reduce((acc, curr) => acc + curr.availableUnits, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              National Blood Network Command
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              LIVE GRID
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time inter-hospital inventory telemetry, emergency broadcasts & verified blood transfers
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/super-admin/hospitals')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Hospitals</span>
          </button>
          <button
            onClick={() => navigate('/super-admin/emergency-monitoring')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Live Monitor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Participating Hospitals"
          value={totalHospitals}
          subtitle={`${verifiedHospitals} verified centres`}
          icon={Building2}
          color="emerald"
          trend="+2 pending verification"
          trendType="neutral"
        />
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies}
          subtitle="Real-time multi-centre requests"
          icon={Radio}
          color="rose"
          trend="Avg response: 4.2 mins"
          trendType="positive"
        />
        <StatCard
          title="Completed Transfers"
          value={completedTransfers}
          subtitle="100% cold-chain verified"
          icon={Truck}
          color="teal"
          trend="Zero spoilage reported"
          trendType="positive"
        />
        <StatCard
          title="Available Blood Units"
          value={totalUnitsInGrid}
          subtitle="PRBC, Platelets & FFP"
          icon={Droplet}
          color="blue"
          trend="8 Rare units in reserve"
          trendType="positive"
        />
      </div>

      {/* Two Column Section: Live Urgent Requests & Pending Hospital Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Emergency Broadcasts (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Regional Emergencies</h2>
              <p className="text-xs text-slate-500">Live requests currently seeking or allocating units</p>
            </div>
            <button
              onClick={() => navigate('/super-admin/emergency-monitoring')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.slice(0, 3).map((req) => (
              <div key={req.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 font-black text-xs flex items-center justify-center border border-rose-200">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {req.requestingHospitalName} • {req.component} ({req.allocatedUnits}/{req.requiredUnits} Units Allocated)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {req.requiredByTime}
                  </span>
                </div>

                {req.clinicalNotes && (
                  <p className="mt-2.5 text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {req.clinicalNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pending Hospital Approvals & Verification Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hospital Approvals</h2>
              <p className="text-xs text-slate-500">Facility verification & compliance</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {pendingApprovals} Action Needed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {hospitals.map((hosp) => (
              <div key={hosp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{hosp.name}</p>
                    <StatusBadge status={hosp.status} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {hosp.city}, {hosp.state} • Lic: {hosp.licenseNumber}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/super-admin/hospitals')}
                  className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
