import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { submitOffer, submitOfferApi, fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonRequestCard } from '../../components/common/Skeleton';
import {
  Inbox,
  Send,
  Building2,
  Clock,
  Droplet,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const IncomingRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { items } = useAppSelector((state) => state.inventory);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const hospitalId =
    currentUser?.hospitalId && currentUser.hospitalId.length === 24
      ? currentUser.hospitalId
      : hospitals[0]?.id || '6ae5bfa3a41657de36e25a1e';
  const hospitalName = currentUser?.hospitalName || hospitals[0]?.name || 'Apollo Demo Blood Centre';

  const [selectedReqForOffer, setSelectedReqForOffer] = useState<EmergencyRequest | null>(null);
  const [offerUnits, setOfferUnits] = useState(1);
  const [transitMins, setTransitMins] = useState(25);
  const [offerNotes, setOfferNotes] = useState('');
  const [offerSuccessMsg, setOfferSuccessMsg] = useState<string | null>(null);

  const incomingBroadcasts = requests.filter(
    (r) =>
      r.requestingHospitalId !== hospitalId &&
      (r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED')
  );

  const handleOpenOfferModal = (req: EmergencyRequest) => {
    setSelectedReqForOffer(req);
    const needed = req.requiredUnits - req.allocatedUnits;
    setOfferUnits(Math.max(1, Math.min(2, needed)));
    setTransitMins(30);
    setOfferNotes('Certified unit in temperature-monitored carrier ready for rapid dispatch.');
  };

  const handleSendOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForOffer) return;

    await dispatch(
      submitOfferApi({
        requestId: selectedReqForOffer.id,
        offeredUnits: offerUnits,
        notes: offerNotes,
        offeringHospitalId: hospitalId,
      })
    );
    dispatch(fetchEmergencyRequests());

    dispatch(
      submitOffer({
        requestId: selectedReqForOffer.id,
        offer: {
          requestId: selectedReqForOffer.id,
          hospitalId,
          hospitalName,
          hospitalCity: 'New Delhi',
          distanceKm: 18.2,
          offeredUnits: offerUnits,
          offeredComponent: selectedReqForOffer.component,
          offeredBloodGroup: selectedReqForOffer.bloodGroup,
          estimatedTransitMinutes: transitMins,
          offeredByOfficerName: currentUser?.name || 'Officer Vikram Rathore',
          notes: offerNotes,
        },
      })
    );

    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'usr-bbo-1',
        userName: currentUser?.name || 'Blood Bank Officer',
        userRole: 'BLOOD_BANK_OFFICER',
        action: 'SUBMIT_OFFER',
        targetResource: selectedReqForOffer.requestId,
        details: `Submitted offer of ${offerUnits} units (${selectedReqForOffer.bloodGroup} ${selectedReqForOffer.component}) to ${selectedReqForOffer.requestingHospitalName}`,
        ipAddress: '14.139.60.2',
      })
    );

    dispatch(
      addNotification({
        title: 'Offer Dispatched to Emergency Coordinator',
        message: `Your offer of ${offerUnits} Units ${selectedReqForOffer.bloodGroup} was sent to ${selectedReqForOffer.requestingHospitalName}.`,
        type: 'SUCCESS',
        requestId: selectedReqForOffer.id,
      })
    );

    setOfferSuccessMsg(`Offer of ${offerUnits} units successfully broadcast to ${selectedReqForOffer.requestingHospitalName}!`);
    setSelectedReqForOffer(null);
    setTimeout(() => setOfferSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Incoming Emergency Requirements</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review critical blood broadcasts from nearby emergency centres and allocate available units
        </p>
      </div>

      {offerSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{offerSuccessMsg}</span>
        </div>
      )}

      {/* Broadcast Cards Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonRequestCard />
            <SkeletonRequestCard />
            <SkeletonRequestCard />
          </div>
        ) : incomingBroadcasts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-sm">No Pending Emergency Requirements</h3>
            <p className="text-xs text-slate-500 mt-1">All regional hospital blood requests are currently fulfilled.</p>
          </div>
        ) : (
          incomingBroadcasts.map((req) => {
            // Check if our inventory has matching units
            const matchingStock = items.find(
              (i) =>
                i.hospitalId === hospitalId &&
                i.bloodGroup === req.bloodGroup &&
                i.component === req.component
            );
            const availableInStock = matchingStock?.availableUnits || 0;
            const hasEnough = availableInStock > 0;

            const myOffer = req.offers.find((o) => o.hospitalId === hospitalId);

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 font-black text-base flex items-center justify-center border border-rose-200">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <StatusBadge status={req.status} />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                        {req.requiredUnits} Units {req.component}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {req.requiredByTime}
                      </span>
                    </div>

                    {myOffer ? (
                      <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        Offer Sent ({myOffer.offeredUnits} Units - {myOffer.status})
                      </span>
                    ) : hasEnough ? (
                      <button
                        onClick={() => handleOpenOfferModal(req)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Unit Offer</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                        Out of Stock ({availableInStock} Available)
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Requesting Centre</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {req.requestingHospitalName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{req.requestingHospitalCity} • Ref: {req.patientReferenceId || 'Emergency OR'}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Our Stock Availability</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                      {availableInStock} Units Available
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {hasEnough ? 'Sufficient stock to supply' : 'Cannot satisfy requirement'}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Allocation Status</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {req.allocatedUnits} of {req.requiredUnits} Units Allocated
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {req.offers.length} hospital offers submitted
                    </p>
                  </div>
                </div>

                {req.clinicalNotes && (
                  <p className="mt-3 text-xs text-slate-600 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60 leading-relaxed">
                    <strong className="text-slate-800">Clinical notes:</strong> {req.clinicalNotes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Send Offer Modal */}
      <Modal
        isOpen={!!selectedReqForOffer}
        onClose={() => setSelectedReqForOffer(null)}
        title="Send Blood Allocation Offer"
        subtitle={`Respond to ${selectedReqForOffer?.requestingHospitalName} for ${selectedReqForOffer?.bloodGroup} ${selectedReqForOffer?.component}`}
      >
        <form onSubmit={handleSendOfferSubmit} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Required: {selectedReqForOffer?.requiredUnits} Units ({selectedReqForOffer?.bloodGroup} {selectedReqForOffer?.component})
              </span>
              <StatusBadge status={selectedReqForOffer?.urgency} />
            </div>
            <p className="text-[11px] text-emerald-800 mt-1">
              Recipient: {selectedReqForOffer?.requestingHospitalName} ({selectedReqForOffer?.requestingHospitalCity})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Units to Offer</label>
              <input
                type="number"
                min="1"
                max={selectedReqForOffer?.requiredUnits || 4}
                required
                value={offerUnits}
                onChange={(e) => setOfferUnits(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Est. Transit (Minutes)</label>
              <input
                type="number"
                min="5"
                required
                value={transitMins}
                onChange={(e) => setTransitMins(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Coordination Notes</label>
            <textarea
              rows={2}
              value={offerNotes}
              onChange={(e) => setOfferNotes(e.target.value)}
              placeholder="e.g. Cold-carrier packed at 4°C, ready for emergency dispatch..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedReqForOffer(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              Confirm & Transmit Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
