import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { apiService } from '../../services/apiService';
import { StatusBadge } from '../../components/common/Badge';
import {
  Radio,
  Search,
  Building2,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Send,
  Inbox,
  ArrowRight,
} from 'lucide-react';

export const HospitalEmergencyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);

  const hospitalId = currentUser?.hospitalId || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || 'My Hospital';

  const [activeTab, setActiveTab] = useState<'INCOMING' | 'ACCEPTED_BY_US' | 'OUR_REQUESTS'>('INCOMING');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  // Tab 1: Incoming requests from other hospitals needing blood
  const incomingRequests = requests.filter(
    (r) => r.requestingHospitalId !== hospitalId && r.status === 'SEARCHING'
  );

  // Tab 2: Requests this hospital accepted to help others
  const acceptedByUs = requests.filter(
    (r) => r.acceptedByHospitalId === hospitalId || (r.status === 'ACCEPTED' && r.acceptedByHospitalName?.includes(hospitalName))
  );

  // Tab 3: Requests created by this hospital
  const ourRequests = requests.filter(
    (r) => r.requestingHospitalId === hospitalId || r.requestingHospitalName?.includes(hospitalName)
  );

  const getDisplayList = () => {
    let list = activeTab === 'INCOMING' ? incomingRequests : activeTab === 'ACCEPTED_BY_US' ? acceptedByUs : ourRequests;
    if (!search) return list;
    return list.filter(
      (r) =>
        r.requestId.toLowerCase().includes(search.toLowerCase()) ||
        r.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
        r.requestingHospitalName.toLowerCase().includes(search.toLowerCase()) ||
        (r.acceptedByHospitalName && r.acceptedByHospitalName.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const currentList = getDisplayList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Hospital Coordination Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Emergency Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track requests received from other hospitals, requests accepted by our team, and emergency requests raised by us.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchEmergencyRequests())}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* 3 Interactive Tab Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('INCOMING')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'INCOMING'
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Kitni Aayi Hain (Incoming)</span>
              <Inbox className={`w-4 h-4 ${activeTab === 'INCOMING' ? 'text-rose-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{incomingRequests.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active requests needing blood</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACCEPTED_BY_US')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'ACCEPTED_BY_US'
                ? 'bg-teal-50 border-teal-200 ring-2 ring-[#0d9488]/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Kitni Accept Ki Hain</span>
              <CheckCircle2 className={`w-4 h-4 ${activeTab === 'ACCEPTED_BY_US' ? 'text-[#0d9488]' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{acceptedByUs.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Helped another hospital</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OUR_REQUESTS')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'OUR_REQUESTS'
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Kitni Request Kari Hain</span>
              <Send className={`w-4 h-4 ${activeTab === 'OUR_REQUESTS' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{ourRequests.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Raised for our patients</p>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, hospital, blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading requests...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No requests in this section</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'INCOMING'
                ? 'No pending emergency broadcasts from other hospitals right now.'
                : activeTab === 'ACCEPTED_BY_US'
                ? 'This hospital has not accepted any external emergency requests yet.'
                : 'No emergency requests raised by this hospital yet.'}
            </p>
          </div>
        ) : (
          currentList.map((req) => {
            const isAccepted = req.status === 'ACCEPTED';
            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md ${
                  isAccepted ? 'border-teal-200 bg-teal-50/10' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center border border-rose-100 shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAccepted
                              ? 'bg-teal-100 text-[#0d9488] border border-teal-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAccepted ? 'Accepted & Connected' : 'Searching for Hospital'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Needed: <strong className="text-slate-800">{req.requiredUnits} Units</strong> of {req.component}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Required by: {req.requiredByTime}
                  </span>
                </div>

                {/* Section Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Requesting Hospital:</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{req.requestingHospitalName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.requestingHospitalCity || 'Indore'}
                    </p>
                    {req.clinicalNotes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-white p-2 rounded-xl border border-slate-200/60">
                        <strong className="text-slate-700">Clinical Need:</strong> {req.clinicalNotes}
                      </p>
                    )}
                  </div>

                  {/* Fulfilling Hospital Status */}
                  <div
                    className={`rounded-2xl p-4 border ${
                      isAccepted ? 'bg-teal-50/80 border-teal-200' : 'bg-slate-50/60 border-dashed border-slate-200'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#0d9488]" />
                      Accepting Hospital Contact Info:
                    </p>

                    {isAccepted ? (
                      <div className="mt-1">
                        <p className="text-sm font-extrabold text-[#0d9488] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {req.acceptedByHospitalName || 'Registered Blood Bank'}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          {req.acceptedByHospitalPhone && (
                            <p className="flex items-center gap-2 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalPhone}</span>
                            </p>
                          )}
                          {req.acceptedByHospitalEmail && (
                            <p className="flex items-center gap-2 font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalEmail}</span>
                            </p>
                          )}
                          {req.acceptedByHospitalCity && (
                            <p className="flex items-center gap-2 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalCity}</span>
                            </p>
                          )}
                          {req.acceptedAt && (
                            <p className="text-[10px] text-[#0d9488] font-bold mt-1">
                              Connected on: {req.acceptedAt}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs font-bold text-amber-700">Awaiting acceptance</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Once another hospital accepts this request, their phone and contact details will appear here immediately for direct coordination.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
