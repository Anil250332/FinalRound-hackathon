import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserPlus,
  Search,
  Droplet,
  Radio,
  CheckCircle2,
  Ban,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const hospitalName = currentUser?.hospitalName || 'AIIMS Central Hospital';

  const [staffList, setStaffList] = useState<User[]>([
    {
      id: 'stf-1',
      name: 'Officer Vikram Rathore',
      email: 'bloodbank@aiims.edu.in',
      role: 'BLOOD_BANK_OFFICER',
      hospitalName,
      phone: '+91 98300 78901',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      createdAt: '2026-02-12',
    },
    {
      id: 'stf-2',
      name: 'Dr. Rohit Mehra',
      email: 'r.mehra@aiims.edu.in',
      role: 'BLOOD_BANK_OFFICER',
      hospitalName,
      phone: '+91 98301 22334',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      createdAt: '2026-02-14',
    },
    {
      id: 'stf-3',
      name: 'Dr. Sunita Rao',
      email: 's.rao@aiims.edu.in',
      role: 'EMERGENCY_COORDINATOR',
      hospitalName,
      phone: '+91 98402 33445',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1594824813515-5a2a07c11f7c?w=150',
      createdAt: '2026-02-18',
    },
    {
      id: 'stf-4',
      name: 'Coordinator Tarun Joshi',
      email: 't.joshi@aiims.edu.in',
      role: 'EMERGENCY_COORDINATOR',
      hospitalName,
      phone: '+91 98403 44556',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2026-02-22',
    },
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'BLOOD_BANK_OFFICER' | 'EMERGENCY_COORDINATOR'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'BLOOD_BANK_OFFICER' as UserRole,
    phone: '',
  });

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;
    const added: User = {
      id: `stf-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      hospitalName,
      phone: newStaff.phone,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaffList([added, ...staffList]);
    setIsModalOpen(false);
    setNewStaff({
      name: '',
      email: '',
      role: 'BLOOD_BANK_OFFICER',
      phone: '',
    });
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Staff Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authorized blood bank officers and emergency coordinators for {hospitalName}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Clinical Staff</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Department:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Departments</option>
            <option value="BLOOD_BANK_OFFICER">Blood Bank Officers</option>
            <option value="EMERGENCY_COORDINATOR">Emergency Coordinators</option>
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={staff.avatar}
                    alt=""
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{staff.name}</h3>
                    <p className="text-xs text-slate-500">{staff.email}</p>
                  </div>
                </div>
                <StatusBadge status={staff.status} />
              </div>

              <div className="mt-4 flex items-center space-x-2">
                {staff.role === 'BLOOD_BANK_OFFICER' ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                    <span>Blood Bank Officer</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                    <Radio className="w-3.5 h-3.5 text-rose-600" />
                    <span>Emergency Coordinator</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-mono">Added: {staff.createdAt}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {staff.phone}
              </span>
              <button
                onClick={() => toggleStaffStatus(staff.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  staff.status === 'ACTIVE'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {staff.status === 'ACTIVE' ? 'Revoke Access' : 'Restore Access'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Hospital Staff Member"
        subtitle={`Create new clinical user account for ${hospitalName}`}
      >
        <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              placeholder="e.g. Dr. Kavita Nair"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hospital Email</label>
            <input
              type="email"
              required
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              placeholder="k.nair@aiims.edu.in"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Role & Responsibility</label>
            <select
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
            >
              <option value="BLOOD_BANK_OFFICER">Blood Bank Officer (Manage Stock, Send Offers)</option>
              <option value="EMERGENCY_COORDINATOR">Emergency Coordinator (Raise Requests, Verify OTP)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Phone (For Alerts & OTP)</label>
            <input
              type="text"
              required
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              placeholder="+91 98000 00000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              Confirm Account Creation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
