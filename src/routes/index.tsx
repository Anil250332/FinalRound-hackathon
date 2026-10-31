import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { AppLayout } from '../layouts/AppLayout';

// Public Landing Page
import { LandingPage } from '../pages/landing/LandingPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Super Admin Pages
import { SuperAdminOverviewPage } from '../pages/super-admin/SuperAdminOverviewPage';
import { HospitalManagementPage } from '../pages/super-admin/HospitalManagementPage';
import { UserManagementPage } from '../pages/super-admin/UserManagementPage';
import { EmergencyMonitoringPage } from '../pages/super-admin/EmergencyMonitoringPage';
import { AuditLogsPage } from '../pages/super-admin/AuditLogsPage';

// Hospital Admin Pages
import { HospitalOverviewPage } from '../pages/hospital-admin/HospitalOverviewPage';
import { StaffManagementPage } from '../pages/hospital-admin/StaffManagementPage';
import { HospitalProfilePage } from '../pages/hospital-admin/HospitalProfilePage';
import { HospitalReportsPage } from '../pages/hospital-admin/HospitalReportsPage';

// Blood Bank Officer Pages
import { BloodBankOverviewPage } from '../pages/blood-bank/BloodBankOverviewPage';
import { BloodInventoryPage } from '../pages/blood-bank/BloodInventoryPage';
import { IncomingRequestsPage } from '../pages/blood-bank/IncomingRequestsPage';
import { OffersReservationsPage } from '../pages/blood-bank/OffersReservationsPage';

// Emergency Coordinator Pages
import { CoordinatorOverviewPage } from '../pages/emergency/CoordinatorOverviewPage';
import { CreateEmergencyRequestPage } from '../pages/emergency/CreateEmergencyRequestPage';
import { EmergencyNetworkPage } from '../pages/emergency/EmergencyNetworkPage';
import { RequestDetailsPage } from '../pages/emergency/RequestDetailsPage';
import { TransferTrackingPage } from '../pages/emergency/TransferTrackingPage';

export const AppRoutes: React.FC = () => {
  const { activeRole } = useAppSelector((state) => state.auth);

  const getDefaultRouteForRole = () => {
    switch (activeRole) {
      case 'SUPER_ADMIN':
        return '/super-admin/overview';
      case 'HOSPITAL_ADMIN':
        return '/hospital-admin/overview';
      case 'BLOOD_BANK_OFFICER':
        return '/blood-bank/overview';
      case 'EMERGENCY_COORDINATOR':
        return '/coordinator/overview';
      default:
        return '/super-admin/overview';
    }
  };

  return (
    <Routes>
      {/* Public Landing Page at Root */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<AppLayout />}>
        {/* Super Admin Routes */}
        <Route path="/super-admin/overview" element={<SuperAdminOverviewPage />} />
        <Route path="/super-admin/hospitals" element={<HospitalManagementPage />} />
        <Route path="/super-admin/users" element={<UserManagementPage />} />
        <Route path="/super-admin/emergency-monitoring" element={<EmergencyMonitoringPage />} />
        <Route path="/super-admin/audit-logs" element={<AuditLogsPage />} />

        {/* Hospital Admin Routes */}
        <Route path="/hospital-admin/overview" element={<HospitalOverviewPage />} />
        <Route path="/hospital-admin/staff" element={<StaffManagementPage />} />
        <Route path="/hospital-admin/profile" element={<HospitalProfilePage />} />
        <Route path="/hospital-admin/reports" element={<HospitalReportsPage />} />

        {/* Blood Bank Officer Routes */}
        <Route path="/blood-bank/overview" element={<BloodBankOverviewPage />} />
        <Route path="/blood-bank/inventory" element={<BloodInventoryPage />} />
        <Route path="/blood-bank/incoming-requests" element={<IncomingRequestsPage />} />
        <Route path="/blood-bank/offers-reservations" element={<OffersReservationsPage />} />

        {/* Emergency Coordinator Routes */}
        <Route path="/coordinator/overview" element={<CoordinatorOverviewPage />} />
        <Route path="/coordinator/create-request" element={<CreateEmergencyRequestPage />} />
        <Route path="/coordinator/network" element={<EmergencyNetworkPage />} />
        <Route path="/coordinator/requests" element={<RequestDetailsPage />} />
        <Route path="/coordinator/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/coordinator/transfers" element={<TransferTrackingPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
