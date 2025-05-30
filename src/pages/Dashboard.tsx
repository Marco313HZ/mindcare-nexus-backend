
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'SuperAdmin':
      return <SuperAdminDashboard />;
    case 'Doctor':
      return <DoctorDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
            <p className="text-gray-600">Please contact your administrator for access.</p>
          </div>
        </div>
      );
  }
};
