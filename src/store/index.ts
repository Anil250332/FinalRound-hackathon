import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inventoryReducer from './slices/inventorySlice';
import emergencyReducer from './slices/emergencySlice';
import transferReducer from './slices/transferSlice';
import hospitalReducer from './slices/hospitalSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    emergency: emergencyReducer,
    transfer: transferReducer,
    hospitals: hospitalReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
