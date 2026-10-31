import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHospitals } from '../../store/slices/hospitalSlice';
import { StatusBadge } from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/Skeleton';
import { BloodGroup } from '../../types';
import {
  Network,
  Building2,
  MapPin,
  Phone,
  Droplet,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const EmergencyNetworkPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hospitals, isLoading } = useAppSelector((state) => state.hospitals);
  const { items } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Participating Emergency Network</h1>
        <p className="text-xs text-slate-500 mt-1">
          Directory of verified hospital blood centres, certified component separation units, and real-time stock levels
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participating facility by name or city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Stock:</span>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg} Available
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital Network Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && filteredHospitals.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          filteredHospitals.map((hosp) => {
          // Calculate stock for this hospital
          const hospStock = items.filter((i) => i.hospitalId === hosp.id);
          const totalUnits = hospStock.reduce((acc, curr) => acc + curr.availableUnits, 0);

          return (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <StatusBadge status={hosp.status} />
                </div>

                <div className="mt-3">
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{hosp.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{hosp.address}, {hosp.city}</span>
                  </p>
                </div>

                <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Certified Stock:</span>
                  <span className="font-black text-slate-900 text-xs flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                    {totalUnits} Units Ready
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${hosp.phone}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{hosp.phone}</span>
                </a>
                <span className="text-[10px] font-mono text-slate-400">Lic: {hosp.licenseNumber}</span>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
