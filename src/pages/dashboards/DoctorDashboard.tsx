import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { AppointmentManagement } from '@/components/AppointmentManagement';
import { Users, Calendar, FileText, MessageSquare } from 'lucide-react';

export const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'My Patients', value: '28', icon: Users, color: 'text-blue-600' },
    { title: 'Today\'s Appointments', value: '6', icon: Calendar, color: 'text-green-600' },
    { title: 'Active Treatments', value: '15', icon: FileText, color: 'text-purple-600' },
    { title: 'New Messages', value: '3', icon: MessageSquare, color: 'text-orange-600' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'My Patients' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'medications', label: 'Medications' },
    { id: 'chat', label: 'Chat' },
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
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">9:00 AM - Initial Consultation</p>
                      <p className="text-sm text-gray-600">John Smith - Depression screening</p>
                    </div>
                    <Badge>Upcoming</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">11:00 AM - Follow-up Session</p>
                      <p className="text-sm text-gray-600">Sarah Johnson - Anxiety treatment</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2:00 PM - Therapy Session</p>
                      <p className="text-sm text-gray-600">Michael Brown - PTSD therapy</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && <AppointmentManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <Card>
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Manage your assigned patients</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Patient management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
              <CardDescription>Manage patient treatment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Treatment plans management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
              <CardDescription>Manage patient medications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Medications management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <Card>
            <CardHeader>
              <CardTitle>Chat & Messages</CardTitle>
              <CardDescription>Communicate with patients and colleagues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Chat interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
