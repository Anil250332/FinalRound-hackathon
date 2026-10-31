import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification, AuditLog } from '../../types';
import { INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../../services/mockData';

interface NotificationState {
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_AUDIT_LOGS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
};

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
});

export const { addNotification, markAsRead, markAllAsRead, addAuditLog } = notificationSlice.actions;

export default notificationSlice.reducer;
