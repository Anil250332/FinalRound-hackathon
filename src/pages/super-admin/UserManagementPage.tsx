import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { DEMO_USERS } from '../../services/mockData';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Hospital,
  Droplet,
  Radio,
  CheckCircle,
  Ban,
  Mail,
  Phone,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const [userList, setUserList] = useState<User[]>([
    DEMO_USERS.superAdmin,
    DEMO_USERS.hospitalAdmin,
    DEMO_USERS.bloodBankOfficer,
    DEMO_USERS.emergencyCoordinator,
    {
      id: 'usr-extra-1',
      name: 'Dr. Sameer Sen',
      email: 's.sen@safdarjung.nic.in',
      role: 'BLOOD_BANK_OFFICER',
      hospitalId: 'hosp-2',
      hospitalName: 'Safdarjung Hospital Regional Blood Centre',
      phone: '+91 98111 22334',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'usr-extra-2',
      name: 'Sister Anita Kaul',
      email: 'a.kaul@maxhealthcare.com',
      role: 'EMERGENCY_COORDINATOR',
      hospitalId: 'hosp-4',
      hospitalName: 'Max Super Speciality Hospital',
      phone: '+91 98112 33445',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150',
      createdAt: '2026-02-15T12:00:00Z',
    },
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'BLOOD_BANK_OFFICER' as UserRole,
    hospitalId: hospitals[0]?.id || 'hosp-1',
    hospitalName: hospitals[0]?.name || 'AIIMS Central Hospital',
    phone: '',
  });

  const toggleStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const selectedHosp = hospitals.find((h) => h.id === newUser.hospitalId);
    const created: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      hospitalId: newUser.hospitalId,
      hospitalName: selectedHosp?.name || newUser.hospitalName,
      phone: newUser.phone,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      createdAt: new Date().toISOString(),
    };
    setUserList([created, ...userList]);
    setIsAddModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'BLOOD_BANK_OFFICER',
      hospitalId: hospitals[0]?.id || 'hosp-1',
      hospitalName: hospitals[0]?.name || 'AIIMS Central Hospital',
      phone: '',
    });
  };

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.hospitalName && u.hospitalName.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return Shield;
      case 'HOSPITAL_ADMIN':
        return Hospital;
      case 'BLOOD_BANK_OFFICER':
        return Droplet;
      case 'EMERGENCY_COORDINATOR':
        return Radio;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User & Role Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision clinical staff, assign hospital authorization privileges, and manage security credentials
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
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
            placeholder="Search by name, email, or hospital..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Network Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="HOSPITAL_ADMIN">Hospital Admin</option>
            <option value="BLOOD_BANK_OFFICER">Blood Bank Officer</option>
            <option value="EMERGENCY_COORDINATOR">Emergency Coordinator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-4">Authorized Role</th>
                <th className="py-3.5 px-4">Affiliated Facility</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150'}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <RoleIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{user.role.replace(/_/g, ' ')}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {user.hospitalName || 'National Portal Authority'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {user.phone || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Institutional Staff Account"
        subtitle="Grant role-based privileges to hospital emergency staff"
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. Dr. Alok Mathur"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="a.mathur@hospital.org"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                <option value="HOSPITAL_ADMIN">Hospital Admin</option>
                <option value="BLOOD_BANK_OFFICER">Blood Bank Officer</option>
                <option value="EMERGENCY_COORDINATOR">Emergency Coordinator</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Affiliated Hospital</label>
              <select
                value={newUser.hospitalId}
                onChange={(e) => setNewUser({ ...newUser, hospitalId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile Contact Phone</label>
            <input
              type="text"
              required
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+91 98000 00000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
