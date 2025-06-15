
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { DoctorManagement } from '@/components/DoctorManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { Users, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';

export const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'patients', label: 'Patients' }
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch doctors count
      const doctorsResponse = await fetch(`${API_BASE_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch patients count
      const patientsResponse = await fetch(`${API_BASE_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (doctorsResponse.ok && patientsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        const patientsData = await patientsResponse.json();
        
        setStats({
          totalDoctors: doctorsData.length,
          totalPatients: patientsData.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalDoctors: 0,
        totalPatients: 0
      });
    }
  };

  const statsCards = [
    { title: 'Total Doctors', value: stats.totalDoctors.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Total Patients', value: stats.totalPatients.toString(), icon: UserPlus, color: 'text-green-600' }
  ];

  const getWelcomeMessage = () => {
    if (!user?.full_name) return 'Welcome';
    
    const firstName = user.full_name.split(' ')[0];
    if (user.role === 'SuperAdmin') {
      return `Welcome, ${firstName} Admin`;
    }
    return `Welcome, ${user.full_name}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-2">Manage your psychiatric center operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="mb-2"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stat.value === '0' ? 'No data found yet' : stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.totalDoctors > 0 || stats.totalPatients > 0 ? (
                    <>
                      {stats.totalDoctors > 0 && (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Doctor Management</p>
                            <p className="text-sm text-gray-600">{stats.totalDoctors} doctors registered in the system</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      )}
                      {stats.totalPatients > 0 && (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Patient Management</p>
                            <p className="text-sm text-gray-600">{stats.totalPatients} patients registered in the system</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No recent activity found yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && <DoctorManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && <PatientManagement />}
      </div>
    </div>
  );
};
