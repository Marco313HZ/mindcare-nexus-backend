
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { AppointmentManagement } from '@/components/AppointmentManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { Users, Calendar, FileText, Archive } from 'lucide-react';

export const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'My Patients', value: '28', icon: Users, color: 'text-blue-600' },
    { title: 'Today\'s Appointments', value: '6', icon: Calendar, color: 'text-green-600' },
    { title: 'Completed Appointments', value: '15', icon: FileText, color: 'text-purple-600' },
    { title: 'Patient Records', value: '125', icon: Archive, color: 'text-orange-600' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'My Patients' },
    { id: 'archive', label: 'Archive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your patients and appointments</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Completed Appointments</CardTitle>
                <CardDescription>Your completed appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">9:00 AM - Initial Consultation</p>
                      <p className="text-sm text-gray-600">John Smith - Depression screening</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">11:00 AM - Follow-up Session</p>
                      <p className="text-sm text-gray-600">Sarah Johnson - Anxiety follow-up</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2:00 PM - Therapy Session</p>
                      <p className="text-sm text-gray-600">Michael Brown - PTSD therapy</p>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && <AppointmentManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && <PatientManagement />}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Archive</CardTitle>
              <CardDescription>Patient history, appointments, and records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-gray-600">Last appointment: Dec 5, 2024 - Depression screening completed</p>
                    <p className="text-sm text-gray-500">Total appointments: 8 | Status: Active</p>
                  </div>
                  <Badge>View History</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Last appointment: Dec 4, 2024 - Anxiety follow-up completed</p>
                    <p className="text-sm text-gray-500">Total appointments: 12 | Status: Active</p>
                  </div>
                  <Badge>View History</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Michael Brown</p>
                    <p className="text-sm text-gray-600">Last appointment: Dec 3, 2024 - PTSD therapy completed</p>
                    <p className="text-sm text-gray-500">Total appointments: 6 | Status: Active</p>
                  </div>
                  <Badge>View History</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
