import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyRequest, Offer, RequestStatus } from '../../types';
import { INITIAL_REQUESTS } from '../../services/mockData';

interface EmergencyState {
  requests: EmergencyRequest[];
  selectedRequest: EmergencyRequest | null;
  filterStatus: RequestStatus | 'ALL';
  filterUrgency: 'ALL' | 'CRITICAL' | 'URGENT' | 'NORMAL';
  isBroadcasting: boolean;
}

const initialState: EmergencyState = {
  requests: INITIAL_REQUESTS,
  selectedRequest: INITIAL_REQUESTS[0] || null,
  filterStatus: 'ALL',
  filterUrgency: 'ALL',
  isBroadcasting: false,
};

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    createRequest: (state, action: PayloadAction<Omit<EmergencyRequest, 'id' | 'requestId' | 'allocatedUnits' | 'status' | 'offers' | 'createdAt' | 'updatedAt'>>) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newReq: EmergencyRequest = {
        id: `req-${Date.now()}`,
        requestId: `PR-EMG-${randomNum}`,
        ...action.payload,
        allocatedUnits: 0,
        status: 'SEARCHING',
        offers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.requests.unshift(newReq);
      state.selectedRequest = newReq;
    },
    submitOffer: (state, action: PayloadAction<{ requestId: string; offer: Omit<Offer, 'id' | 'offeredAt' | 'status'> }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const newOffer: Offer = {
          id: `off-${Date.now()}`,
          ...action.payload.offer,
          status: 'PENDING',
          offeredAt: 'Just now',
        };
        request.offers.push(newOffer);
        if (request.status === 'SEARCHING') {
          request.status = 'OFFERS_RECEIVED';
        }
        request.updatedAt = new Date().toISOString();
        if (state.selectedRequest?.id === request.id) {
          state.selectedRequest = { ...request };
        }
      }
    },
    acceptOffer: (state, action: PayloadAction<{ requestId: string; offerId: string }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const offer = request.offers.find((o) => o.id === action.payload.offerId);
        if (offer && offer.status !== 'ACCEPTED') {
          offer.status = 'ACCEPTED';
          request.allocatedUnits = Math.min(request.requiredUnits, request.allocatedUnits + offer.offeredUnits);
          if (request.allocatedUnits >= request.requiredUnits) {
            request.status = 'FULLY_ALLOCATED';
          } else {
            request.status = 'PARTIALLY_ALLOCATED';
          }
          request.updatedAt = new Date().toISOString();
          if (state.selectedRequest?.id === request.id) {
            state.selectedRequest = { ...request };
          }
        }
      }
    },
    rejectOffer: (state, action: PayloadAction<{ requestId: string; offerId: string }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const offer = request.offers.find((o) => o.id === action.payload.offerId);
        if (offer) {
          offer.status = 'REJECTED';
          request.updatedAt = new Date().toISOString();
          if (state.selectedRequest?.id === request.id) {
            state.selectedRequest = { ...request };
          }
        }
      }
    },
    updateRequestStatus: (state, action: PayloadAction<{ requestId: string; status: RequestStatus }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        request.status = action.payload.status;
        request.updatedAt = new Date().toISOString();
        if (state.selectedRequest?.id === request.id) {
          state.selectedRequest = { ...request };
        }
      }
    },
    setSelectedRequest: (state, action: PayloadAction<string>) => {
      const req = state.requests.find((r) => r.id === action.payload);
      if (req) {
        state.selectedRequest = req;
      }
    },
    setFilterStatus: (state, action: PayloadAction<RequestStatus | 'ALL'>) => {
      state.filterStatus = action.payload;
    },
    setFilterUrgency: (state, action: PayloadAction<'ALL' | 'CRITICAL' | 'URGENT' | 'NORMAL'>) => {
      state.filterUrgency = action.payload;
    },
  },
});

export const {
  createRequest,
  submitOffer,
  acceptOffer,
  rejectOffer,
  updateRequestStatus,
  setSelectedRequest,
  setFilterStatus,
  setFilterUrgency,
} = emergencySlice.actions;

export default emergencySlice.reducer;
