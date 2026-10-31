import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  acceptOffer,
  rejectOffer,
  updateRequestStatus,
  acceptOfferApi,
  fetchEmergencyRequests,
} from '../../store/slices/emergencySlice';
import { reserveStock } from '../../store/slices/inventorySlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { StatusBadge } from '../../components/common/Badge';
import {
  HeartHandshake,
  ArrowLeft,
  Building2,
  Clock,
  Droplet,
  CheckCircle2,
  XCircle,
  Truck,
  ShieldCheck,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { requests } = useAppSelector((state) => state.emergency);
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  // If id is provided, find it; otherwise take the first request
  const currentRequest = id ? requests.find((r) => r.id === id) || requests[0] : requests[0];

  if (!currentRequest) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <h3 className="font-bold text-slate-900">No Request Selected</h3>
        <button
          onClick={() => navigate('/coordinator/overview')}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Overview
        </button>
      </div>
    );
  }

  const handleAcceptOffer = (offerId: string) => {
    const offer = currentRequest.offers.find((o) => o.id === offerId);
    if (!offer) return;

    dispatch(acceptOffer({ requestId: currentRequest.id, offerId }));
    dispatch(
      acceptOfferApi({
        offerId,
        requestingHospitalId: currentUser?.hospitalId || 'hosp-3',
      })
    );

    // Lock inventory reservation
    dispatch(
      reserveStock({
        hospitalId: offer.hospitalId,
        bloodGroup: offer.offeredBloodGroup,
        component: offer.offeredComponent,
        units: offer.offeredUnits,
      })
    );

    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'usr-ec-1',
        userName: currentUser?.name || 'Dr. Neha Desai',
        userRole: 'EMERGENCY_COORDINATOR',
        action: 'ACCEPT_OFFER',
        targetResource: currentRequest.requestId,
        details: `Accepted allocation of ${offer.offeredUnits} Units from ${offer.hospitalName}`,
        ipAddress: '103.21.144.12',
      })
    );

    dispatch(
      addNotification({
        title: 'Offer Accepted & Units Reserved',
        message: `${offer.offeredUnits} Units from ${offer.hospitalName} are now reserved exclusively for ${currentRequest.requestId}.`,
        type: 'SUCCESS',
        requestId: currentRequest.id,
      })
    );
  };

  const handleRejectOffer = (offerId: string) => {
    dispatch(rejectOffer({ requestId: currentRequest.id, offerId }));
  };

  const percentAllocated = Math.round((currentRequest.allocatedUnits / currentRequest.requiredUnits) * 100);

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div>
        <button
          onClick={() => navigate('/coordinator/overview')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Emergency Overview</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Request Coordination: {currentRequest.requestId}
              </h1>
              <StatusBadge status={currentRequest.urgency} />
              <StatusBadge status={currentRequest.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Raised by {currentRequest.requestingHospitalName} • Required: {currentRequest.requiredByTime}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/coordinator/transfers')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Track Transfer & OTP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Status & Multi-Source Allocation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 font-black text-base flex items-center justify-center border border-rose-200">
              {currentRequest.bloodGroup}
            </span>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group & Type</span>
              <p className="font-extrabold text-sm text-slate-900">{currentRequest.component}</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Requirement Target</span>
            <p className="font-black text-sm text-slate-900">{currentRequest.requiredUnits} Units</p>
            <p className="text-[11px] text-slate-500">Total clinical demand</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Allocated from Network</span>
            <p className="font-black text-sm text-emerald-700">{currentRequest.allocatedUnits} Units Reserved</p>
            <p className="text-[11px] text-slate-500">
              {currentRequest.requiredUnits - currentRequest.allocatedUnits} units remaining
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Time Window</span>
            <p className="font-bold text-sm text-rose-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentRequest.requiredByTime}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">Ref: {currentRequest.patientReferenceId}</p>
          </div>
        </div>

        {/* Multi-hospital Partial Allocation Visual Bar */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-800">Multi-Hospital Fulfillment Progress</span>
            <span className="font-bold text-emerald-700">{percentAllocated}% Fulfilled</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                percentAllocated >= 100
                  ? 'bg-emerald-500'
                  : percentAllocated > 0
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${percentAllocated}%` }}
            />
          </div>
        </div>

        {currentRequest.clinicalNotes && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Clinical notes:</strong> {currentRequest.clinicalNotes}
          </div>
        )}
      </div>

      {/* Offers Evaluation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Participating Hospital Offers</h2>
            <p className="text-xs text-slate-500">
              Compare transit distance, delivery estimates, and units offered by blood banks
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {currentRequest.offers.length} Offers Received
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {currentRequest.offers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Broadcasting to regional centres... Awaiting incoming hospital offers.
            </div>
          ) : (
            currentRequest.offers.map((offer) => (
              <div key={offer.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{offer.hospitalName}</h3>
                        <StatusBadge status={offer.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {offer.hospitalCity} ({offer.distanceKm} km away)
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <Clock className="w-3.5 h-3.5" />
                          Est. Transit: {offer.estimatedTransitMinutes} mins
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 block">
                        {offer.offeredUnits} Units
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        by {offer.offeredByOfficerName}
                      </span>
                    </div>

                    {offer.status === 'PENDING' && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Reserve</span>
                        </button>
                        <button
                          onClick={() => handleRejectOffer(offer.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {offer.status === 'ACCEPTED' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Allocated & Reserved
                      </span>
                    )}
                  </div>
                </div>

                {offer.notes && (
                  <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">Notes from officer:</strong> {offer.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
