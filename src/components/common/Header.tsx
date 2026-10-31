import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setRole, logout } from '../../store/slices/authSlice';
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import { UserRole } from '../../types';
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Hospital,
  Droplet,
  Radio,
  ExternalLink,
  Wifi,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser, activeRole, serverAwake } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roles: { role: UserRole; label: string; icon: any; route: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldAlert, route: '/super-admin/overview' },
    { role: 'HOSPITAL_ADMIN', label: 'Hospital Admin', icon: Hospital, route: '/hospital-admin/overview' },
    { role: 'BLOOD_BANK_OFFICER', label: 'Blood Bank Officer', icon: Droplet, route: '/blood-bank/overview' },
    { role: 'EMERGENCY_COORDINATOR', label: 'Emergency Coordinator', icon: Radio, route: '/coordinator/overview' },
  ];

  const handleRoleSelect = (r: (typeof roles)[0]) => {
    dispatch(setRole(r.role));
    setShowRoleMenu(false);
    navigate(r.route);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
              >
                <span className="sr-only">Open menu</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <div
              onClick={() => {
                const currentRoleConfig = roles.find((r) => r.role === activeRole);
                navigate(currentRoleConfig ? currentRoleConfig.route : '/');
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Pulse<span className="text-emerald-600">Relay</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                    NETWORK
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-600 hidden sm:block">
                  Emergency Blood Transfer Grid
                </p>
              </div>
            </div>
          </div>

          {/* Center: Live Role Switcher (Hackathon / Demo Super Feature) */}
          <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600 px-2.5">Demo Role:</span>
            {roles.map((item) => {
              const isActive = activeRole === item.role;
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-xs font-bold border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions: Server Status, Notifications, User profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Server awake pill */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Wifi className="w-3 h-3 text-emerald-600" />
              <span>Network Active</span>
            </div>

            {/* Role dropdown for smaller screens */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <span>{roles.find((r) => r.role === activeRole)?.label || 'Switch Role'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                    Switch Active Persona
                  </div>
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleSelect(item)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <item.icon className="w-4 h-4 text-emerald-600" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 focus:outline-hidden transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between p-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Live Grid Alerts</h4>
                      <p className="text-[11px] text-slate-600">{unreadCount} unread emergency notifications</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 my-1">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-600">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => dispatch(markAsRead(notif.id))}
                          className={`p-3 text-xs rounded-xl transition-colors cursor-pointer ${
                            notif.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/60 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span
                              className={`font-semibold ${
                                notif.type === 'CRITICAL'
                                  ? 'text-rose-600'
                                  : notif.type === 'SUCCESS'
                                  ? 'text-emerald-700'
                                  : 'text-slate-900'
                              }`}
                            >
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-600">{notif.timestamp}</span>
                          </div>
                          <p className="mt-1 text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-900 leading-tight">{currentUser?.name}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {currentUser?.hospitalName || 'National Portal'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-900">{currentUser?.name}</p>
                    <p className="text-xs text-slate-600">{currentUser?.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {currentUser?.role.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
