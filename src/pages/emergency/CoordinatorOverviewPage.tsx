import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Radio,
  PlusCircle,
  HeartHandshake,
  Truck,
  ArrowUpRight,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const CoordinatorOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.emergency);
  const { transfers } = useAppSelector((state) => state.transfer);

  const hospitalId = currentUser?.hospitalId || 'hosp-3';
  const hospitalName = currentUser?.hospitalName || 'Fortis Memorial Emergency Centre';

  // Requests created by this hospital
  const myRequests = requests.filter((r) => r.requestingHospitalId === hospitalId);
  const activeEmergencies = myRequests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  );

  // Total offers awaiting review
  const pendingOffersCount = myRequests.reduce(
    (acc, req) => acc + req.offers.filter((o) => o.status === 'PENDING').length,
    0
  );

  // Active incoming transfers
  const activeIncomingTransfers = transfers.filter(
    (t) => t.receivingHospitalId === hospitalId && t.status !== 'HANDOVER_COMPLETED'
  );

  return (
    <div className="space-y-6">
      {/* Emergency Action Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white backdrop-blur-xs">
              EMERGENCY DESK
            </span>
            <span className="text-xs font-semibold text-emerald-100">{hospitalName}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1">
            Emergency Blood Coordination Grid
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Broadcast emergency blood requirements across Delhi NCR hospital networks, compare incoming hospital offers, and coordinate GPS-tracked deliveries.
          </p>
        </div>

        <button
          onClick={() => navigate('/coordinator/create-request')}
          className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-900/40 flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Broadcast Emergency Request</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies.length}
          subtitle="Real-time open requirements"
          icon={Radio}
          color="rose"
        />
        <StatCard
          title="Received Offers"
          value={pendingOffersCount}
          subtitle="Awaiting allocation confirmation"
          icon={HeartHandshake}
          color="amber"
        />
        <StatCard
          title="Incoming Transfers"
          value={activeIncomingTransfers.length}
          subtitle="Cold-chain shipments in transit"
          icon={Truck}
          color="emerald"
        />
        <StatCard
          title="Network Response Time"
          value="3.8 Mins"
          subtitle="Average time to first offer"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Active Emergencies Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Hospital Emergency Broadcasts</h2>
            <p className="text-xs text-slate-500">Requirements raised by {hospitalName}</p>
          </div>
          <button
            onClick={() => navigate('/coordinator/requests')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {myRequests.map((req) => (
            <div key={req.id} className="p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 font-black text-sm flex items-center justify-center border border-rose-200">
                    {req.bloodGroup}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{req.requestId}</span>
                      <StatusBadge status={req.urgency} />
                      <StatusBadge status={req.status} />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
                      {req.requiredUnits} Units {req.component}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {req.requiredByTime}
                  </span>
                  <button
                    onClick={() => navigate(`/coordinator/requests/${req.id}`)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1"
                  >
                    <span>View Offers ({req.offers.length})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress & Offers */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">Allocation:</span>
                  <span className="font-extrabold text-slate-900">
                    {req.allocatedUnits} / {req.requiredUnits} Units
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({req.offers.filter((o) => o.status === 'ACCEPTED').length} hospital sources accepted)
                  </span>
                </div>

                {req.patientReferenceId && (
                  <span className="text-[11px] font-mono text-slate-500">
                    Ref: {req.patientReferenceId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
