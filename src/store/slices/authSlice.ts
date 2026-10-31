import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../services/mockData';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  serverAwake: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = DEMO_USERS.superAdmin;

const initialState: AuthState = {
  currentUser: initialUser,
  token: 'mock-jwt-token-pulserelay-2026',
  isAuthenticated: true,
  activeRole: initialUser.role,
  serverAwake: true,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.activeRole = action.payload;
      if (action.payload === 'SUPER_ADMIN') {
        state.currentUser = DEMO_USERS.superAdmin;
      } else if (action.payload === 'HOSPITAL_ADMIN') {
        state.currentUser = DEMO_USERS.hospitalAdmin;
      } else if (action.payload === 'BLOOD_BANK_OFFICER') {
        state.currentUser = DEMO_USERS.bloodBankOfficer;
      } else if (action.payload === 'EMERGENCY_COORDINATOR') {
        state.currentUser = DEMO_USERS.emergencyCoordinator;
      }
      state.isAuthenticated = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.activeRole = action.payload.user.role;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setServerAwake: (state, action: PayloadAction<boolean>) => {
      state.serverAwake = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRole, loginSuccess, logout, setServerAwake, setError } = authSlice.actions;
export default authSlice.reducer;
