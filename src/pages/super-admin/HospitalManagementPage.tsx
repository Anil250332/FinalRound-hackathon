import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  verifyHospital,
  suspendHospital,
  addHospital,
  setFilterType,
  setSearchQuery,
  fetchHospitals,
  verifyHospitalThunk,
  createHospitalThunk,
} from '../../store/slices/hospitalSlice';
import { addAuditLog } from '../../store/slices/notificationSlice';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Ban,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Check,
  Lock,
} from 'lucide-react';

export const HospitalManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hospitals, filterType, searchQuery } = useAppSelector((state) => state.hospitals);
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createdAdminCredentials, setCreatedAdminCredentials] = useState<{
    hospitalName: string;
    email: string;
    password: string;
  } | null>(null);

  const [newHosp, setNewHosp] = useState({
    name: '',
    licenseNumber: '',
    type: 'PRIVATE' as const,
    email: '',
    phone: '',
    address: '',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    verified: true,
    status: 'VERIFIED' as const,
    totalBeds: 200,
    hasBloodBank: true,
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleVerify = async (hospitalId: string, hospitalName: string) => {
    dispatch(verifyHospital(hospitalId));
    await dispatch(verifyHospitalThunk({ id: hospitalId, status: 'VERIFIED' }));
    dispatch(fetchHospitals());
    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'VERIFY_HOSPITAL',
        targetResource: hospitalName,
        details: `Approved hospital verification and activated network blood participation`,
        ipAddress: '103.21.144.10',
      })
    );
  };

  const handleSuspend = async (hospitalId: string, hospitalName: string) => {
    dispatch(suspendHospital(hospitalId));
    await dispatch(verifyHospitalThunk({ id: hospitalId, status: 'SUSPENDED' }));
    dispatch(fetchHospitals());
    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'SUSPEND_HOSPITAL',
        targetResource: hospitalName,
        details: `Suspended hospital network access due to compliance check`,
        ipAddress: '103.21.144.10',
      })
    );
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHosp.name || !newHosp.licenseNumber) return;
    setIsAddModalOpen(false);

    const effectiveAdminEmail = (newHosp.adminEmail || newHosp.email || `${newHosp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hospital.org`).trim();
    const effectiveAdminPassword = (newHosp.adminPassword || 'Password@123').trim();

    // Persist in live MongoDB Atlas backend
    const createResult = await dispatch(
      createHospitalThunk({
        name: newHosp.name,
        hospitalCode: newHosp.licenseNumber,
        licenseNumber: newHosp.licenseNumber,
        address: newHosp.address || `${newHosp.city || 'Indore'}, India`,
        city: newHosp.city || 'Indore',
        phone: newHosp.phone || '+91 98260 00000',
        email: newHosp.email || effectiveAdminEmail,
        hasBloodBank: newHosp.hasBloodBank,
        coordinates: newHosp.coordinates || { lat: 22.7196, lng: 75.8577 },
        role: newHosp.hasBloodBank ? 'BOTH' : 'REQUESTING',
        contact: {
          phone: newHosp.phone || '+91 98260 00000',
          email: newHosp.email || effectiveAdminEmail,
          emergencyContact: newHosp.phone || '+91 98260 00000',
        },
        adminName: newHosp.adminName || `${newHosp.name} Head`,
        adminEmail: effectiveAdminEmail,
        adminPassword: effectiveAdminPassword,
      })
    );

    // Cache locally for instant seamless login fallback
    try {
      const existingAdmins = JSON.parse(localStorage.getItem('pulserelay_registered_admins') || '[]');
      const createdHosp = createHospitalThunk.fulfilled.match(createResult) ? createResult.payload : null;
      existingAdmins.push({
        email: effectiveAdminEmail.toLowerCase(),
        password: effectiveAdminPassword,
        user: {
          id: createdHosp?.id || `hosp-admin-${Date.now()}`,
          name: newHosp.adminName || `${newHosp.name} Head`,
          email: effectiveAdminEmail,
          role: 'HOSPITAL_ADMIN',
          hospitalId: createdHosp?.id || `hosp-${Date.now()}`,
          hospitalName: newHosp.name,
          phone: newHosp.phone || '+91 98260 00000',
          status: 'ACTIVE',
        },
      });
      localStorage.setItem('pulserelay_registered_admins', JSON.stringify(existingAdmins));
    } catch (e) {
      console.warn('LocalStorage cache error:', e);
    }

    setCreatedAdminCredentials({
      hospitalName: newHosp.name,
      email: effectiveAdminEmail,
      password: effectiveAdminPassword,
    });

    // Refresh to verify persistence
    dispatch(fetchHospitals());

    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'REGISTER_HOSPITAL',
        targetResource: newHosp.name,
        details: `Registered new medical facility with license ${newHosp.licenseNumber} and created admin account (${effectiveAdminEmail})`,
        ipAddress: '103.21.144.10',
      })
    );

    setNewHosp({
      name: '',
      licenseNumber: '',
      type: 'PRIVATE',
      email: '',
      phone: '',
      address: '',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      coordinates: { lat: 22.7196, lng: 75.8577 },
      verified: true,
      status: 'VERIFIED' as const,
      totalBeds: 200,
      hasBloodBank: true,
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    });
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || h.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify facility licenses, approve regional blood bank centres, and manage network authorizations
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Hospital</span>
        </button>
      </div>

      {createdAdminCredentials && (
        <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200 text-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0d9488]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Hospital Registered & Admin Account Created!
              </h3>
            </div>
            <button
              onClick={() => setCreatedAdminCredentials(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            <strong>{createdAdminCredentials.hospitalName}</strong> can now log in using the credentials below:
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <div className="bg-white p-3 rounded-xl border border-teal-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Login Email</span>
              <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#0d9488]" />
                {createdAdminCredentials.email}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-teal-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Login Password</span>
              <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Lock className="w-3.5 h-3.5 text-[#0d9488]" />
                {createdAdminCredentials.password}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search hospital name, city, or license..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Facility Type:</span>
          <select
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value as any))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Facilities</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="CHARITABLE">Charitable / NGO</option>
          </select>
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Hospital & Facility</th>
                <th className="py-3.5 px-4">License / Registration</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Blood Bank Facility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHospitals.map((hosp) => (
                <tr key={hosp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{hosp.name}</p>
                        <p className="text-[11px] text-slate-500">{hosp.type}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-medium text-slate-700">
                    {hosp.licenseNumber}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.city}, {hosp.state}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {hosp.hasBloodBank ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In-House Blood Centre
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Storage Only
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge status={hosp.status} />
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {hosp.status !== 'VERIFIED' ? (
                        <button
                          onClick={() => handleVerify(hosp.id, hosp.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(hosp.id, hosp.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-all flex items-center space-x-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hospital Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Participating Hospital"
        subtitle="Verify clinical credentials before activating into the emergency network"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Hospital / Medical Center Name</label>
            <input
              type="text"
              required
              value={newHosp.name}
              onChange={(e) => setNewHosp({ ...newHosp, name: e.target.value })}
              placeholder="e.g. Apollo Super Speciality Hospital"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State Blood License No.</label>
              <input
                type="text"
                required
                value={newHosp.licenseNumber}
                onChange={(e) => setNewHosp({ ...newHosp, licenseNumber: e.target.value })}
                placeholder="DL-BB-2026-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facility Type</label>
              <select
                value={newHosp.type}
                onChange={(e) => setNewHosp({ ...newHosp, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                <option value="GOVERNMENT">Government Institute</option>
                <option value="PRIVATE">Private Multi-Speciality</option>
                <option value="CHARITABLE">Charitable / Red Cross</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={newHosp.city}
                onChange={(e) => setNewHosp({ ...newHosp, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                required
                value={newHosp.state}
                onChange={(e) => setNewHosp({ ...newHosp, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Address</label>
            <input
              type="text"
              required
              value={newHosp.address}
              onChange={(e) => setNewHosp({ ...newHosp, address: e.target.value })}
              placeholder="Full physical facility address..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Direct Contact Phone</label>
              <input
                type="text"
                required
                value={newHosp.phone}
                onChange={(e) => setNewHosp({ ...newHosp, phone: e.target.value })}
                placeholder="+91 11 2600 0000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={newHosp.email}
                onChange={(e) => setNewHosp({ ...newHosp, email: e.target.value })}
                placeholder="contact@hospital.org"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="hasBloodBank"
              checked={newHosp.hasBloodBank}
              onChange={(e) => setNewHosp({ ...newHosp, hasBloodBank: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="hasBloodBank" className="text-xs font-semibold text-slate-800">
              Facility operates an in-house certified blood bank and component separation unit
            </label>
          </div>

          {/* Hospital Admin Login Account Credentials */}
          <div className="pt-4 border-t border-slate-200 mt-2">
            <div className="flex items-center gap-1.5 mb-1 text-[#0d9488]">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Hospital Head / Admin Login Credentials
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              These credentials allow the Hospital Administrator to log into their Hospital Dashboard.
            </p>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital Head / Doctor Name</label>
                <input
                  type="text"
                  value={newHosp.adminName}
                  onChange={(e) => setNewHosp({ ...newHosp, adminName: e.target.value })}
                  placeholder="e.g. Dr. Sunita Deshmukh"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Login Email *</label>
                  <input
                    type="email"
                    required
                    value={newHosp.adminEmail}
                    onChange={(e) => setNewHosp({ ...newHosp, adminEmail: e.target.value })}
                    placeholder="admin@hospital.org"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admin Password *</label>
                  <input
                    type="password"
                    required
                    value={newHosp.adminPassword}
                    onChange={(e) => setNewHosp({ ...newHosp, adminPassword: e.target.value })}
                    placeholder="Set login password (e.g. Password@123)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>
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
              Submit for Verification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
