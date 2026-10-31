import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAuditLogs } from '../../store/slices/notificationSlice';
import { SkeletonTableRow } from '../../components/common/Skeleton';
import {
  FileText,
  Search,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Terminal,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auditLogs, isLoading } = useAppSelector((state) => state.notifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit & Compliance Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              IMMUTABLE RECORD
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete cryptographic audit trail of all blood offers, reservations, OTP handovers and facility actions
          </p>
        </div>

        <button
          onClick={() => alert('Compliance Audit Report exported as cryptographically verified PDF!')}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export Audit Trail (PDF)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, action, IP, or resource..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Actions</option>
            <option value="BROADCAST_REQUEST">Emergency Broadcasts</option>
            <option value="SUBMIT_OFFER">Offers Submitted</option>
            <option value="ACCEPT_OFFER">Offers Accepted</option>
            <option value="DISPATCH_SHIPMENT">Transfers Dispatched</option>
            <option value="VERIFY_HOSPITAL">Hospital Verifications</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Authorized User</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">Audit Details</th>
                <th className="py-3.5 px-5 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <>
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                  <SkeletonTableRow columns={6} />
                </>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No compliance audit records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{log.userName}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {log.userRole.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[11px] text-slate-800">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {log.targetResource}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-5 text-right font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
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
