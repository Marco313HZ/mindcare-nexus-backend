
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Calendar, FileText, Pill, MessageSquare, Heart } from 'lucide-react';

export const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Upcoming Appointments', value: '2', icon: Calendar, color: 'text-blue-600' },
    { title: 'Active Treatments', value: '1', icon: FileText, color: 'text-green-600' },
    { title: 'Current Medications', value: '3', icon: Pill, color: 'text-purple-600' },
    { title: 'Unread Messages', value: '1', icon: MessageSquare, color: 'text-orange-600' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'treatments', label: 'My Treatments' },
    { id: 'medications', label: 'Medications' },
    { id: 'chat', label: 'Messages' },
    { id: 'forum', label: 'Forum' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your mental health journey</p>
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

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Therapy Session</p>
                      <p className="text-sm text-gray-600">Tomorrow at 2:00 PM with Dr. Smith</p>
                    </div>
                    <Badge>Tomorrow</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Follow-up Consultation</p>
                      <p className="text-sm text-gray-600">Next week at 10:00 AM with Dr. Johnson</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Daily Wellness Tips
                </CardTitle>
                <CardDescription>Helpful tips for your mental health journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm">Practice deep breathing exercises for 5 minutes daily to reduce anxiety.</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <p className="text-sm">Maintain a regular sleep schedule to improve your mood and mental clarity.</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <p className="text-sm">Consider journaling your thoughts and feelings to track your progress.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader>
              <CardTitle>My Appointments</CardTitle>
              <CardDescription>View and manage your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Appointments management interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Treatments Tab */}
        {activeTab === 'treatments' && (
          <Card>
            <CardHeader>
              <CardTitle>My Treatments</CardTitle>
              <CardDescription>Track your treatment progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Treatment tracking interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <Card>
            <CardHeader>
              <CardTitle>My Medications</CardTitle>
              <CardDescription>View your prescribed medications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Medications tracking interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your healthcare team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Messaging interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <Card>
            <CardHeader>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Connect with others on similar journeys</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Forum interface will be implemented here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
