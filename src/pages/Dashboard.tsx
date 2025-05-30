
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboard } from './dashboards/SuperAdminDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { PatientDashboard } from './dashboards/PatientDashboard';

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
    case 'Patient':
      return <PatientDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h1>
            <p className="text-gray-600">Your account role is not recognized.</p>
          </div>
        </div>
      );
  }
};
