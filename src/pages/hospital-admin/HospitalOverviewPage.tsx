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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HospitalOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.inventory);
  const { transfers } = useAppSelector((state) => state.transfer);

  const hospitalId = currentUser?.hospitalId || 'hosp-1';
  const hospitalName = currentUser?.hospitalName || 'AIIMS Central Hospital & Blood Centre';

  const hospitalInventory = items.filter((i) => i.hospitalId === hospitalId);
  const totalAvailableUnits = hospitalInventory.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const totalReservedUnits = hospitalInventory.reduce((acc, curr) => acc + curr.reservedUnits, 0);

  const activeHospitalTransfers = transfers.filter(
    (t) => (t.supplyingHospitalId === hospitalId || t.receivingHospitalId === hospitalId) && t.status !== 'HANDOVER_COMPLETED'
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{hospitalName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              VERIFIED
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Ansari Nagar, New Delhi
            </span>
            <span>•</span>
            <span>License: DL-BB-2024-0019</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/hospital-admin/staff')}
            className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Manage Staff</span>
          </button>
          <button
            onClick={() => navigate('/hospital-admin/profile')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 4 Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="In-House Blood Units"
          value={totalAvailableUnits}
          subtitle={`${totalReservedUnits} units locked for outgoing emergencies`}
          icon={Droplet}
          color="teal"
        />
        <StatCard
          title="Active Staff Accounts"
          value="14"
          subtitle="4 Officers, 10 Coordinators"
          icon={Users}
          color="emerald"
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Local Blood Stock Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hospital Blood Reserves</h2>
              <p className="text-xs text-slate-400 mt-0.5">On-site component stock availability</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/inventory')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {hospitalInventory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{item.bloodGroup}</span>
                  <span className="text-[10px] font-bold text-[#0d9488] bg-[#0d9488]/10 px-2 py-0.5 rounded-full">
                    {item.component}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black text-slate-900">{item.availableUnits}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Available</span>
                </div>
                {item.reservedUnits > 0 && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">
                    🔒 {item.reservedUnits} reserved
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Transfer Logistics (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Live Hospital Dispatches</h2>
              <p className="text-xs text-slate-400 mt-0.5">Outbound & incoming emergency blood logistics</p>
            </div>
            <button
              onClick={() => navigate('/coordinator/transfers')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1"
            >
              <span>Transfer Center</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {transfers.map((trf) => (
              <div
                key={trf.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center">
                      {trf.bloodGroup}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {trf.units} Units {trf.component}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {trf.supplyingHospitalName} → {trf.receivingHospitalName}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={trf.status} />
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    {trf.courierName}
                  </span>
                  <span className="font-mono text-[#0d9488] font-bold">
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
