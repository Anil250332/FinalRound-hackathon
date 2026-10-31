import React, { useState } from 'react';
import { BloodGroup, BloodComponent } from '../../../types';
import {
  Zap,
  Radio,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Droplet,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O-');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [unitsNeeded, setUnitsNeeded] = useState(3);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [acceptedHospitals, setAcceptedHospitals] = useState<string[]>([]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['Whole Blood', 'PRBC', 'Platelets', 'FFP'];

  const simulatedOffers = [
    {
      id: 'hosp-1',
      name: 'AIIMS Central Hospital & Blood Centre',
      city: 'Ansari Nagar, New Delhi',
      distance: 2.4,
      transitMinutes: 12,
      availableUnits: 14,
      canSupply: 2,
    },
    {
      id: 'hosp-2',
      name: 'Safdarjung Regional Blood Centre',
      city: 'Ring Road, New Delhi',
      distance: 3.1,
      transitMinutes: 15,
      availableUnits: 9,
      canSupply: 1,
    },
    {
      id: 'hosp-3',
      name: 'Max Super Speciality Hospital',
      city: 'Saket, New Delhi',
      distance: 6.8,
      transitMinutes: 22,
      availableUnits: 5,
      canSupply: 1,
    },
  ];

  const handleSimulateBroadcast = () => {
    setIsScanning(true);
    setAcceptedHospitals([]);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 800);
  };

  const handleAcceptSimulated = (id: string) => {
    if (!acceptedHospitals.includes(id)) {
      setAcceptedHospitals([...acceptedHospitals, id]);
    }
  };

  return (
    <section id="simulator" className="py-20 bg-gradient-to-b from-transparent via-white to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Live Grid Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Test the Inter-Hospital Lifeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
            Select a critical blood component requirement below to watch PulseRelay locate and match participating facilities in real-time.
          </p>
        </div>

        {/* Simulator Control Box */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/80 shadow-2xl shadow-slate-200/50 max-w-4xl mx-auto">
          {/* Blood Group Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              1. Choose Required Blood Group
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedGroup(bg)}
                  className={`py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    selectedGroup === bg
                      ? 'bg-[#0d9488] text-white shadow-md shadow-teal-700/20 scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Component & Units Selector */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                2. Component Type
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value as BloodComponent)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                3. Emergency Units Needed
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setUnitsNeeded(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      unitsNeeded === num
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {num} Bags
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Simulates broadcast to <strong>25+ verified hospitals</strong> across Delhi NCR
            </span>

            <button
              onClick={handleSimulateBroadcast}
              disabled={isScanning}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0d9488] to-[#0f766e] hover:from-[#0f766e] hover:to-[#044e43] text-white font-black text-xs shadow-lg shadow-teal-800/25 flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>{isScanning ? 'Pinging Regional Network...' : `Simulate Emergency Broadcast`}</span>
            </button>
          </div>

          {/* Results Display */}
          {(isScanning || hasScanned) && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Response Stream: {unitsNeeded} Units of {selectedGroup} {selectedComponent}
                </span>
                <span className="text-[11px] text-[#0d9488] font-bold">
                  {acceptedHospitals.length} of {simulatedOffers.length} Offers Locked
                </span>
              </div>

              {isScanning ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#0d9488] border-t-transparent animate-spin mx-auto"></div>
                  <p className="font-semibold">Searching participating hospital inventories in real-time...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {simulatedOffers.map((offer) => {
                    const isAccepted = acceptedHospitals.includes(offer.id);
                    return (
                      <div
                        key={offer.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isAccepted
                            ? 'bg-emerald-50/60 border-emerald-300'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-[#0d9488]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{offer.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {offer.city} • {offer.distance} km away
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 pl-13 sm:pl-0">
                          <div className="text-right">
                            <span className="text-xs font-black text-slate-900 block">
                              Can Supply {offer.canSupply} Units
                            </span>
                            {isAccepted ? (
                              <span className="text-[10px] text-emerald-800 font-bold block flex items-center gap-1 justify-end">
                                📞 +91 98260 11101 (Doctor Desk)
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-semibold block flex items-center gap-1 justify-end">
                                <Clock className="w-3 h-3" />
                                {offer.transitMinutes} mins away
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleAcceptSimulated(offer.id)}
                            disabled={isAccepted}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isAccepted
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white hover:bg-[#0d9488] hover:text-white text-slate-800 border border-slate-200 shadow-2xs'
                            }`}
                          >
                            {isAccepted ? '✓ Mutual Aid Connected' : 'Accept & Help'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
