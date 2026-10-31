import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  BarChart3,
  Download,
  TrendingUp,
  Droplet,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react';

export const HospitalReportsPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { transfers } = useAppSelector((state) => state.transfer);
  const hospitalName = currentUser?.hospitalName || 'AIIMS Central Hospital';

  const completedTransfers = transfers.filter((t) => t.status === 'HANDOVER_COMPLETED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Activity & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Emergency coordination performance, fulfillment rates and cold-chain compliance metrics for {hospitalName}
          </p>
        </div>

        <button
          onClick={() => alert('Monthly Clinical Transfer Audit downloaded successfully!')}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Download Performance CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fulfillment Success"
          value="98.7%"
          subtitle="All emergency broadcasts satisfied"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Units Supplied"
          value="48 Units"
          subtitle="Outbound to 6 hospitals this month"
          icon={Droplet}
          color="teal"
        />
        <StatCard
          title="Units Received"
          value="32 Units"
          subtitle="Critical emergency infusions"
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Avg Dispatch Transit"
          value="21.4 Mins"
          subtitle="City green-corridor transfers"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Inter-Hospital Transfers</h2>
            <p className="text-xs text-slate-500">Historical transfers and verified receiver handovers</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">March 2026 Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Transfer Reference</th>
                <th className="py-3.5 px-4">Supplying Facility</th>
                <th className="py-3.5 px-4">Receiving Facility</th>
                <th className="py-3.5 px-4">Component & Units</th>
                <th className="py-3.5 px-4">Cold-Chain Temp</th>
                <th className="py-3.5 px-4">Handover Verification</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                    {trf.transferId}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {trf.supplyingHospitalName}
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {trf.receivingHospitalName}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">{trf.units} Units</span>{' '}
                    <span className="text-slate-500 font-medium">({trf.bloodGroup} {trf.component})</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700">
                    {trf.coldChainTempCelsius}°C
                  </td>

                  <td className="py-3.5 px-4">
                    {trf.isOtpVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        OTP Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        In Transit
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <StatusBadge status={trf.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
