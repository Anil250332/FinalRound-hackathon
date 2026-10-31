import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createRequest, createEmergencyRequestApi } from '../../store/slices/emergencySlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';
import {
  Radio,
  AlertTriangle,
  Clock,
  Droplet,
  Building2,
  FileText,
  Send,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const CreateEmergencyRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const hospitalId = currentUser?.hospitalId || 'hosp-3';
  const hospitalName = currentUser?.hospitalName || 'Fortis Memorial Emergency Centre';

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [requiredUnits, setRequiredUnits] = useState(3);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [requiredByTime, setRequiredByTime] = useState('Within 45 mins');
  const [patientReferenceId, setPatientReferenceId] = useState('PT-EMG-702');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Trauma resuscitation, active internal arterial bleed. OR-1 surgery scheduled.'
  );

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'];

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    dispatch(
      createEmergencyRequestApi({
        requestingHospitalId: hospitalId,
        bloodGroup,
        component,
        requiredUnits,
        urgency,
        additionalNotes: clinicalNotes,
      })
    );

    setTimeout(() => {
      dispatch(
        createRequest({
          requestingHospitalId: hospitalId,
          requestingHospitalName: hospitalName,
          requestingHospitalCity: 'Gurugram',
          patientReferenceId,
          bloodGroup,
          component,
          requiredUnits,
          urgency,
          requiredByTime,
          clinicalNotes,
        })
      );

      dispatch(
        addAuditLog({
          userId: currentUser?.id || 'usr-ec-1',
          userName: currentUser?.name || 'Dr. Neha Desai',
          userRole: 'EMERGENCY_COORDINATOR',
          action: 'BROADCAST_REQUEST',
          targetResource: `${bloodGroup} ${component} (${requiredUnits} Units)`,
          details: `Broadcasted urgent requirement (${urgency}) to regional hospital network`,
          ipAddress: '103.21.144.12',
        })
      );

      dispatch(
        addNotification({
          title: 'Emergency Requirement Broadcasted',
          message: `Your broadcast for ${requiredUnits} Units ${bloodGroup} ${component} was transmitted to 5 participating centres.`,
          type: 'CRITICAL',
        })
      );

      setIsBroadcasting(false);
      navigate('/coordinator/requests');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button and page title */}
      <div>
        <button
          onClick={() => navigate('/coordinator/overview')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Emergency Overview</span>
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Broadcast Emergency Blood Requirement</h1>
        <p className="text-xs text-slate-500 mt-1">
          Initiate priority network broadcast across all verified hospital blood centres in Delhi NCR
        </p>
      </div>

      <form onSubmit={handleBroadcastSubmit} className="space-y-6">
        {/* Step 1: Urgency & Time Window */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>1. Clinical Urgency & Timeline</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                level: 'CRITICAL' as UrgencyLevel,
                label: 'Critical / Red Code',
                desc: 'Active hemorrhage, OR trauma shock (Response < 45m)',
                border: urgency === 'CRITICAL' ? 'border-rose-500 bg-rose-50/50 text-rose-900' : 'border-slate-200',
              },
              {
                level: 'URGENT' as UrgencyLevel,
                label: 'Urgent Priority',
                desc: 'Unstable patient, transfusion within 2 hours',
                border: urgency === 'URGENT' ? 'border-amber-500 bg-amber-50/50 text-amber-900' : 'border-slate-200',
              },
              {
                level: 'NORMAL' as UrgencyLevel,
                label: 'Scheduled Support',
                desc: 'Elective surgical procedure within 6 hours',
                border: urgency === 'NORMAL' ? 'border-blue-500 bg-blue-50/50 text-blue-900' : 'border-slate-200',
              },
            ].map((u) => (
              <button
                type="button"
                key={u.level}
                onClick={() => {
                  setUrgency(u.level);
                  if (u.level === 'CRITICAL') setRequiredByTime('Within 45 mins');
                  else if (u.level === 'URGENT') setRequiredByTime('Within 2 hours');
                  else setRequiredByTime('Within 6 hours');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${u.border}`}
              >
                <span className="font-extrabold text-xs block">{u.label}</span>
                <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">{u.desc}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Required By Time Limit</label>
              <select
                value={requiredByTime}
                onChange={(e) => setRequiredByTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden"
              >
                <option value="Within 30 mins">Within 30 mins (Ultra Critical)</option>
                <option value="Within 45 mins">Within 45 mins</option>
                <option value="Within 2 hours">Within 2 hours</option>
                <option value="Within 6 hours">Within 6 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Patient Trauma Reference / ID</label>
              <input
                type="text"
                required
                value={patientReferenceId}
                onChange={(e) => setPatientReferenceId(e.target.value)}
                placeholder="e.g. PT-TRAUMA-991"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Blood Group & Component Selection */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-emerald-600" />
            <span>2. Required Component & Blood Group</span>
          </h2>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">Blood Group</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {bloodGroups.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`py-3 px-2 rounded-2xl text-xs font-black transition-all ${
                    bloodGroup === bg
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Component</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Required Units (Bags)</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Clinical Indications / Notes</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Specify clinical indication (e.g. polytrauma, massive transfusion protocol, crossmatch requirement)..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Step 3: Broadcast Confirmation */}
        <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                Ready to broadcast across {hospitals.length} participating hospitals
              </p>
              <p className="text-[11px] text-emerald-800">
                {requiredUnits} Units of {bloodGroup} {component} ({urgency})
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBroadcasting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isBroadcasting ? 'Broadcasting Grid Signal...' : 'Broadcast Emergency Signal'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
