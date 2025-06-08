
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { DoctorManagement } from '@/components/DoctorManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { Users, UserPlus, Calendar, MessageSquare } from 'lucide-react';

export const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Doctors', value: '24', icon: Users, color: 'text-blue-600' },
    { title: 'Total Patients', value: '156', icon: UserPlus, color: 'text-green-600' },
    { title: 'Completed Appointments', value: '12', icon: Calendar, color: 'text-purple-600' },
    { title: 'New Messages', value: '8', icon: MessageSquare, color: 'text-orange-600' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'patients', label: 'Patients' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">New doctor registration</p>
                      <p className="text-sm text-gray-600">Dr. Sarah Johnson joined as a Psychiatrist</p>
                    </div>
                    <Badge>New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Appointment completed</p>
                      <p className="text-sm text-gray-600">Patient consultation with Dr. Smith</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">New contact message</p>
                      <p className="text-sm text-gray-600">Inquiry about services</p>
                    </div>
                    <Badge variant="outline">Message</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && <DoctorManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && <PatientManagement />}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader>
              <CardTitle>Appointments Management</CardTitle>
              <CardDescription>View and manage all appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Appointments management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Roles and permissions management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
              <CardDescription>View and respond to contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Messages management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
