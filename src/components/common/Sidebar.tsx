import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import {
  LayoutDashboard,
  Building2,
  Users,
  Radio,
  FileText,
  UserCheck,
  Building,
  BarChart3,
  Droplet,
  Inbox,
  BookmarkCheck,
  PlusCircle,
  Network,
  Truck,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const { activeRole, currentUser } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.emergency);
  const { items } = useAppSelector((state) => state.inventory);

  const activeEmergencyCount = requests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  ).length;

  // Compute total available units in blood bank
  const totalUnits = items.reduce((acc, curr) => acc + curr.availableUnits, 0);

  const getNavLinks = () => {
    switch (activeRole) {
      case 'SUPER_ADMIN':
        return [
          { name: 'National Overview', path: '/super-admin/overview', icon: LayoutDashboard },
          { name: 'Hospital Directory', path: '/super-admin/hospitals', icon: Building2 },
          { name: 'User & Role Access', path: '/super-admin/users', icon: Users },
          { name: 'Emergency Monitoring', path: '/super-admin/emergency-monitoring', icon: Radio },
          { name: 'Reports & Audit Logs', path: '/super-admin/audit-logs', icon: FileText },
        ];
      case 'HOSPITAL_ADMIN':
        return [
          { name: 'Hospital Overview', path: '/hospital-admin/overview', icon: LayoutDashboard },
          { name: 'Staff Management', path: '/hospital-admin/staff', icon: UserCheck },
          { name: 'Hospital Profile', path: '/hospital-admin/profile', icon: Building },
          { name: 'Activity & Reports', path: '/hospital-admin/reports', icon: BarChart3 },
        ];
      case 'BLOOD_BANK_OFFICER':
        return [
          { name: 'Stock Overview', path: '/blood-bank/overview', icon: LayoutDashboard },
          { name: 'Blood Inventory', path: '/blood-bank/inventory', icon: Droplet },
          { name: 'Incoming Requests', path: '/blood-bank/incoming-requests', icon: Inbox },
          { name: 'Offers & Reservations', path: '/blood-bank/offers-reservations', icon: BookmarkCheck },
        ];
      case 'EMERGENCY_COORDINATOR':
        return [
          { name: 'Emergency Overview', path: '/coordinator/overview', icon: LayoutDashboard },
          { name: 'Raise Emergency', path: '/coordinator/create-request', icon: PlusCircle, isHighlight: true },
          { name: 'Network Directory', path: '/coordinator/network', icon: Network },
          { name: 'Request & Offers', path: '/coordinator/requests', icon: HeartHandshake },
          { name: 'Transfer & OTP', path: '/coordinator/transfers', icon: Truck },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Emergency Alert Callout in Sidebar */}
      <div className="p-4 border-b border-slate-100">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Network
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
              {activeEmergencyCount} Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600 font-medium">
            {activeRole === 'BLOOD_BANK_OFFICER'
              ? `${totalUnits} Units ready in inventory`
              : activeRole === 'EMERGENCY_COORDINATOR'
              ? 'Rapid hospital broadcast enabled'
              : 'Multi-centre regional grid active'}
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
          Navigation
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : item.isHighlight
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.isHighlight
                        ? 'text-rose-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Emergency broadcast shortcut for Coordinator */}
      {activeRole === 'EMERGENCY_COORDINATOR' && (
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              navigate('/coordinator/create-request');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>Broadcast Emergency</span>
          </button>
        </div>
      )}

      {/* Footer Identity pill */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-2.5 px-2 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <div className="truncate">
            <p className="text-[11px] font-bold text-slate-800 truncate">
              {currentUser?.hospitalName || 'National Command Centre'}
            </p>
            <p className="text-[10px] text-slate-600 font-medium truncate">Role: {activeRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
