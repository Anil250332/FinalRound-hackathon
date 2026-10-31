import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  addOrUpdateStock,
  setBloodGroupFilter,
  setComponentFilter,
  setSearchQuery,
} from '../../store/slices/inventorySlice';
import { BloodGroup, BloodComponent } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Droplet,
  Plus,
  Search,
  Thermometer,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const BloodInventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items, selectedBloodGroupFilter, selectedComponentFilter, searchQuery } = useAppSelector(
    (state) => state.inventory
  );

  const hospitalId = currentUser?.hospitalId || 'hosp-1';
  const hospitalName = currentUser?.hospitalName || 'AIIMS Central Hospital & Blood Centre';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId,
    hospitalName,
    bloodGroup: 'O-' as BloodGroup,
    component: 'PRBC' as BloodComponent,
    availableUnits: 10,
    storageTemp: '2°C to 6°C',
    shelfLifeDays: 42,
    expiryDate: '2026-04-15',
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'];

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addOrUpdateStock(formData));
    setIsModalOpen(false);
  };

  const filteredItems = items
    .filter((item) => item.hospitalId === hospitalId)
    .filter((item) => {
      const matchesGroup =
        selectedBloodGroupFilter === 'ALL' || item.bloodGroup === selectedBloodGroupFilter;
      const matchesComponent =
        selectedComponentFilter === 'ALL' || item.component === selectedComponentFilter;
      const matchesSearch =
        item.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.component.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesComponent && matchesSearch;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blood Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Component-wise stock maintenance, cold-storage telemetry, and real-time reservation locks for {hospitalName}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Update Stock</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search blood group or component..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Blood Group Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-500">Group:</span>
            <select
              value={selectedBloodGroupFilter}
              onChange={(e) => dispatch(setBloodGroupFilter(e.target.value as any))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Component Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-500">Component:</span>
            <select
              value={selectedComponentFilter}
              onChange={(e) => dispatch(setComponentFilter(e.target.value as any))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">All Components</option>
              {components.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Blood Group</th>
                <th className="py-3.5 px-4">Component</th>
                <th className="py-3.5 px-4">Available Units</th>
                <th className="py-3.5 px-4">Reserved Units</th>
                <th className="py-3.5 px-4">Total In-Stock</th>
                <th className="py-3.5 px-4">Storage Temp</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                      {item.bloodGroup}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.component}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-sm text-slate-900">{item.availableUnits}</span>{' '}
                    <span className="text-slate-400 text-[11px]">Units</span>
                  </td>

                  <td className="py-3.5 px-4">
                    {item.reservedUnits > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {item.reservedUnits} Locked
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {item.totalUnits} Units
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.storageTemp}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.expiryDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    {item.availableUnits >= 10 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Adequate
                      </span>
                    ) : item.availableUnits > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                        Depleted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Update Stock Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add or Update Blood Component Inventory"
        subtitle="Record tested and certified blood units into the hospital inventory ledger"
      >
        <form onSubmit={handleStockSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Component Type</label>
              <select
                value={formData.component}
                onChange={(e) => {
                  const comp = e.target.value as BloodComponent;
                  let temp = '2°C to 6°C';
                  let days = 42;
                  if (comp === 'Platelets') {
                    temp = '20°C to 24°C';
                    days = 5;
                  } else if (comp === 'FFP' || comp === 'Cryoprecipitate') {
                    temp = '-18°C or below';
                    days = 365;
                  }
                  setFormData({ ...formData, component: comp, storageTemp: temp, shelfLifeDays: days });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Units</label>
              <input
                type="number"
                min="0"
                required
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Temperature</label>
              <input
                type="text"
                required
                value={formData.storageTemp}
                onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
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
              Save Units to Inventory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
