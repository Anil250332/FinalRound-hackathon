import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transfer, TransferStatus } from '../../types';
import { INITIAL_TRANSFERS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface TransferState {
  transfers: Transfer[];
  selectedTransfer: Transfer | null;
  otpError: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransferState = {
  transfers: INITIAL_TRANSFERS,
  selectedTransfer: INITIAL_TRANSFERS[0] || null,
  otpError: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchHospitalTransfers = createAsyncThunk(
  'transfer/fetchHospitalTransfers',
  async (hospitalId: string, { rejectWithValue }) => {
    try {
      const list = await apiService.getHospitalTransfers(hospitalId);
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch transfers');
    }
  }
);

export const initiateDispatchApi = createAsyncThunk(
  'transfer/initiateDispatchApi',
  async (
    { transferId, driverContact, vehicleNumber }: { transferId: string; driverContact?: string; vehicleNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const transfer = await apiService.initiateDispatch(transferId, driverContact, vehicleNumber);
      return transfer;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to initiate dispatch');
    }
  }
);

export const verifyHandoverOtpApi = createAsyncThunk(
  'transfer/verifyHandoverOtpApi',
  async ({ transferId, otp }: { transferId: string; otp: string }, { rejectWithValue }) => {
    try {
      const transfer = await apiService.verifyHandoverOtp(transferId, otp);
      return transfer;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Invalid OTP code');
    }
  }
);

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
          state.otpError = 'Invalid OTP code! Please verify the code provided to the receiving coordinator.';
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
  extraReducers: (builder) => {
    // Fetch transfers
    builder.addCase(fetchHospitalTransfers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHospitalTransfers.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload && action.payload.length > 0) {
        state.transfers = action.payload;
        if (!state.selectedTransfer || !action.payload.some((t) => t.id === state.selectedTransfer?.id)) {
          state.selectedTransfer = action.payload[0] || null;
        }
      }
    });
    builder.addCase(fetchHospitalTransfers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Initiate dispatch
    builder.addCase(initiateDispatchApi.fulfilled, (state, action) => {
      const idx = state.transfers.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.transfers[idx] = action.payload;
      }
      if (state.selectedTransfer?.id === action.payload.id) {
        state.selectedTransfer = action.payload;
      }
    });

    // Verify OTP
    builder.addCase(verifyHandoverOtpApi.fulfilled, (state, action) => {
      const idx = state.transfers.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) {
        state.transfers[idx] = action.payload;
      }
      if (state.selectedTransfer?.id === action.payload.id) {
        state.selectedTransfer = action.payload;
      }
      state.otpError = null;
    });
    builder.addCase(verifyHandoverOtpApi.rejected, (state, action) => {
      state.otpError = (action.payload as string) || 'Invalid OTP code';
    });
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
