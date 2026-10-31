import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Building2,
  Users,
  Droplet,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HospitalOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.inventory);
  const { requests } = useAppSelector((state) => state.emergency);
  const { transfers } = useAppSelector((state) => state.transfer);

  // Hospital specific items
  const hospitalId = currentUser?.hospitalId || 'hosp-1';
  const hospitalName = currentUser?.hospitalName || 'AIIMS Central Hospital & Blood Centre';

  const hospitalInventory = items.filter((i) => i.hospitalId === hospitalId);
  const totalAvailableUnits = hospitalInventory.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const totalReservedUnits = hospitalInventory.reduce((acc, curr) => acc + curr.reservedUnits, 0);

  const activeHospitalTransfers = transfers.filter(
    (t) => (t.supplyingHospitalId === hospitalId || t.receivingHospitalId === hospitalId) && t.status !== 'HANDOVER_COMPLETED'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Hospital Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{hospitalName}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                VERIFIED FACILITY
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Ansari Nagar, New Delhi
              </span>
              <span>•</span>
              <span>License: DL-BB-2024-0019</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/hospital-admin/staff')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Staff</span>
          </button>
          <button
            onClick={() => navigate('/hospital-admin/profile')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="In-House Blood Units"
          value={totalAvailableUnits}
          subtitle={`${totalReservedUnits} units locked for outgoing emergencies`}
          icon={Droplet}
          color="emerald"
        />
        <StatCard
          title="Active Staff Accounts"
          value="14"
          subtitle="4 Officers, 10 Coordinators"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Active Transfers"
          value={activeHospitalTransfers}
          subtitle="In-transit or cold-chain packing"
          icon={Truck}
          color="rose"
        />
        <StatCard
          title="Network Fulfillment"
          value="98.4%"
          subtitle="Average transfer time: 24 mins"
          icon={ShieldCheck}
          color="blue"
        />
      </div>

      {/* Two Column Layout: Quick Stock Status & Hospital Emergency Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Local Blood Stock Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Hospital Blood Reserves</h2>
              <p className="text-xs text-slate-500">Breakdown of on-site blood components</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/inventory')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View Full Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hospitalInventory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{item.bloodGroup}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {item.component}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-slate-900">{item.availableUnits}</span>
                  <span className="text-[10px] text-slate-500">Available</span>
                </div>
                {item.reservedUnits > 0 && (
                  <p className="text-[10px] text-amber-700 font-semibold mt-1">
                    🔒 {item.reservedUnits} units reserved
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Transfer Logistics for this Hospital (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Hospital Dispatches</h2>
              <p className="text-xs text-slate-500">Outbound & incoming emergency blood logistics</p>
            </div>
            <button
              onClick={() => navigate('/coordinator/transfers')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Transfer Center</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {transfers.map((trf) => (
              <div
                key={trf.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {trf.bloodGroup}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {trf.units} Units {trf.component}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {trf.supplyingHospitalName} → {trf.receivingHospitalName}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={trf.status} />
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    {trf.courierName}
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    Temp: {trf.coldChainTempCelsius}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
