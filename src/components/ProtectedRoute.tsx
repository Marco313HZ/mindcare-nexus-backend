
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/pages/LandingPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user } = useAuth();

  if (!user) {
    window.location.href = '/';
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role.toLowerCase() === 'superadmin') {
      window.location.href = '/super-admin';
    } else if (user.role.toLowerCase() === 'doctor') {
      window.location.href = '/doctor';
    } else {
      window.location.href = '/';
    }
    return null;
  }

  return <>{children}</>;
};
