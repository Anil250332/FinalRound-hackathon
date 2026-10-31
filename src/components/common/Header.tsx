import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setRole, logout } from '../../store/slices/authSlice';
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import { UserRole } from '../../types';
import {
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Hospital,
  Droplet,
  Radio,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, activeRole } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roles: { role: UserRole; label: string; icon: any; route: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldCheck, route: '/super-admin/overview' },
    { role: 'HOSPITAL_ADMIN', label: 'Hospital Admin', icon: Hospital, route: '/hospital-admin/overview' },
    { role: 'BLOOD_BANK_OFFICER', label: 'Blood Bank Officer', icon: Droplet, route: '/blood-bank/overview' },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/blood-bank/inventory')) return 'Blood Inventory';
    if (path.includes('/blood-bank/incoming-requests')) return 'Incoming Emergency Requests';
    if (path.includes('/blood-bank/offers-reservations')) return 'Offers & Unit Reservations';
    if (path.includes('/blood-bank/overview')) return 'Blood Bank Overview';

    if (path.includes('/coordinator/create-request')) return 'Raise Emergency Blood Request';
    if (path.includes('/coordinator/network')) return 'Emergency Network Directory';
    if (path.includes('/coordinator/requests')) return 'Request Coordination & Offers';
    if (path.includes('/coordinator/transfers')) return 'Transfer Logistics & OTP';
    if (path.includes('/coordinator/overview')) return 'Emergency Coordinator Overview';

    if (path.includes('/hospital-admin/staff')) return 'Hospital Staff Management';
    if (path.includes('/hospital-admin/profile')) return 'Hospital Profile';
    if (path.includes('/hospital-admin/reports')) return 'Hospital Reports & Activity';
    if (path.includes('/hospital-admin/overview')) return 'Hospital Operational Summary';

    if (path.includes('/super-admin/hospitals')) return 'Hospital Directory & Verification';
    if (path.includes('/super-admin/users')) return 'Staff & Access Management';
    if (path.includes('/super-admin/emergency-monitoring')) return 'Network Emergency Monitoring';
    if (path.includes('/super-admin/audit-logs')) return 'Compliance & Audit Logs';
    if (path.includes('/super-admin/overview')) return 'National Overview';

    return 'Dashboard';
  };

  const handleRoleSelect = (r: (typeof roles)[0]) => {
    dispatch(setRole(r.role));
    setShowRoleMenu(false);
    navigate(r.route);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadgeName = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'super admin';
      case 'HOSPITAL_ADMIN':
        return 'hospital admin';
      case 'BLOOD_BANK_OFFICER':
        return 'blood officer';
      case 'EMERGENCY_COORDINATOR':
        return 'coordinator';
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sm:px-8 z-20 sticky top-0">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center space-x-4">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Role Switcher Pill + Notifications + User Avatar */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Sleek Minimal Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold text-emerald-800">
              {roles.find((r) => r.role === activeRole)?.label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Persona
              </div>
              {roles.map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-left transition-colors ${activeRole === item.role
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <item.icon className="w-4 h-4 text-emerald-600" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white shadow-2xl border border-slate-100 p-3 z-50">
              <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-emerald-600 font-bold hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => dispatch(markAsRead(notif.id))}
                    className="p-3 text-xs hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <p className="font-bold text-slate-900">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Minimal User Profile Matching Image 2 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="hidden sm:block text-right">
              <div className="flex items-center justify-end space-x-1.5">
                <span className="text-xs font-bold text-slate-900">{currentUser?.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-800">
                  {getRoleBadgeName(activeRole)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{currentUser?.email}</p>
            </div>

            {/* Circle Avatar matching Image 2 ("AU" style or photo) */}
            <div className="w-10 h-10 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/20">
              {currentUser?.name
                ? currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                : 'AU'}
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-xs text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
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
