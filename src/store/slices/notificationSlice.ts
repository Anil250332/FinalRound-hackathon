import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification, AuditLog } from '../../types';
import { INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface NotificationState {
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  unreadCount: number;
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
  isLoading: false,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const list = await apiService.getNotifications();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'notifications/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const list = await apiService.getAuditLogs();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch audit logs');
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<AppNotification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        ...action.payload,
        timestamp: 'Just now',
        read: false,
      };
      state.notifications.unshift(newNotif);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) => {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newLog: AuditLog = {
        id: `aud-${Date.now()}`,
        ...action.payload,
        timestamp,
      };
      state.auditLogs.unshift(newLog);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      }
    });

    builder.addCase(fetchAuditLogs.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.auditLogs = action.payload;
      }
    });
  },
});

export const { addNotification, markAsRead, markAllAsRead, addAuditLog } = notificationSlice.actions;

export default notificationSlice.reducer;
