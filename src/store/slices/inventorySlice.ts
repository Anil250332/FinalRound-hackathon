import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '../../types';
import { INITIAL_INVENTORY } from '../../services/mockData';

interface InventoryState {
  items: BloodInventoryItem[];
  selectedBloodGroupFilter: BloodGroup | 'ALL';
  selectedComponentFilter: BloodComponent | 'ALL';
  searchQuery: string;
}

const initialState: InventoryState = {
  items: INITIAL_INVENTORY,
  selectedBloodGroupFilter: 'ALL',
  selectedComponentFilter: 'ALL',
  searchQuery: '',
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addOrUpdateStock: (state, action: PayloadAction<Omit<BloodInventoryItem, 'id' | 'lastUpdated' | 'reservedUnits' | 'totalUnits'>>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.hospitalId === action.payload.hospitalId &&
          item.bloodGroup === action.payload.bloodGroup &&
          item.component === action.payload.component
      );

      if (existingIndex >= 0) {
        const item = state.items[existingIndex];
        item.availableUnits = action.payload.availableUnits;
        item.totalUnits = item.availableUnits + item.reservedUnits;
        item.expiryDate = action.payload.expiryDate;
        item.storageTemp = action.payload.storageTemp;
        item.lastUpdated = 'Just now';
      } else {
        const newItem: BloodInventoryItem = {
          id: `inv-${Date.now()}`,
          ...action.payload,
          reservedUnits: 0,
          totalUnits: action.payload.availableUnits,
          lastUpdated: 'Just now',
        };
        state.items.unshift(newItem);
      }
    },
    reserveStock: (
      state,
      action: PayloadAction<{ hospitalId: string; bloodGroup: BloodGroup; component: BloodComponent; units: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.hospitalId === action.payload.hospitalId &&
          i.bloodGroup === action.payload.bloodGroup &&
          i.component === action.payload.component
      );
      if (item && item.availableUnits >= action.payload.units) {
        item.availableUnits -= action.payload.units;
        item.reservedUnits += action.payload.units;
        item.lastUpdated = 'Just now (Reserved)';
      }
    },
    releaseStock: (
      state,
      action: PayloadAction<{ hospitalId: string; bloodGroup: BloodGroup; component: BloodComponent; units: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.hospitalId === action.payload.hospitalId &&
          i.bloodGroup === action.payload.bloodGroup &&
          i.component === action.payload.component
      );
      if (item) {
        item.reservedUnits = Math.max(0, item.reservedUnits - action.payload.units);
        item.availableUnits += action.payload.units;
        item.lastUpdated = 'Just now (Stock Released)';
      }
    },
    setBloodGroupFilter: (state, action: PayloadAction<BloodGroup | 'ALL'>) => {
      state.selectedBloodGroupFilter = action.payload;
    },
    setComponentFilter: (state, action: PayloadAction<BloodComponent | 'ALL'>) => {
      state.selectedComponentFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addOrUpdateStock,
  reserveStock,
  releaseStock,
  setBloodGroupFilter,
  setComponentFilter,
  setSearchQuery,
} = inventorySlice.actions;

export default inventorySlice.reducer;
