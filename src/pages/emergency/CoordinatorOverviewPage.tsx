import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { fetchHospitalTransfers } from '../../store/slices/transferSlice';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { SkeletonCard, Skeleton } from '../../components/common/Skeleton';
import {
  Radio,
  PlusCircle,
  HeartHandshake,
  Truck,
  ArrowUpRight,
  Clock,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const CoordinatorOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { transfers } = useAppSelector((state) => state.transfer);

  const hospitalId = currentUser?.hospitalId || 'hosp-3';
  const hospitalName = currentUser?.hospitalName || 'Fortis Memorial Emergency Centre';

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
    if (hospitalId) {
      dispatch(fetchHospitalTransfers(hospitalId));
    }
  }, [dispatch, hospitalId]);

  // Requests created by this hospital
  const myRequests = requests.filter((r) => r.requestingHospitalId === hospitalId);
  const activeEmergencies = myRequests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  );

  const pendingOffersCount = myRequests.reduce(
    (acc, req) => acc + req.offers.filter((o) => o.status === 'PENDING').length,
    0
  );

  const activeIncomingTransfers = transfers.filter(
    (t) => t.receivingHospitalId === hospitalId && t.status !== 'HANDOVER_COMPLETED'
  );

  return (
    <div className="space-y-8">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Emergency Coordinator</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Active emergencies and multi-hospital blood coordination for {hospitalName}
          </p>
        </div>

        <button
          onClick={() => navigate('/coordinator/create-request')}
          className="px-5 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Broadcast Emergency Request</span>
        </button>
      </div>

      {/* 4 Minimalist KPI Cards matching Image 2 style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies.length}
          icon={Radio}
          color="rose"
        />
        <StatCard
          title="Received Offers"
          value={pendingOffersCount}
          icon={HeartHandshake}
          color="amber"
        />
        <StatCard
          title="Incoming Transfers"
          value={activeIncomingTransfers.length}
          icon={Truck}
          color="teal"
        />
        <StatCard
          title="Response Time"
          value="3.8 Mins"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Hospital Emergency Broadcasts List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Hospital Emergency Broadcasts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Requirements raised by {hospitalName}</p>
          </div>
          <button
            onClick={() => navigate('/coordinator/requests')}
            className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1"
          >
            <span>All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {myRequests.map((req) => (
            <div key={req.id} className="py-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center border border-rose-100 shadow-2xs">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{req.requestId}</span>
                      <StatusBadge status={req.urgency} />
                      <StatusBadge status={req.status} />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                      {req.requiredUnits} Units {req.component}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {req.requiredByTime}
                  </span>
                  <button
                    onClick={() => navigate(`/coordinator/requests/${req.id}`)}
                    className="px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>View Offers ({req.offers.length})</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Allocation Summary */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 pl-16">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">Allocation:</span>
                  <span className="font-bold text-slate-900">
                    {req.allocatedUnits} / {req.requiredUnits} Units
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({req.offers.filter((o) => o.status === 'ACCEPTED').length} hospital sources accepted)
                  </span>
                </div>

                {req.patientReferenceId && (
                  <span className="text-[11px] font-mono text-slate-400">
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
