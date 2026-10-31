import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { releaseStock } from '../../store/slices/inventorySlice';
import { initiateTransfer, initiateDispatchApi, fetchHospitalTransfers } from '../../store/slices/transferSlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  BookmarkCheck,
  Truck,
  RotateCcw,
  Building2,
  Clock,
  Droplet,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OffersReservationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.emergency);
  const { items } = useAppSelector((state) => state.inventory);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const hospitalId =
    currentUser?.hospitalId && currentUser.hospitalId.length === 24
      ? currentUser.hospitalId
      : hospitals[0]?.id || '6ae5bfa3a41657de36e25a1e';
  const hospitalName = currentUser?.hospitalName || hospitals[0]?.name || 'Apollo Demo Blood Centre';

  const [dispatchModalOffer, setDispatchModalOffer] = useState<{
    reqId: string;
    offerId: string;
    receivingHospitalName: string;
    receivingHospitalId: string;
    bloodGroup: any;
    component: any;
    units: number;
  } | null>(null);

  const [courierName, setCourierName] = useState('Ramesh Kumar (MedExpress Logistics)');
  const [courierContact, setCourierContact] = useState('+91 99112 33445');
  const [vehicleNumber, setVehicleNumber] = useState('DL 1Z AA 8892');

  // Extract all offers made by this blood bank across requests
  const myOffers = requests.flatMap((req) =>
    req.offers
      .filter((o) => o.hospitalId === hospitalId)
      .map((offer) => ({
        ...offer,
        requestObj: req,
      }))
  );

  const handleReleaseStock = (reqId: string, bg: any, comp: any, units: number) => {
    dispatch(
      releaseStock({
        hospitalId,
        bloodGroup: bg,
        component: comp,
        units,
      })
    );
    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'usr-bbo-1',
        userName: currentUser?.name || 'Blood Bank Officer',
        userRole: 'BLOOD_BANK_OFFICER',
        action: 'RELEASE_RESERVATION',
        targetResource: reqId,
        details: `Released ${units} reserved units of ${bg} ${comp} back into active stock`,
        ipAddress: '14.139.60.2',
      })
    );
    alert(`Successfully released ${units} units back to available inventory.`);
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOffer) return;

    if (dispatchModalOffer.offerId && dispatchModalOffer.offerId.length === 24) {
      await dispatch(
        initiateDispatchApi({
          transferId: dispatchModalOffer.offerId,
          driverContact: courierContact,
          vehicleNumber,
        })
      );
      dispatch(fetchHospitalTransfers(hospitalId));
    }

    dispatch(
      initiateTransfer({
        requestId: dispatchModalOffer.reqId,
        supplyingHospitalId: hospitalId,
        supplyingHospitalName: hospitalName,
        receivingHospitalId: dispatchModalOffer.receivingHospitalId,
        receivingHospitalName: dispatchModalOffer.receivingHospitalName,
        bloodGroup: dispatchModalOffer.bloodGroup,
        component: dispatchModalOffer.component,
        units: dispatchModalOffer.units,
        coldChainTempCelsius: 4.1,
        courierName,
        courierContact,
        vehicleNumber,
      })
    );

    dispatch(
      addNotification({
        title: 'Dispatch Confirmed — Cold Chain En Route',
        message: `${dispatchModalOffer.units} Units dispatched to ${dispatchModalOffer.receivingHospitalName}. Live OTP verification active.`,
        type: 'INFO',
        requestId: dispatchModalOffer.reqId,
      })
    );

    setDispatchModalOffer(null);
    navigate('/coordinator/transfers');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Offers & Inventory Reservations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor submitted blood offers, verify accepted reservations, and trigger temperature-controlled dispatches
        </p>
      </div>

      {/* Offers & Reservations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Hospital Offer Portfolio</h2>
            <p className="text-xs text-slate-500">Live ledger of active commitments and reservations</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {myOffers.length} Recorded Offers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Emergency Request</th>
                <th className="py-3.5 px-4">Recipient Hospital</th>
                <th className="py-3.5 px-4">Offered Units</th>
                <th className="py-3.5 px-4">Est. Transit</th>
                <th className="py-3.5 px-4">Offer Status</th>
                <th className="py-3.5 px-4">Inventory Lock</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {myOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-slate-900">{offer.requestObj.requestId}</span>
                    <span className="text-[11px] text-slate-500 block">{offer.offeredAt}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{offer.requestObj.requestingHospitalName}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {offer.requestObj.requestingHospitalCity}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-black text-slate-900 text-sm">{offer.offeredUnits} Units</span>{' '}
                    <span className="text-slate-500 font-semibold">({offer.offeredBloodGroup} {offer.offeredComponent})</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {offer.estimatedTransitMinutes} mins
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={offer.status} />
                  </td>

                  <td className="py-3.5 px-4">
                    {offer.status === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {offer.offeredUnits} Units Reserved
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending Acceptance</span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {offer.status === 'ACCEPTED' && (
                        <>
                          <button
                            onClick={() =>
                              setDispatchModalOffer({
                                reqId: offer.requestObj.id,
                                offerId: offer.id,
                                receivingHospitalName: offer.requestObj.requestingHospitalName,
                                receivingHospitalId: offer.requestObj.requestingHospitalId,
                                bloodGroup: offer.offeredBloodGroup,
                                component: offer.offeredComponent,
                                units: offer.offeredUnits,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch</span>
                          </button>
                          <button
                            onClick={() =>
                              handleReleaseStock(
                                offer.requestObj.id,
                                offer.offeredBloodGroup,
                                offer.offeredComponent,
                                offer.offeredUnits
                              )
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 font-medium text-xs transition-colors"
                            title="Release units if cancelled"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal
        isOpen={!!dispatchModalOffer}
        onClose={() => setDispatchModalOffer(null)}
        title="Initiate Cold-Chain Blood Transfer"
        subtitle={`Dispatching ${dispatchModalOffer?.units} Units of ${dispatchModalOffer?.bloodGroup} ${dispatchModalOffer?.component} to ${dispatchModalOffer?.receivingHospitalName}`}
      >
        <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="font-bold text-emerald-900">Cold-Chain Protocol Requirement:</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Target storage temp 2°C – 6°C with continuous IoT sensor logging and encrypted OTP handover on arrival.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Medical Courier Service</label>
            <input
              type="text"
              required
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Driver Phone Number</label>
              <input
                type="text"
                required
                value={courierContact}
                onChange={(e) => setCourierContact(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Transport Vehicle Number</label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono uppercase"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setDispatchModalOffer(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              Confirm Dispatch & Generate Handover OTP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
