import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import { UserRole } from '../../types';
import {
  Bell,
  LogOut,
  Hospital,
  Droplet,
  ShieldCheck,
  Menu,
  Activity,
  Building2,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, activeRole } = useAppSelector((state) => state.auth);
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic Hospital Name
  const assignedHospital = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const currentHospitalName =
    currentUser?.hospitalName ||
    assignedHospital?.name ||
    (activeRole === 'SUPER_ADMIN' ? 'National Blood Grid' : 'Medical Centre');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/super-admin/inventory')) return 'Hospital Inventory Inspector';
    if (path.includes('/super-admin/emergency-requests')) return 'Emergency Requests & Connections';
    if (path.includes('/super-admin/hospitals')) return 'Hospital Directory & Verification';
    if (path.includes('/super-admin/profile')) return 'Admin Profile Settings';
    if (path.includes('/super-admin/overview')) return 'Admin Dashboard';

    if (path.includes('/hospital-admin/users') || path.includes('/hospital-admin/staff')) return 'Hospital User Management';
    if (path.includes('/hospital-admin/inventory')) return 'Hospital Blood Stock Ledger';
    if (path.includes('/hospital-admin/emergency-requests')) return 'Emergency Requests & Responses';
    if (path.includes('/hospital-admin/profile')) return 'Hospital Profile';
    if (path.includes('/hospital-admin/overview')) return 'Hospital Operational Overview';

    if (path.includes('/blood-bank/inventory')) return 'Blood Bank Inventory';
    if (path.includes('/blood-bank/network-requests') || path.includes('/blood-bank/incoming-requests')) return 'Network Emergency Alerts (Accept Request)';
    if (path.includes('/blood-bank/my-requests') || path.includes('/blood-bank/create-request')) return 'Create Request & Inter-Hospital Connections';
    if (path.includes('/blood-bank/overview')) return 'Blood Bank Officer Dashboard';

    return 'Dashboard';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'HOSPITAL_ADMIN':
        return { label: 'Hospital Head', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'BLOOD_BANK_OFFICER':
        return { label: 'Blood Officer', bg: 'bg-teal-100 text-teal-800 border-teal-200' };
      default:
        return { label: 'Medical Staff', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roleBadge = getRoleBadge(activeRole || currentUser?.role);

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sm:px-8 z-20 sticky top-0 shadow-2xs">
      {/* Left: Mobile hamburger + Dynamic Page Title */}
      <div className="flex items-center space-x-4 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight truncate">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate">
            {activeRole === 'SUPER_ADMIN'
              ? 'National Central Blood Grid Management'
              : `${currentHospitalName} • Emergency Coordination Node`}
          </p>
        </div>
      </div>

      {/* Right: Dynamic Hospital / Node Indicator + Notifications + User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        {/* Dynamic Connected Node Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {activeRole === 'SUPER_ADMIN' ? (
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Grid Hub</span>
            </span>
          ) : (
            <span className="font-semibold text-slate-700 flex items-center gap-1.5 truncate max-w-[200px]">
              <Building2 className="w-3.5 h-3.5 text-[#0d9488]" />
              <span className="truncate">{currentHospitalName}</span>
            </span>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2.5 rounded-full text-slate-500 hover:text-emerald-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => dispatch(markAsRead(notif.id))}
                      className="p-3 text-xs hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      <p className="font-bold text-slate-900">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 pl-2 pr-1.5 py-1 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all cursor-pointer"
          >
            <div className="hidden sm:block text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="text-xs font-bold text-slate-900">{currentUser?.name || 'Authorized User'}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${roleBadge.bg}`}>
                  {roleBadge.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                {currentUser?.email || 'user@pulserelay.org'}
              </p>
            </div>

            {/* Circle Avatar with Initials */}
            <div className="w-10 h-10 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/20">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'PR'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-xs text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Facility:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[130px]">{currentHospitalName}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Role:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${roleBadge.bg}`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
