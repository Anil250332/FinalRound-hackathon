import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hospital } from '../../types';
import { INITIAL_HOSPITALS } from '../../services/mockData';

interface HospitalState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  filterType: 'ALL' | 'GOVERNMENT' | 'PRIVATE' | 'CHARITABLE';
  searchQuery: string;
}

const initialState: HospitalState = {
  hospitals: INITIAL_HOSPITALS,
  selectedHospital: INITIAL_HOSPITALS[0] || null,
  filterType: 'ALL',
  searchQuery: '',
};

export const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    addHospital: (state, action: PayloadAction<Omit<Hospital, 'id' | 'createdAt' | 'lastActive'>>) => {
      const newHospital: Hospital = {
        id: `hosp-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        lastActive: 'Just now',
      };
      state.hospitals.unshift(newHospital);
    },
    verifyHospital: (state, action: PayloadAction<string>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload);
      if (hospital) {
        hospital.verified = true;
        hospital.status = 'VERIFIED';
        hospital.lastActive = 'Just now';
      }
    },
    suspendHospital: (state, action: PayloadAction<string>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload);
      if (hospital) {
        hospital.status = 'SUSPENDED';
        hospital.lastActive = 'Just now';
      }
    },
    updateHospitalProfile: (state, action: PayloadAction<{ id: string; changes: Partial<Hospital> }>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload.id);
      if (hospital) {
        Object.assign(hospital, action.payload.changes);
        hospital.lastActive = 'Just now';
      }
    },
    setFilterType: (state, action: PayloadAction<'ALL' | 'GOVERNMENT' | 'PRIVATE' | 'CHARITABLE'>) => {
      state.filterType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedHospital: (state, action: PayloadAction<string>) => {
      const h = state.hospitals.find((item) => item.id === action.payload);
      if (h) {
        state.selectedHospital = h;
      }
    },
  },
});

export const {
  addHospital,
  verifyHospital,
  suspendHospital,
  updateHospitalProfile,
  setFilterType,
  setSearchQuery,
  setSelectedHospital,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
