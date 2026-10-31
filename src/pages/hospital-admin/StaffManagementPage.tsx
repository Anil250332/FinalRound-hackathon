import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { apiService } from '../../services/apiService';
import {
  Users,
  UserPlus,
  Search,
  Droplet,
  Trash2,
  Phone,
  Mail,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Power,
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const hospitalId = currentUser?.hospitalId || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || 'City Care Hospital';

  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New staff form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'BLOOD_BANK_OFFICER' as UserRole,
  });

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const users = await apiService.getUsers(hospitalId);
      // Filter out super admins if any, show officers of this hospital
      setStaffList(users.filter((u) => u.role !== 'SUPER_ADMIN'));
    } catch (err) {
      console.error('Failed to load hospital staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [hospitalId]);

  const toggleStaffStatus = async (id: string, currentStatus: string) => {
    const nextActive = currentStatus !== 'ACTIVE';
    try {
      await apiService.toggleUserStatus(id, nextActive);
      setStaffList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextActive ? 'ACTIVE' : 'SUSPENDED' } : s))
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this officer account?')) return;
    try {
      await apiService.deleteUser(id);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) return;
    setIsSubmitting(true);
    try {
      const created = await apiService.createUser({
        name: newStaff.name,
        email: newStaff.email,
        password: newStaff.password,
        phone: newStaff.phone,
        role: newStaff.role,
        hospitalId,
      });
      setStaffList([created, ...staffList]);
      setIsModalOpen(false);
      setNewStaff({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'BLOOD_BANK_OFFICER',
      });
    } catch (err) {
      console.error('Failed to create staff member:', err);
      alert('Failed to add user. Ensure email is unique.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Hospital Officer Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Officers & User Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add, activate, deactivate, or delete Blood Bank Officers assigned under {hospitalName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Officer</span>
            </button>
            <button
              onClick={loadStaff}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Officers</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{staffList.length}</p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <p className="text-[11px] font-bold text-[#0d9488] uppercase">Active Officers</p>
            <p className="text-xl font-black text-[#0d9488] mt-0.5">
              {staffList.filter((s) => s.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Deactivated / Inactive</p>
            <p className="text-xl font-black text-slate-600 mt-0.5">
              {staffList.filter((s) => s.status !== 'ACTIVE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search officers by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading hospital staff...</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No officers found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add New Officer" to add blood bank officers for this hospital.</p>
          </div>
        ) : (
          filteredStaff.map((staff) => {
            const isActive = staff.status === 'ACTIVE';
            return (
              <div
                key={staff.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center font-black text-sm">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{staff.name}</h3>
                        <p className="text-xs text-slate-500">{staff.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-teal-50 text-[#0d9488] border border-teal-100 text-xs font-semibold">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Blood Bank Officer</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Added: {staff.createdAt?.slice(0, 10)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {staff.phone || '+91 98260 00000'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStaffStatus(staff.id, staff.status)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={isActive ? 'Deactivate Officer' : 'Activate Officer'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isActive ? 'Set Inactive' : 'Set Active'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Delete Officer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Blood Bank Officer"
        subtitle={`Create new officer account for ${hospitalName}`}
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
            <label className="block font-bold text-slate-700 mb-1">Login Email</label>
            <input
              type="email"
              required
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              placeholder="officer@hospital.org"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Login Password</label>
            <input
              type="password"
              required
              value={newStaff.password}
              onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
              placeholder="Set a password for the officer"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Phone (For Alerts & Coordination)</label>
            <input
              type="text"
              required
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              placeholder="+91 98260 00000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] shadow-md shadow-teal-700/20 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Officer Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
