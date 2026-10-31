import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transfer, TransferStatus } from '../../types';
import { INITIAL_TRANSFERS } from '../../services/mockData';

interface TransferState {
  transfers: Transfer[];
  selectedTransfer: Transfer | null;
  otpError: string | null;
}

const initialState: TransferState = {
  transfers: INITIAL_TRANSFERS,
  selectedTransfer: INITIAL_TRANSFERS[0] || null,
  otpError: null,
};

export const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    initiateTransfer: (
      state,
      action: PayloadAction<Omit<Transfer, 'id' | 'transferId' | 'status' | 'handoverOtp' | 'isOtpVerified' | 'timeline'>>
    ) => {
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const randomNum = Math.floor(100 + Math.random() * 900);
      const newTransfer: Transfer = {
        id: `trf-${Date.now()}`,
        transferId: `TRF-PR-2026-${randomNum}`,
        ...action.payload,
        status: 'DISPATCH_INITIATED',
        handoverOtp: randomOtp,
        isOtpVerified: false,
        timeline: [
          {
            title: 'Transfer Dispatched',
            description: `Dispatched from ${action.payload.supplyingHospitalName}`,
            time: 'Just now',
            completed: true,
          },
          {
            title: 'Cold-Chain Transit Active',
            description: 'Sensors recording temperature within target range',
            time: 'In progress',
            completed: false,
          },
          {
            title: 'Handover & OTP Verification',
            description: 'Secure handover verification upon arrival',
            time: 'Pending Handover',
            completed: false,
          },
        ],
      };
      state.transfers.unshift(newTransfer);
      state.selectedTransfer = newTransfer;
    },
    updateTransferStatus: (
      state,
      action: PayloadAction<{ transferId: string; status: TransferStatus }>
    ) => {
      const transfer = state.transfers.find((t) => t.id === action.payload.transferId);
      if (transfer) {
        transfer.status = action.payload.status;
        if (state.selectedTransfer?.id === transfer.id) {
          state.selectedTransfer = { ...transfer };
        }
      }
    },
    verifyHandoverOtp: (
      state,
      action: PayloadAction<{ transferId: string; enteredOtp: string }>
    ) => {
      const transfer = state.transfers.find((t) => t.id === action.payload.transferId);
      if (transfer) {
        if (transfer.handoverOtp === action.payload.enteredOtp.trim()) {
          transfer.isOtpVerified = true;
          transfer.status = 'HANDOVER_COMPLETED';
          transfer.completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          transfer.timeline.forEach((step) => {
            step.completed = true;
          });
          state.otpError = null;
          if (state.selectedTransfer?.id === transfer.id) {
            state.selectedTransfer = { ...transfer };
          }
        } else {
          state.otpError = 'Invalid OTP code! Please verify the 4-digit code provided to the receiving coordinator.';
        }
      }
    },
    clearOtpError: (state) => {
      state.otpError = null;
    },
    setSelectedTransfer: (state, action: PayloadAction<string>) => {
      const t = state.transfers.find((item) => item.id === action.payload);
      if (t) {
        state.selectedTransfer = t;
      }
    },
  },
});

export const {
  initiateTransfer,
  updateTransferStatus,
  verifyHandoverOtp,
  clearOtpError,
  setSelectedTransfer,
} = transferSlice.actions;

export default transferSlice.reducer;
