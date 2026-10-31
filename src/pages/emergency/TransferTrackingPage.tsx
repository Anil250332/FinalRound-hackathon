import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  verifyHandoverOtp,
  clearOtpError,
  setSelectedTransfer,
  fetchHospitalTransfers,
  verifyHandoverOtpApi,
} from '../../store/slices/transferSlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard, Skeleton } from '../../components/common/Skeleton';
import { Transfer } from '../../types';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  KeyRound,
  Thermometer,
  Phone,
  AlertTriangle,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const TransferTrackingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transfers, otpError, isLoading } = useAppSelector((state) => state.transfer);
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser?.hospitalId) {
      dispatch(fetchHospitalTransfers(currentUser.hospitalId));
    }
  }, [dispatch, currentUser?.hospitalId]);

  const [otpModalTransfer, setOtpModalTransfer] = useState<Transfer | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleOpenOtpModal = (trf: Transfer) => {
    setOtpModalTransfer(trf);
    setEnteredOtp('');
    dispatch(clearOtpError());
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpModalTransfer) return;

    if (enteredOtp.trim() === otpModalTransfer.handoverOtp) {
      dispatch(
        verifyHandoverOtp({
          transferId: otpModalTransfer.id,
          enteredOtp,
        })
      );

      dispatch(
        verifyHandoverOtpApi({
          transferId: otpModalTransfer.id,
          otp: enteredOtp,
        })
      );

      dispatch(
        addAuditLog({
          userId: currentUser?.id || 'usr-ec-1',
          userName: currentUser?.name || 'Emergency Coordinator',
          userRole: 'EMERGENCY_COORDINATOR',
          action: 'VERIFY_OTP_HANDOVER',
          targetResource: otpModalTransfer.transferId,
          details: `Verified cold-chain blood handover with secure OTP ${enteredOtp}`,
          ipAddress: '103.21.144.12',
        })
      );

      dispatch(
        addNotification({
          title: 'Handover Completed & Verified',
          message: `Transfer ${otpModalTransfer.transferId} successfully verified with OTP. Units transferred to local clinical storage.`,
          type: 'SUCCESS',
        })
      );

      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
        setOtpModalTransfer(null);
      }, 1500);
    } else {
      dispatch(
        verifyHandoverOtp({
          transferId: otpModalTransfer.id,
          enteredOtp,
        })
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transfer Logistics & OTP Handover</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            COLD-CHAIN IOT
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Real-time cold-chain telemetry, vehicle dispatch tracking, and secure 4-digit OTP handover verification
        </p>
      </div>

      {/* Transfers Cards */}
      <div className="space-y-6">
        {transfers.map((trf) => (
          <div
            key={trf.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden"
          >
            {/* Header of Transfer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{trf.transferId}</span>
                    <StatusBadge status={trf.status} />
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {trf.units} Units of {trf.bloodGroup} {trf.component}
                  </p>
                </div>
              </div>

              {/* Courier & Telemetry */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Cold-Chain Temp</span>
                  <span className="font-mono font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Thermometer className="w-3.5 h-3.5" />
                    {trf.coldChainTempCelsius}°C (Target: 2°C – 6°C)
                  </span>
                </div>

                {!trf.isOtpVerified ? (
                  <button
                    onClick={() => handleOpenOtpModal(trf)}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5 animate-bounce"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Verify Handover OTP</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Handover Verified (OTP {trf.handoverOtp})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logistics Route Information */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Supplying Blood Bank</span>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {trf.supplyingHospitalName}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Receiving Emergency Facility</span>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {trf.receivingHospitalName}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Courier & Medical Vehicle</span>
                <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  {trf.vehicleNumber} ({trf.courierName})
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{trf.courierContact}</p>
              </div>
            </div>

            {/* Step-by-Step Delivery Milestone Timeline */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 mb-4">Transfer Lifecycle Milestones</h3>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trf.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 text-xs">
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {step.completed && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{step.time}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OTP Verification Modal */}
      <Modal
        isOpen={!!otpModalTransfer}
        onClose={() => setOtpModalTransfer(null)}
        title="Verify Blood Handover with Secure OTP"
        subtitle={`Supplying shipment ${otpModalTransfer?.transferId} for ${otpModalTransfer?.units} units of ${otpModalTransfer?.bloodGroup}`}
      >
        {successAnimation ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">OTP Verified Successfully!</h3>
            <p className="text-xs text-slate-600">
              Handover logged cryptographically. Units successfully checked into emergency receiving bank.
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
            {/* Hackathon Demo Helper Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700">
                Demo Verification Code
              </span>
              <p className="mt-1 font-mono font-extrabold text-base text-emerald-800">
                Expected OTP: <span className="underline decoration-emerald-500">{otpModalTransfer?.handoverOtp}</span>
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                In production, this OTP is sent via SMS to the authorized receiving nurse or blood officer.
              </p>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter 4-Digit Handover OTP
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="e.g. 7492"
                className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOtpModalTransfer(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Complete Handover</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
