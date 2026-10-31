import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Droplet,
  BookmarkCheck,
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const BloodBankOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.inventory);
  const { requests } = useAppSelector((state) => state.emergency);

  const hospitalId = currentUser?.hospitalId || 'hosp-1';
  const myInventory = items.filter((i) => i.hospitalId === hospitalId);

  const totalAvailable = myInventory.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const totalReserved = myInventory.reduce((acc, curr) => acc + curr.reservedUnits, 0);

  // Incoming emergencies searching for units
  const incomingEmergencies = requests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  );

  // Low stock critical alerts (e.g. O- or units < 10)
  const lowStockItems = myInventory.filter((i) => i.availableUnits < 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blood Bank Operations Desk</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              CENTRAL BLOOD CENTRE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time component inventory, incoming emergency broadcasts, offers and unit reservations
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate('/blood-bank/inventory')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Update Stock</span>
          </button>
          <button
            onClick={() => navigate('/blood-bank/incoming-requests')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center space-x-1.5"
          >
            <Inbox className="w-4 h-4 text-rose-500" />
            <span>Incoming Requests ({incomingEmergencies.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ready Blood Units"
          value={totalAvailable}
          subtitle="Cross-matched & certified units"
          icon={Droplet}
          color="emerald"
        />
        <StatCard
          title="Reserved Units"
          value={totalReserved}
          subtitle="Locked for accepted hospital offers"
          icon={BookmarkCheck}
          color="amber"
        />
        <StatCard
          title="Incoming Requests"
          value={incomingEmergencies.length}
          subtitle="Urgent broadcasts in Delhi NCR"
          icon={Inbox}
          color="rose"
        />
        <StatCard
          title="Critical Shortage Watch"
          value={lowStockItems.length}
          subtitle="Groups below minimum threshold"
          icon={AlertTriangle}
          color="blue"
        />
      </div>

      {/* Two Column Layout: Urgent Requests to respond + Inventory Quick Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incoming Emergency Broadcasts (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Incoming Urgent Broadcasts</h2>
              <p className="text-xs text-slate-500">Hospitals actively seeking blood units</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/incoming-requests')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Review & Make Offer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {incomingEmergencies.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 font-black text-sm flex items-center justify-center border border-rose-200">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                      </div>
                      <p className="text-xs text-slate-700 font-semibold mt-0.5">
                        {req.requiredUnits} Units {req.component}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {req.requiredByTime}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {req.requestingHospitalName} ({req.requestingHospitalCity})
                  </span>
                  <button
                    onClick={() => navigate('/blood-bank/incoming-requests')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Send Offer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Blood Inventory Group Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Component Stock Breakdown</h2>
              <p className="text-xs text-slate-500">On-site stock with storage telemetry</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/inventory')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {myInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                    {item.bloodGroup}
                  </span>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{item.component}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Temp: {item.storageTemp}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-slate-900">{item.availableUnits} Units</span>
                  {item.reservedUnits > 0 && (
                    <span className="text-[10px] text-amber-600 block font-semibold">
                      ({item.reservedUnits} reserved)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
